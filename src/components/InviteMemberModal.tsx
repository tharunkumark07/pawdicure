import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, X, Mail, UserCheck, Shield } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { inviteFamilyMember } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Owner' | 'Family Member' | 'Caregiver'>('Family Member');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the person’s full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    inviteFamilyMember({
      name: name.trim(),
      email: email.trim(),
      role,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Invite Caretaker to Household
              </h3>
              <p className="text-[11px] text-slate-500">Share live pet management</p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. David Miller, Dr. Elena Rostova"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="e.g. david@family.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Household Role &amp; Permissions
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('Family Member')}
                className={`p-2.5 rounded-xl text-center border text-xs transition ${
                  role === 'Family Member'
                    ? 'border-[#ff6b4a] bg-orange-50 text-[#ae3115] font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Family</div>
                <div className="text-[9px] text-slate-400">Full Daily Access</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('Caregiver')}
                className={`p-2.5 rounded-xl text-center border text-xs transition ${
                  role === 'Caregiver'
                    ? 'border-[#ff6b4a] bg-orange-50 text-[#ae3115] font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Caregiver</div>
                <div className="text-[9px] text-slate-400">Sitter / Vet / Walker</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('Owner')}
                className={`p-2.5 rounded-xl text-center border text-xs transition ${
                  role === 'Owner'
                    ? 'border-[#ff6b4a] bg-orange-50 text-[#ae3115] font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Co-Owner</div>
                <div className="text-[9px] text-slate-400">Admin Privileges</div>
              </button>
            </div>
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
              Send Household Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
