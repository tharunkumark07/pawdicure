import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Plus,
  Heart,
  Trash2,
  Calendar,
  Sparkles,
  Smile,
  X,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';
import { BondMemory } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { MobileBottomSheet } from '../components/ui/MobileBottomSheet';
import { TapButton } from '../components/ui/TapButton';

export function MemoriesView() {
  const {
    activePet,
    householdData,
    addMemory,
    deleteMemory,
    likeMemory,
    showToast,
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
  );
  const [mood, setMood] = useState('Happy & Playful 🎾');

  const memories = (householdData.memories || []).filter(
    (m) => m.petId === activePet.id
  );

  const handleShare = async (mem: any) => {
    triggerHaptic('light');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activePet.name}'s Memory`,
          text: mem.caption || mem.desc,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          showToast('Failed to share memory.', 'error');
        }
      }
    } else {
      showToast('Sharing is not supported on this device.', 'error');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      showToast('Please add a memory caption!', 'error');
      return;
    }

    addMemory({
      petId: activePet.id,
      imageUrl,
      caption: caption.trim(),
      date,
      mood,
      likes: 1,
    });

    setCaption('');
    setIsAddOpen(false);
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 rounded-3xl p-4 sm:p-5 border border-rose-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-[10px] font-bold text-rose-900 shadow-2xs mb-1">
            <Camera className="w-3 h-3 text-rose-600" />
            <span>Companion Journal</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            {activePet.name}'s Memories
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cherish moments, daily milestones &amp; growth photos
          </p>
        </div>

        <TapButton
          onClick={() => setIsAddOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-[#ff6b4a] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Moment</span>
        </TapButton>
      </div>

      {/* Grid of Memories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
          >
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
              <img
                src={mem.imageUrl}
                alt={mem.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[10px] font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-400" />
                <span>{mem.date}</span>
              </div>
              <button
                type="button"
                onClick={() => deleteMemory(mem.id)}
                className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/40 hover:bg-red-600 text-white transition sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                title="Delete memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  {mem.mood}
                </span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {mem.caption}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 truncate pr-2">
                  {activePet.name} • {activePet.breed}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <TapButton
                    onClick={() => handleShare(mem)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold transition"
                    title="Share memory"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </TapButton>
                  <TapButton
                    onClick={() => likeMemory(mem.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{mem.likes}</span>
                  </TapButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      <MobileBottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        fullHeight={true}
        title={
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Log New Memory
            </h3>
          </div>
        }
      >
        <form onSubmit={handleCreate} className="mt-2 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Preview / Select Preset
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {sampleImages.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        imageUrl === url
                          ? 'border-[#ff6b4a] ring-2 ring-orange-200 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caption / Story *
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Milo conquered the big boulder trail at Redwood Grove!"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mood / Tag
                  </label>
                  <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
                >
                  Save to Journal (+35 XP)
                </button>
              </div>
            </form>
      </MobileBottomSheet>
    </div>
  );
}
