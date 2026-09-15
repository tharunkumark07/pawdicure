import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Repeat,
  AlertTriangle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Reminder } from '../types';
import { AddReminderModal } from '../components/AddReminderModal';

export function RemindersView() {
  const {
    activePet,
    householdData,
    toggleReminder,
    snoozeReminder,
    deleteReminder,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  const reminders = (householdData.reminders || []).filter(
    (r) => r.petId === activePet.id
  );

  const filtered = reminders.filter((r) => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return !r.completed;
    if (filterType === 'completed') return r.completed;
    return r.type === filterType;
  });

  const pendingCount = reminders.filter((r) => !r.completed).length;

  const typeIcons: Record<Reminder['type'], string> = {
    feeding: '🍖',
    walk: '🐕',
    medication: '💊',
    vaccination: '💉',
    grooming: '✂️',
    vet: '🩺',
    custom: '✨',
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl p-4 sm:p-5 border border-amber-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold text-amber-900 shadow-2xs mb-1">
            <Bell className="w-3 h-3 text-amber-600" />
            <span>Smart Care Schedules</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            Reminders Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {pendingCount} pending task{pendingCount !== 1 ? 's' : ''} for {activePet.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddReminderOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' },
          { id: 'feeding', label: 'Feeding 🍖' },
          { id: 'medication', label: 'Meds 💊' },
          { id: 'walk', label: 'Walks 🐕' },
          { id: 'vaccination', label: 'Vaccines 💉' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
            <span className="text-3xl">🔔</span>
            <h3 className="font-heading font-bold text-sm text-slate-800">
              No reminders in this view
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Stay ahead of feeding times, medication schedules, and wellness routines.
            </p>
            <button
              type="button"
              onClick={() => setIsAddReminderOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold"
            >
              + Create First Reminder
            </button>
          </div>
        ) : (
          filtered.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 rounded-3xl border transition-all ${
                rem.completed
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                  : 'bg-white border-slate-100 shadow-xs hover:border-orange-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition shrink-0 ${
                      rem.completed
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'border-2 border-slate-300 text-transparent hover:border-[#ff6b4a]'
                    }`}
                    title={rem.completed ? 'Mark pending' : 'Complete reminder (+25 XP)'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm">{typeIcons[rem.type]}</span>
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          rem.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {rem.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          rem.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : rem.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rem.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3 h-3 text-[#ff6b4a]" />
                        <span>{rem.time}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{rem.date}</span>
                      </span>

                      {rem.repeat !== 'None' && (
                        <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>{rem.repeat}</span>
                        </span>
                      )}
                    </div>

                    {rem.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mt-2 border border-slate-100">
                        {rem.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!rem.completed && (
                    <button
                      type="button"
                      onClick={() => snoozeReminder(rem.id)}
                      className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition"
                      title="Snooze 30 mins"
                    >
                      Snooze
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddReminderModal
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
      />
    </div>
  );
}
