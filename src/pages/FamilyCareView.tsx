import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Heart,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { InviteMemberModal } from '../components/InviteMemberModal';

export function FamilyCareView() {
  const {
    activePet,
    householdData,
    removeFamilyMember,
    showToast,
  } = useApp();

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const members = householdData.familyMembers || [];

  return (
    <div className="flex flex-col w-full pb-12 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-3xl p-4 sm:p-5 border border-emerald-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-900 shadow-2xs mb-1">
            <Users className="w-3 h-3 text-emerald-600" />
            <span>Shared Household Care</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            Family &amp; Caregivers
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Synchronized pet care between family, dog walkers &amp; sitters
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Household Members List */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
          Active Household Members ({members.length})
        </h3>

        <div className="space-y-2.5">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-100 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">
                      {member.name}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        member.role === 'Owner'
                          ? 'bg-orange-100 text-[#ae3115]'
                          : member.role === 'Family Member'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {member.email}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">
                      Co-caring: <strong>{activePet.name}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                      Live sync active
                    </span>
                  </div>
                </div>
              </div>

              {member.role !== 'Owner' ? (
                <button
                  type="button"
                  onClick={() => removeFamilyMember(member.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition"
                  title="Remove from household"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400 px-2">Primary</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Synchronized Care Activity Feed */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ff6b4a]" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Recent Caregiver Timeline
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Realtime
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {(activePet.species === 'Cat' ? [
            {
              author: 'Sarah Miller',
              action: `Fed ${activePet.name} morning meal (65g) + Pumpkin Puree`,
              time: 'Today, 8:15 AM',
              icon: '🍖',
            },
            {
              author: 'David Miller',
              action: `Completed 25-minute indoor play loop & interactive wand chase with ${activePet.name}`,
              time: 'Today, 10:30 AM',
              icon: '🐱',
            },
            {
              author: 'Dr. Mark Wu',
              action: `Logged routine feline wellness examination & updated vaccine passport`,
              time: 'Yesterday, 3:20 PM',
              icon: '🩺',
            },
          ] : [
            {
              author: 'Sarah Miller',
              action: `Fed ${activePet.name} morning meal (180g) + Salmon Oil`,
              time: 'Today, 8:15 AM',
              icon: '🍖',
            },
            {
              author: 'David Miller',
              action: `Completed 45-minute agility park walk with ${activePet.name}`,
              time: 'Today, 10:30 AM',
              icon: '🐕',
            },
            {
              author: 'Dr. Elena Rostova',
              action: `Logged routine wellness examination & updated immunization passport`,
              time: 'Yesterday, 3:20 PM',
              icon: '🩺',
            },
          ]).map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-sm">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900">{item.author}</div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {item.action}
                </div>
                <div className="text-slate-400 text-[9px] mt-0.5 font-mono">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
