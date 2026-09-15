import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';
import { Reminder } from '../types';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddReminderModal({ isOpen, onClose }: AddReminderModalProps) {
  const { activePet, addReminder } = useApp();
  const [type, setType] = useState<Reminder['type']>('feeding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState<Reminder['repeat']>('Daily');
  const [priority, setPriority] = useState<Reminder['priority']>('medium');
  const [notes, setNotes] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the reminder.');
      return;
    }
    if (!time) {
      setError('Select a reminder time.');
      return;
    }

    addReminder({
      petId: activePet.id,
      type,
      title: title.trim(),
      date,
      time,
      repeat,
      priority,
      completed: false,
      enabled,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const reminderTypeOptions: { type: Reminder['type']; label: string; icon: string }[] = [
    { type: 'feeding', label: 'Feeding', icon: '🍖' },
    { type: 'walk', label: 'Walk / Agility', icon: '🐕' },
    { type: 'medication', label: 'Medication', icon: '💊' },
    { type: 'vaccination', label: 'Vaccination', icon: '💉' },
    { type: 'grooming', label: 'Grooming', icon: '✂️' },
    { type: 'vet', label: 'Vet Visit', icon: '🩺' },
    { type: 'custom', label: 'Custom Care', icon: '✨' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Create Smart Reminder
              </h3>
              <p className="text-[11px] text-slate-500">For {activePet.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Reminder Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {reminderTypeOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    setType(opt.type);
                    if (!title) {
                      setTitle(opt.type.charAt(0).toUpperCase() + opt.type.slice(1) + ` for ${activePet.name}`);
                    }
                  }}
                  className={`p-2 rounded-xl text-center flex flex-col items-center gap-0.5 border text-[11px] transition ${
                    type === opt.type
                      ? 'border-[#ff6b4a] bg-orange-50 text-[#ae3115] font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g. Evening Supper + Salmon Oil Topper"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Repeat Frequency
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              >
                <option value="None">Once (No repeat)</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Critical)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              Push Notification &amp; Sound
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions / Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ensure water bottle is filled before heading to the trail."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              Set Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
