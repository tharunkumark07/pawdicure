import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { RoutineTemplate } from '../../services/routineService';

interface RoutineTemplateCardProps {
  template: RoutineTemplate;
  onApply: (template: RoutineTemplate) => void;
}

export function RoutineTemplateCard({ template, onApply }: RoutineTemplateCardProps) {
  return (
    <div className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] transition flex flex-col justify-between space-y-4 shadow-xs">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-[var(--background-alt)] border border-[var(--card-border)]">
            {template.icon}
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)]/10 text-[var(--primary)]">
            {template.speciesRecommendation}
          </span>
        </div>
        <h4 className="text-sm font-heading font-black text-[var(--text)]">
          {template.name}
        </h4>
        <p className="text-xs text-[var(--text-muted)] line-clamp-2">
          {template.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
        <span className="text-[10px] font-bold text-[var(--text-muted)]">
          {template.items.length} Activities included
        </span>
        <button
          type="button"
          onClick={() => onApply(template)}
          className="px-3.5 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
