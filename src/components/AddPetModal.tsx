import { useState, FormEvent, useRef } from 'react';
import { X, Sparkles, Dog, Cat, Camera, Upload, RefreshCw, Check } from 'lucide-react';
import { Pet } from '../types';
import { INITIAL_AFFINITY_PILLARS } from '../lib/mockData';
import { processImageFile, PRESET_PET_AVATARS } from '../lib/imageUtils';
import { MobileBottomSheet } from './ui/MobileBottomSheet';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Pet) => void;
}

export function AddPetModal({ isOpen, onClose, onAddPet }: AddPetModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sizeCategory, setSizeCategory] = useState<'Tiny' | 'Small' | 'Medium' | 'Large' | 'Giant'>('Medium');
  const [activityLevel, setActivityLevel] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (file: File) => {
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await processImageFile(file, 600, 0.88);
      setAvatarUrl(dataUrl);
    } catch (err) {
      console.error('Failed to process image', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now().toString().slice(-4);
    const parsedWeight = parseFloat(weight) || (species === 'Cat' ? 4.5 : 18.0);

    const rer = Math.round(70 * Math.pow(parsedWeight, 0.75));
    const dailyKcalGoal = Math.round(rer * (species === 'Cat' ? 1.2 : 1.4));
    const dailyGramsGoal = Math.round(dailyKcalGoal / 3.44);
    const targetPortionGrams = Math.round(dailyGramsGoal / (species === 'Cat' ? 3 : 2));

    const newPet: Pet = {
      id,
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'Cat' ? 'Domestic Shorthair' : 'Mixed Breed'),
      dateOfBirth,
      age: age.trim() || '1 year',
      sizeCategory,
      activityLevel,
      weight: parsedWeight,
      restingBpm: species === 'Cat' ? 120 : 80,
      mood: 'Curious & Loved 💖',
      healthStatus: 'Excellent',
      careScore: 85,
      level: 1,
      levelTitle: 'New Best Friend',
      xp: 0,
      nextLevelXp: 500,
      hungerPercent: 40,
      targetPortionGrams,
      dailyGramsFed: targetPortionGrams,
      dailyGramsGoal,
      dailyCaloriesFed: Math.round(targetPortionGrams * 3.44),
      dailyCaloriesGoal: dailyKcalGoal,
      nutritionPercent: Math.min(100, Math.round((targetPortionGrams / dailyGramsGoal) * 100)),
      lastFed: 'Just now',
      mealsToday: 1,
      maxMeals: 3,
      hydrationPercent: 80,
      hydrationMl: 300,
      goalMl: species === 'Cat' ? 250 : 700,
      pantryKg: 4.0,
      avatarUrl:
        avatarUrl ||
        (species === 'Cat'
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80'
          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80'),
      gender: 'Male',
      personality: ['Playful', 'Loving', 'Loyal'],
      vetClinic: 'Bay Paws Clinic • Dr. Elena Rostova',
      microchipId: '985' + Math.floor(100000000000 + Math.random() * 900000000000),
      bloodType: species === 'Cat' ? 'Type A' : 'DEA 1.1 Negative',
      allergies: ['None reported'],
      medicalConditions: ['None recorded'],
      emergencyContact: 'Primary Caregiver',
      emergencyPhone: '+1 (555) 019-2834',
      affinityPillars: INITIAL_AFFINITY_PILLARS.map((p) => ({ ...p, level: 1, resonance: 50 })),
      stepsToday: species === 'Cat' ? 3200 : 7500,
      stepsGoal: species === 'Cat' ? 5000 : 10000,
      caloriesBurned: species === 'Cat' ? 140 : 380,
      currentMl: species === 'Cat' ? 200 : 600,
      sleepHours: species === 'Cat' ? 14.0 : 9.5,
    };

    onAddPet(newPet);
    setName('');
    setBreed('');
    setAge('');
    setDateOfBirth('');
    setWeight('');
    onClose();
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>🐾</span>
          <span>Add Companion Profile</span>
        </div>
      }
      fullHeight={true}
    >
      <form onSubmit={handleSubmit} className="mt-2 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pet Name
          </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bella, Oliver, Charlie"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          {/* Species selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Species
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSpecies('Dog')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                  species === 'Dog'
                    ? 'bg-orange-50 border-[#ff6b4a] text-[#ff6b4a]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Dog className="w-4 h-4" />
                <span>Dog</span>
              </button>
              <button
                type="button"
                onClick={() => setSpecies('Cat')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                  species === 'Cat'
                    ? 'bg-orange-50 border-[#ff6b4a] text-[#ff6b4a]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Cat className="w-4 h-4" />
                <span>Cat</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Breed
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden, Corgi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Size Category
              </label>
              <select
                value={sizeCategory}
                onChange={(e) => setSizeCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
              >
                <option value="Tiny">Tiny</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Giant">Giant</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age (Optional, for reference)
            </label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 8 months"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 14.5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
          </div>

          {/* Pet Photo Upload */}
          <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Companion Photo (Optional)
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="text-[10px] text-slate-400 hover:text-slate-600"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handlePhotoUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-2xl bg-white border border-dashed border-orange-200 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 shadow-2xs hover:border-[#ff6b4a]"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Pet preview" className="w-full h-full object-cover" />
                ) : isProcessingPhoto ? (
                  <RefreshCw className="w-5 h-5 text-[#ff6b4a] animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-[#ff6b4a]" />
                )}
              </div>

              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ff6b4a]" />
                  <span>{isProcessingPhoto ? 'Processing...' : 'Choose Device Photo'}</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-1">
                  Or pick a matching avatar below:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              {PRESET_PET_AVATARS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(preset.url)}
                  title={preset.name}
                  className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 border transition ${
                    avatarUrl === preset.url
                      ? 'border-[#ff6b4a] ring-2 ring-orange-300'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#ff6b4a] hover:bg-[#ed4d26] text-white font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Profile & Sync</span>
          </button>
        </form>
    </MobileBottomSheet>
  );
}
