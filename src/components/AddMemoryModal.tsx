import { useState, FormEvent } from 'react';
import { Camera, Sparkles, X, MapPin, Tag } from 'lucide-react';
import { BondMemory } from '../types';

interface AddMemoryModalProps {
  isOpen: boolean;
  petName: string;
  onClose: () => void;
  onSave: (memory: Omit<BondMemory, 'id' | 'createdAt'>) => void;
}

const MOOD_TAGS = [
  '🌊 Ocean Pup',
  '💖 Pure Affection',
  '⚡ Brave Heart',
  '🎓 Clever Trickster',
  '🌲 Forest Hiker',
  '🛋️ Couch Snuggler',
];

export function AddMemoryModal({
  isOpen,
  petName,
  onClose,
  onSave,
}: AddMemoryModalProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedTag, setSelectedTag] = useState(MOOD_TAGS[0]);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      petId: 'milo',
      title: title.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      xp: 100,
      location: location.trim() || 'Cozy Home',
      desc: desc.trim() || `${petName} created a beautiful new milestone memory today!`,
      tags: [selectedTag, location ? `📍 ${location}` : '✨ Cherished'],
      imageUrl,
    });

    setTitle('');
    setLocation('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-[#ff6b4a]">
              <Camera className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-base text-slate-800">
              Record New Memory with {petName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Milestone Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Milestone Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conquered Lake Kayak Ride"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location / Setting</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Carmel Beach, Living Room Mat, Pine Ridge Trail"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          {/* Mood Tag Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Mood Resonance</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    selectedTag === tag
                      ? 'bg-orange-100 text-[#ff6b4a] border border-orange-200 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Story Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cherished Story & Observations
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe Milo's reaction, joyful zoomies, brave moments, or funny details..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          {/* Simulated Photo Dropper */}
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center bg-slate-50/70">
            <div className="flex flex-col items-center justify-center">
              <Camera className="w-7 h-7 text-[#ff6b4a] mb-1" />
              <span className="text-xs font-bold text-slate-700">
                {petName}'s Milestone Snapshot
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Saved into Verified Journey Vault (Syncs across devices)
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            id="save-memory-submit-btn"
            type="submit"
            className="w-full py-3 rounded-full bg-[#ff6b4a] hover:bg-[#ed4d26] text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save to Journey (+100 Bond XP)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
