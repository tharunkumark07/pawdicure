import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Pet } from '../types';
import { Edit, X, Camera, Sparkles, Heart, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { processImageFile, PRESET_PET_AVATARS } from '../lib/imageUtils';
import { DeletePetModal } from './DeletePetModal';

interface EditPetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditPetProfileModal({ isOpen, onClose }: EditPetProfileModalProps) {
  const { activePet, updatePet, showToast } = useApp();

  const [name, setName] = useState(activePet.name);
  const [breed, setBreed] = useState(activePet.breed);
  const [dateOfBirth, setDateOfBirth] = useState(activePet.dateOfBirth || '');
  const [age, setAge] = useState(activePet.age);
  const [sizeCategory, setSizeCategory] = useState<'Tiny' | 'Small' | 'Medium' | 'Large' | 'Giant'>(activePet.sizeCategory || 'Medium');
  const [activityLevel, setActivityLevel] = useState<'Low' | 'Moderate' | 'High'>(activePet.activityLevel || 'Moderate');
  const [weight, setWeight] = useState(activePet.weight.toString());
  const [dailyGramsGoal, setDailyGramsGoal] = useState((activePet.dailyGramsGoal || 360).toString());
  const [maxMeals, setMaxMeals] = useState((activePet.maxMeals || 4).toString());
  const [gender, setGender] = useState(activePet.gender || 'Male');
  const [mood, setMood] = useState(activePet.mood);
  const [avatarUrl, setAvatarUrl] = useState(activePet.avatarUrl);
  const [allergies, setAllergies] = useState(activePet.allergies?.join(', ') || '');
  const [emergencyContact, setEmergencyContact] = useState(activePet.emergencyContact || '');
  const [emergencyPhone, setEmergencyPhone] = useState(activePet.emergencyPhone || '');
  const [error, setError] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (file: File) => {
    setIsProcessingPhoto(true);
    setError('');
    try {
      const dataUrl = await processImageFile(file, 600, 0.88);
      setAvatarUrl(dataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process uploaded image.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your pet's name.");
      return;
    }
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Enter a valid weight (e.g. 28.4).');
      return;
    }
    const parsedDailyGoal = parseFloat(dailyGramsGoal);
    const parsedMaxMeals = parseInt(maxMeals);

    const updated: Pet = {
      ...activePet,
      name: name.trim(),
      breed: breed.trim(),
      dateOfBirth,
      age: age.trim(),
      sizeCategory,
      activityLevel,
      weight: parsedWeight,
      dailyGramsGoal: isNaN(parsedDailyGoal) ? 360 : parsedDailyGoal,
      dailyCaloriesGoal: Math.round((isNaN(parsedDailyGoal) ? 360 : parsedDailyGoal) * 3.44),
      maxMeals: isNaN(parsedMaxMeals) ? 4 : parsedMaxMeals,
      gender: gender as any,
      mood: mood.trim(),
      avatarUrl: avatarUrl.trim() || activePet.avatarUrl,
      allergies: allergies
        ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      emergencyContact: emergencyContact.trim(),
      emergencyPhone: emergencyPhone.trim(),
    };

    updatePet(updated);
    onClose();
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6b4a]">
              <Edit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Edit Companion Profile
              </h3>
              <p className="text-[11px] text-slate-500">Live across entire app</p>
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
          {/* Avatar Preview & Quick Photo Upload */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-200 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center shadow-md hover:scale-110 transition"
                  title="Upload image"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1">
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-orange-50/50 transition active:scale-95"
                  >
                    {isProcessingPhoto ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#ff6b4a] animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#ff6b4a]" />
                    )}
                    <span>{isProcessingPhoto ? 'Processing...' : 'Upload Pet Photo'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Upload custom photo or pick from breed presets below:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
              {PRESET_PET_AVATARS.slice(0, 7).map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(preset.url)}
                  title={preset.name}
                  className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 border transition ${
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pet Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Breed *
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Size Category
              </label>
              <select
                value={sizeCategory}
                onChange={(e) => setSizeCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Daily Feed Limit (g)
              </label>
              <input
                type="number"
                value={dailyGramsGoal}
                onChange={(e) => setDailyGramsGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Meals Per Day Limit
            </label>
            <input
              type="number"
              value={maxMeals}
              onChange={(e) => setMaxMeals(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Daily Mood / Status
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Playful & Ready to Explore! 🎾"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Known Allergies (Comma separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Chicken byproduct, Penicillin, Pollen"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Phone #
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Pet Profile</span>
              </span>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Erase {activePet.name}</span>
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
              className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        <DeletePetModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            onClose();
          }}
          pet={activePet}
        />
      </div>
    </div>
  );
}
