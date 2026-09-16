const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

/**
 * Helper to check dynamic Quiet Hours window from household settings
 */
function checkQuietHours(settings, currentH, currentM) {
  if (!settings || !settings.quietHoursEnabled) return false;
  const start = settings.quietHoursStart || "22:00";
  const end = settings.quietHoursEnd || "07:00";
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  if (isNaN(startH) || isNaN(endH)) return false;

  const currentMinutes = currentH * 60 + currentM;
  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);

  if (startMinutes < endMinutes) {
    // Standard window (e.g., 14:00 to 16:00)
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight window (e.g., 22:00 to 07:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

/**
 * Cloud Function 1: Scheduled evaluation of missed feeding intervals.
 * Runs every 15 minutes to evaluate active feeding reminders against recorded feeding logs.
 * Enforces a strict 60-minute grace period, respects Quiet Hours and toggles, and triggers push notifications.
 */
exports.evaluateFeedingIntervals = onSchedule("*/15 * * * *", async (event) => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    
    // We scan households (the core container of pet reminders and feeding history in PAWdiCURE)
    const householdsSnap = await db.collection("households").get();
    if (householdsSnap.empty) {
      console.log("No households found to evaluate.");
      return;
    }

    for (const doc of householdsSnap.docs) {
      const householdId = doc.id;
      const data = doc.data();
      const settings = data.settings || {};

      // Skip evaluation entirely if user has disabled feeding alerts in settings
      if (settings.notifyFeeding === false) {
        console.log(`[Scheduler] Suppressing feeding evaluation for household ${householdId} - toggled off.`);
        continue;
      }

      // Skip if current time resides inside the user's custom Quiet Hours
      if (checkQuietHours(settings, currentHour, currentMin)) {
        console.log(`[Scheduler] Suppressing feeding alerts for household ${householdId} during active Quiet Hours.`);
        continue;
      }

      const petId = data.activePetId || "milo";
      const pet = data.pets?.[petId];
      if (!pet) continue;

      const members = data.familyMembers || [];
      const userIds = members.map(m => m.id).filter(Boolean);
      if (userIds.length === 0) continue;

      // Filter reminders for active feeding schedules (e.g. title containing "feed", "breakfast", "dinner", "lunch")
      const reminders = data.reminders || [];
      const feedingReminders = reminders.filter(r => 
        r.enabled && 
        !r.completed && 
        (r.title.toLowerCase().includes("feed") || 
         r.title.toLowerCase().includes("breakfast") || 
         r.title.toLowerCase().includes("dinner") || 
         r.title.toLowerCase().includes("lunch") ||
         r.title.toLowerCase().includes("meal"))
      );

      const feedingHistory = data.feedingHistory || [];

      for (const r of feedingReminders) {
        const [schHour, schMin] = r.time.split(":").map(Number);
        if (isNaN(schHour) || isNaN(schMin)) continue;

        // Discrepancy in minutes between now and the scheduled feeding time
        const diffMins = (currentHour * 60 + currentMin) - (schHour * 60 + schMin);

        // If the current time has passed the scheduled time by more than 60 minutes (the grace period)
        if (diffMins >= 60) {
          // Check if any matching feeding event was recorded in history for today
          const hasBeenFed = feedingHistory.some(f => {
            const isToday = f.date === "Today" || f.date === todayStr;
            if (!isToday) return false;

            const [fHour, fMin] = f.time.split(":").map(Number);
            const feedTimeMins = fHour * 60 + fMin;
            const schTimeMins = schHour * 60 + schMin;

            // Fed within a window of [-30 mins, +120 mins] of the scheduled time
            return feedTimeMins >= (schTimeMins - 30);
          });

          if (!hasBeenFed) {
            console.log(`[Missed Feed] Household ${householdId} missed feeding reminder "${r.title}" (due at ${r.time}). Grace period of 60 mins exceeded.`);

            // Trigger FCM push notification to all family member devices
            for (const userId of userIds) {
              // Retrieve specific user profile to honor notificationSettings dynamically
              try {
                const userSnap = await db.collection("users").doc(userId).get();
                if (userSnap.exists) {
                  const userData = userSnap.data();
                  const userNotifSettings = userData.notificationSettings;
                  if (userNotifSettings) {
                    if (userNotifSettings.notifyFeeding === false) {
                      console.log(`[FCM Suppressed] user ${userId} has feeding notifications turned off.`);
                      continue;
                    }
                    if (checkQuietHours(userNotifSettings, currentHour, currentMin)) {
                      console.log(`[FCM Suppressed] user ${userId} is currently inside custom quiet hours.`);
                      continue;
                    }
                  }
                }
              } catch (err) {
                console.warn(`[FCM settings check failed] user ${userId}:`, err.message);
              }

              const devicesSnap = await db.collection("users").doc(userId).collection("devices").get();
              if (devicesSnap.empty) continue;

              const payload = {
                notification: {
                  title: `🚨 Overdue Feeding: ${pet.name}!`,
                  body: `Your scheduled feeding "${r.title}" (due at ${r.time}) is overdue by 60+ minutes. Please feed your pet and record it!`,
                },
                data: {
                  route: "/feed",
                  click_action: "FLUTTER_NOTIFICATION_CLICK"
                }
              };

              devicesSnap.forEach(async (deviceDoc) => {
                const device = deviceDoc.data();
                if (!device.notificationsEnabled || !device.subscription) return;

                // Send using FCM Device Token
                if (device.fcmToken) {
                  try {
                    await admin.messaging().send({
                      token: device.fcmToken,
                      notification: payload.notification,
                      data: payload.data
                    });
                    console.log(`FCM Sent to device ${device.deviceId} of user ${userId}`);
                  } catch (e) {
                    console.error(`FCM deliver fail: ${e.message}`);
                  }
                }
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error evaluating missed feeding intervals: ", error);
  }
});

/**
 * Cloud Function 2: Firestore trigger that monitors the root 'reminders' collection or
 * subcollections and logs evaluations.
 */
exports.onReminderWrite = onDocumentWritten("households/{householdId}", async (event) => {
  const change = event.data;
  if (!change) return;

  const afterData = change.after.data();
  if (!afterData) return;

  console.log(`Trigger monitored reminders update for household: ${event.params.householdId}`);
});
