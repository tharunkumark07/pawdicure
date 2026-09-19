import React from 'react';
import { RoutineItem } from '../../types';
import { RoutineTimePicker } from './RoutineTimePicker';
import { Trash2, Copy, ChevronUp, ChevronDown, Clock, MapPin, Sparkles } from 'lucide-react';

interface RoutineActivityEditorProps {
  item: RoutineItem;
  index: number;
  totalCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<RoutineItem>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function RoutineActivityEditor({
  item,
  index,
  totalCount,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: RoutineActivityEditorProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-xs transition-all">
      {/* Header bar */}
      <div
        onClick={onToggleExpand}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--background-alt)] transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[var(--background-alt)] border border-[var(--card-border)] flex items-center justify-center text-lg shrink-0">
            {item.icon || '🐾'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text)] truncate">{item.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[var(--primary)]/10 text-[var(--primary)]">
                {item.scheduledTime}
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
              <span className="capitalize">{item.activityType}</span>
              <span>•</span>
              <span>{item.durationMinutes || 30} mins</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-7 h-7 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--card-border)] disabled:opacity-40 flex items-center justify-center text-[var(--text-muted)] cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={onMoveDown}
            className="w-7 h-7 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--card-border)] disabled:opacity-40 flex items-center justify-center text-[var(--text-muted)] cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="w-7 h-7 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Editor Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[var(--card-border)] bg-[var(--background-alt)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1">Activity Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1">Activity Type</label>
              <select
                value={item.activityType}
                onChange={(e) => onUpdate({ activityType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                <option value="walk">🐾 Walk / Hike</option>
                <option value="feeding">🍖 Feeding / Meal</option>
                <option value="water">💧 Water Refill</option>
                <option value="medication">💊 Medication</option>
                <option value="grooming">✨ Grooming</option>
                <option value="play">🎾 Play / Agility</option>
                <option value="training">🎓 Training</option>
                <option value="bath">🛁 Bath</option>
                <option value="rest">🌙 Rest / Sleep</option>
                <option value="custom">⭐ Custom Care</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RoutineTimePicker
              value={item.scheduledTime}
              onChange={(t) => onUpdate({ scheduledTime: t })}
              label="Scheduled Time"
            />
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1">Duration (min)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={item.durationMinutes || 30}
                onChange={(e) => onUpdate({ durationMinutes: parseInt(e.target.value, 10) || 30 })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1">Priority</label>
              <select
                value={item.priority || 'medium'}
                onChange={(e) => onUpdate({ priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                <option value="high">High Priority (+35 XP)</option>
                <option value="medium">Medium Priority (+25 XP)</option>
                <option value="low">Low Priority (+20 XP)</option>
              </select>
            </div>
          </div>

          {item.activityType === 'feeding' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">Portion Quantity</label>
                <input
                  type="number"
                  value={item.quantity || 180}
                  onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">Unit</label>
                <select
                  value={item.unit || 'g'}
                  onChange={(e) => onUpdate({ unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)]"
                >
                  <option value="g">Grams (g)</option>
                  <option value="cups">Cups</option>
                  <option value="ml">Milliliters (ml)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-1">Notes / Instructions (Optional)</label>
            <input
              type="text"
              value={item.notes || ''}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="e.g. Add omega supplement, use harness"
              className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-bold text-[var(--text)] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
