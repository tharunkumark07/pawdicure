import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase securely on the server using identical applet credentials
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // -------------------------------------------------------------
  // SECURE BACKEND BADGE & MISSION EVALUATOR API
  // -------------------------------------------------------------
  app.post("/api/evaluate-achievements", async (req, res) => {
    try {
      const { householdId, userId } = req.body;
      if (!householdId || !userId) {
        return res.status(400).json({ error: "Missing householdId or userId" });
      }

      // Fetch current household state directly from Firestore (trusted source of truth)
      const householdRef = doc(db, 'households', householdId);
      const householdSnap = await getDoc(householdRef);
      if (!householdSnap.exists()) {
        return res.status(404).json({ error: "Household not found" });
      }
      const household = householdSnap.data();

      // Retrieve pet state
      const activePetId = household.activePetId || 'milo';
      const pet = household.pets[activePetId];
      if (!pet) {
        return res.status(404).json({ error: "Active pet not found" });
      }

      const pillars = pet.affinityPillars || [];
      const maxedPillarsCount = pillars.filter((p: any) => p.resonance >= 100).length;
      const currentXp = pet.xp || 0;
      const streakDays = household.streakDays || 0;
      const tasksCompletedCount = household.routineTasks?.filter((t: any) => t.completed).length || 0;
      const remindersCompletedCount = household.reminders?.filter((r: any) => r.completed).length || 0;
      const memoriesCount = household.memories?.length || 0;
      const medsCount = household.medications?.filter((m: any) => m.takenToday).length || 0;
      const vacsCount = household.vaccines?.filter((v: any) => v.completed).length || 0;
      const familyCount = household.familyMembers?.length || 0;
      const favoritesCount = household.places?.filter((p: any) => p.isFavorite).length || 0;

      // Check safety completeness (Microchip, Vet Clinic, Emergency Contacts filled)
      const isSafetyComplete = !!(pet.microchipId && pet.vetClinic && pet.emergencyContact && pet.emergencyPhone);

      // Define our comprehensive Badge catalog on the server for secure calculations
      const serverBadges = [
        {
          id: 'badge-nurturing-guardian',
          name: 'Nurturing Guardian',
          tier: 'Bronze',
          icon: '🌱',
          description: 'Awarded for completing 10 daily routine care tasks for your companion.',
          requirementText: 'Complete 10 routine care tasks',
          category: 'CARE',
          difficulty: 'Hard',
          estimatedTime: '2 - 3 Days',
          isUnlocked: tasksCompletedCount >= 10,
          progressPercent: Math.min(100, Math.round((tasksCompletedCount / 10) * 100)),
          progressLabel: `${tasksCompletedCount} / 10 Tasks`
        },
        {
          id: 'badge-absolute-caregiver',
          name: 'Absolute Caregiver',
          tier: 'Gold',
          icon: '💖',
          description: 'Recognizes outstanding care and persistence in routine task logging.',
          requirementText: 'Complete 100 routine care tasks',
          category: 'CARE',
          difficulty: 'Extreme',
          estimatedTime: '1 - 2 Months',
          isUnlocked: tasksCompletedCount >= 100,
          progressPercent: Math.min(100, Math.round((tasksCompletedCount / 100) * 100)),
          progressLabel: `${tasksCompletedCount} / 100 Tasks`
        },
        {
          id: 'badge-shield-immunity',
          name: 'Shield of Immunity',
          tier: 'Silver',
          icon: '🛡️',
          description: 'Awarded when your companion has all core vaccination records completed and verified current.',
          requirementText: 'Verify 3 vaccination records as current',
          category: 'HEALTH',
          difficulty: 'Hard',
          estimatedTime: 'Clinical Schedule',
          isUnlocked: vacsCount >= 3,
          progressPercent: Math.min(100, Math.round((vacsCount / 3) * 100)),
          progressLabel: `${vacsCount} / 3 Vaccinations`
        },
        {
          id: 'badge-regimen-specialist',
          name: 'Regimen Specialist',
          tier: 'Gold',
          icon: '💊',
          description: 'Successfully complete 15 scheduled medication doses on time.',
          requirementText: 'Administer 15 medication doses on time',
          category: 'HEALTH',
          difficulty: 'Extreme',
          estimatedTime: 'Multi-week regime',
          isUnlocked: medsCount >= 15,
          progressPercent: Math.min(100, Math.round((medsCount / 15) * 100)),
          progressLabel: `${medsCount} / 15 Doses`
        },
        {
          id: 'badge-culinary-master',
          name: 'Culinary Master',
          tier: 'Bronze',
          icon: '🍲',
          description: 'Nourish your companion with 20 carefully portioned and balanced meals.',
          requirementText: 'Log 20 feeding records with toppers',
          category: 'NUTRITION',
          difficulty: 'Hard',
          estimatedTime: '1 - 2 Weeks',
          isUnlocked: (household.feedingHistory?.length || 0) >= 20,
          progressPercent: Math.min(100, Math.round(((household.feedingHistory?.length || 0) / 20) * 100)),
          progressLabel: `${household.feedingHistory?.length || 0} / 20 Feeds`
        },
        {
          id: 'badge-hydration-champion',
          name: 'Hydration Champion',
          tier: 'Silver',
          icon: '💧',
          description: 'Ensure continuous fresh, cool water fountain access, satisfying hydration goals.',
          requirementText: 'Maintain hydration targets 7 times',
          category: 'NUTRITION',
          difficulty: 'Hard',
          estimatedTime: '1 Week',
          isUnlocked: pet.hydrationPercent >= 100,
          progressPercent: pet.hydrationPercent >= 100 ? 100 : pet.hydrationPercent,
          progressLabel: `${pet.hydrationPercent}% hydration status`
        },
        {
          id: 'badge-trail-blazer',
          name: 'Trail Blazer',
          tier: 'Gold',
          icon: '🏃',
          description: 'Walk long loops with your pet to cover significant distances over active outdoor expeditions.',
          requirementText: 'Reach Level 8 Outdoor Activity',
          category: 'ACTIVITY',
          difficulty: 'Extreme',
          estimatedTime: '3 - 6 Months',
          isUnlocked: currentXp >= 8000,
          progressPercent: Math.min(100, Math.round((currentXp / 8000) * 100)),
          progressLabel: `${currentXp.toLocaleString()} / 8,000 Bond XP`
        },
        {
          id: 'badge-twin-flame',
          name: 'Twin Flame',
          tier: 'Mythic',
          icon: '🔥',
          description: 'Forge an unbreakable lifepath bond. Unlocked upon reaching Level 15 Bond tier.',
          requirementText: 'Reach Level 15 Bond Tier',
          category: 'RELATIONSHIP',
          difficulty: 'Insane',
          estimatedTime: '6 - 12 Months',
          isUnlocked: pet.level >= 15,
          progressPercent: Math.min(100, Math.round((pet.level / 15) * 100)),
          progressLabel: `Level ${pet.level} / 15`
        },
        {
          id: 'badge-chronicle-keeper',
          name: 'Chronicle Keeper',
          tier: 'Bronze',
          icon: '📸',
          description: 'Commemorate the milestones of pet companionship by adding 5 memories to your journal.',
          requirementText: 'Record 5 journal memories',
          category: 'MEMORIES',
          difficulty: 'Hard',
          estimatedTime: '2 - 4 Weeks',
          isUnlocked: memoriesCount >= 5,
          progressPercent: Math.min(100, Math.round((memoriesCount / 5) * 100)),
          progressLabel: `${memoriesCount} / 5 Memories`
        },
        {
          id: 'badge-lifelong-archivist',
          name: 'Lifelong Archivist',
          tier: 'Gold',
          icon: '📚',
          description: 'Assemble a rich personal gallery of 20 unforgettable companionship memories.',
          requirementText: 'Record 20 journal memories',
          category: 'MEMORIES',
          difficulty: 'Extreme',
          estimatedTime: '6 - 12 Months',
          isUnlocked: memoriesCount >= 20,
          progressPercent: Math.min(100, Math.round((memoriesCount / 20) * 100)),
          progressLabel: `${memoriesCount} / 20 Memories`
        },
        {
          id: 'badge-global-wanderer',
          name: 'Global Wanderer',
          tier: 'Silver',
          icon: '🗺️',
          description: 'Save 5 favorite pet-friendly parks, clinics, groomers, or cafes in your local exploration list.',
          requirementText: 'Favorite 5 local places',
          category: 'EXPLORATION',
          difficulty: 'Hard',
          estimatedTime: '2 - 4 Weeks',
          isUnlocked: favoritesCount >= 5,
          progressPercent: Math.min(100, Math.round((favoritesCount / 5) * 100)),
          progressLabel: `${favoritesCount} / 5 Favorites`
        },
        {
          id: 'badge-daily-devotee',
          name: 'Daily Devotee',
          tier: 'Silver',
          icon: '⭐',
          description: 'Log into PAWdiCURE and perform care operations for 14 consecutive days.',
          requirementText: 'Maintain a 14-day check-in streak',
          category: 'CONSISTENCY',
          difficulty: 'Hard',
          estimatedTime: '14 Days Unbroken',
          isUnlocked: streakDays >= 14,
          progressPercent: Math.min(100, Math.round((streakDays / 14) * 100)),
          progressLabel: `${streakDays} / 14 Days`
        },
        {
          id: 'badge-yearly-sentinel',
          name: 'Yearly Sentinel',
          tier: 'Mythic',
          icon: '⏳',
          description: 'The standard of supreme reliability. Maintain daily check-ins for 30 consecutive days.',
          requirementText: 'Maintain a 30-day check-in streak',
          category: 'CONSISTENCY',
          difficulty: 'Insane',
          estimatedTime: '30 Days Unbroken',
          isUnlocked: streakDays >= 30,
          progressPercent: Math.min(100, Math.round((streakDays / 30) * 100)),
          progressLabel: `${streakDays} / 30 Days`
        },
        {
          id: 'badge-fortress-commander',
          name: 'Fortress Commander',
          tier: 'Silver',
          icon: '🔐',
          description: 'Provide total legal and medical safety precautions: Microchip, Emergency Contact, and Vet registry completely filled out.',
          requirementText: 'Complete all safety profile fields',
          category: 'SAFETY',
          difficulty: 'Hard',
          estimatedTime: 'Immediate Setup',
          isUnlocked: isSafetyComplete,
          progressPercent: isSafetyComplete ? 100 : 50,
          progressLabel: isSafetyComplete ? 'Setup Complete' : 'Incomplete Fields'
        },
        {
          id: 'badge-household-synergy',
          name: 'Household Synergy',
          tier: 'Silver',
          icon: '👥',
          description: 'Collaborate with your family. Invite at least 2 family members or caregivers to synchronize care duties.',
          requirementText: 'Invite 2 family members',
          category: 'COMMUNITY',
          difficulty: 'Hard',
          estimatedTime: '1 Day',
          isUnlocked: familyCount >= 2,
          progressPercent: Math.min(100, Math.round((familyCount / 2) * 100)),
          progressLabel: `${familyCount} / 2 Members`
        },
        {
          id: 'badge-septenary-ascendance',
          name: 'Septenary Ascendance',
          tier: 'Mythic',
          icon: '🌟',
          description: 'Simultaneously reach 100% resonance in all 7 bonding pillars through flawless continuous care.',
          requirementText: 'Max out all 7 affinity pillars to 100%',
          category: 'MASTERY',
          difficulty: 'Insane',
          estimatedTime: '2 - 3 Years',
          isUnlocked: maxedPillarsCount >= 7,
          progressPercent: Math.min(100, Math.round((maxedPillarsCount / 7) * 100)),
          progressLabel: `${maxedPillarsCount} / 7 Pillars Maxed`
        },
        {
          id: 'badge-eternal-transcendence',
          name: 'Eternal Bond of Eternity',
          tier: 'Transcendent',
          icon: '🪐',
          description: 'The supreme lifetime achievement. Accumulate 100,000 Total Bond XP and maintain absolute 100% resonance across every single affinity pillar.',
          requirementText: '100,000 XP & All 7 Pillars at 100%',
          category: 'LEGENDARY',
          difficulty: 'Near Impossible',
          estimatedTime: '3 - 5+ Years',
          isUnlocked: currentXp >= 100000 && maxedPillarsCount >= 7,
          progressPercent: Math.min(100, Math.round(((Math.min(1, currentXp / 100000) + (maxedPillarsCount / 7)) / 2) * 100)),
          progressLabel: `${currentXp.toLocaleString()} / 100,000 XP • ${maxedPillarsCount}/7 Pillars`
        }
      ];

      // Define our Active Missions and evaluate their completed tasks
      const serverMissions = [
        {
          id: 'mission-ultimate-caregiver',
          title: 'The Ultimate Caregiver',
          description: 'Demonstrate consistent, complete daily routine tasks.',
          category: 'CARE',
          badgeRewardId: 'badge-absolute-caregiver',
          tasks: [
            { id: 'task-100-routines', text: 'Complete 100 routine tasks', completed: tasksCompletedCount >= 100, current: tasksCompletedCount, target: 100 },
            { id: 'task-30-streak', text: 'Complete 30 consecutive daily check-ins', completed: streakDays >= 30, current: streakDays, target: 30 },
            { id: 'task-10-reminders', text: 'Log 10 completed reminders', completed: remindersCompletedCount >= 10, current: remindersCompletedCount, target: 10 }
          ]
        },
        {
          id: 'mission-lifelong-companion',
          title: 'Lifelong Companion',
          description: 'Forge an unbreakable bond through shared milestones and memories.',
          category: 'RELATIONSHIP',
          badgeRewardId: 'badge-twin-flame',
          tasks: [
            { id: 'task-lvl-15', text: 'Reach Level 15 Bond', completed: pet.level >= 15, current: pet.level, target: 15 },
            { id: 'task-20-memories', text: 'Record 20 memories in the journal', completed: memoriesCount >= 20, current: memoriesCount, target: 20 },
            { id: 'task-3-pillars', text: 'Reach 100% resonance in at least 3 pillars', completed: maxedPillarsCount >= 3, current: maxedPillarsCount, target: 3 }
          ]
        },
        {
          id: 'mission-guardian-wellness',
          title: 'Guardian of Wellness',
          description: 'Maintain strict healthcare, hydration, and dietary goals.',
          category: 'HEALTH',
          badgeRewardId: 'badge-regimen-specialist',
          tasks: [
            { id: 'task-hydration-7', text: 'Maintain 100% hydration status', completed: pet.hydrationPercent >= 100, current: pet.hydrationPercent >= 100 ? 1 : 0, target: 1 },
            { id: 'task-15-meds', text: 'Administer 15 scheduled medication doses', completed: medsCount >= 15, current: medsCount, target: 15 },
            { id: 'task-3-vaccines', text: 'Verify 3 vaccination records as current', completed: vacsCount >= 3, current: vacsCount, target: 3 }
          ]
        }
      ];

      // Atomic batch update of badge and mission states inside Cloud Firestore
      const batch = writeBatch(db);
      const newlyUnlocked: any[] = [];

      for (const badge of serverBadges) {
        const badgeProgressRef = doc(db, 'users', userId, 'badgeProgress', badge.id);
        const prevSnap = await getDoc(badgeProgressRef);
        const prevData = prevSnap.exists() ? prevSnap.data() : null;

        const isNewlyUnlocked = badge.isUnlocked && (!prevData || !prevData.isUnlocked);
        if (isNewlyUnlocked) {
          newlyUnlocked.push({ type: 'badge', item: badge });
        }

        batch.set(badgeProgressRef, {
          badgeId: badge.id,
          userId,
          isUnlocked: badge.isUnlocked,
          progressPercent: badge.progressPercent,
          progressLabel: badge.progressLabel,
          unlockedAt: badge.isUnlocked ? (prevData?.unlockedAt || Date.now()) : null,
          showcase: prevData ? (prevData.showcase || false) : false
        }, { merge: true });
      }

      for (const mission of serverMissions) {
        const missionProgressRef = doc(db, 'users', userId, 'missionProgress', mission.id);
        const prevSnap = await getDoc(missionProgressRef);
        const prevData = prevSnap.exists() ? prevSnap.data() : null;

        const completedTasks = mission.tasks.filter((t: any) => t.completed).map((t: any) => t.id);
        const isCompleted = completedTasks.length === mission.tasks.length;
        const progressPercent = Math.round((completedTasks.length / mission.tasks.length) * 100);

        const isNewlyCompleted = isCompleted && (!prevData || prevData.status !== 'Completed');
        if (isNewlyCompleted) {
          newlyUnlocked.push({ type: 'mission', item: mission });
        }

        batch.set(missionProgressRef, {
          missionId: mission.id,
          userId,
          status: isCompleted ? 'Completed' : 'Active',
          completedTasks,
          progressPercent,
          completedAt: isCompleted ? (prevData?.completedAt || Date.now()) : null
        }, { merge: true });
      }

      await batch.commit();

      return res.json({
        success: true,
        badges: serverBadges,
        missions: serverMissions,
        newlyUnlocked
      });

    } catch (err: any) {
      console.error("Evaluation Error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve Vite app in development, statically compiled build folder in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
