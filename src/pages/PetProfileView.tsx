import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Edit3,
  Heart,
  Shield,
  Phone,
  Activity,
  Award,
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import { EditPetProfileModal } from '../components/EditPetProfileModal';
import { PetPhotoUploadModal } from '../components/PetPhotoUploadModal';
import { DeletePetModal } from '../components/DeletePetModal';
import { PetBadgesSection } from '../components/PetBadgesSection';
import { evaluatePetBadges } from '../lib/badgeSystem';
import { Pet } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function PetProfileView() {
  const {
    activePet,
    householdData,
    setActivePetId,
    addPet,
    navigate,
  } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const evaluatedBadges = evaluatePetBadges(activePet);
  const unlockedBadges = evaluatedBadges.filter((b) => b.isUnlocked);

  const petList: Pet[] = Array.isArray(householdData.pets)
    ? householdData.pets
    : Object.values(householdData.pets || {});

  const handleAddNewPet = () => {
    const newP: Pet = {
      id: 'pet-' + Date.now(),
      name: 'Bella',
      species: 'Dog',
      breed: 'French Bulldog',
      age: '1y 2m',
      weight: 12.4,
      gender: 'Female',
      avatarUrl:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
      mood: 'Playful & Curious 🧸',
      careScore: 88,
      level: 2,
      levelTitle: 'Playful Buddy',
      xp: 450,
      nextLevelXp: 1000,
      hungerPercent: 40,
      nutritionPercent: 60,
      lastFed: '3h ago',
      mealsToday: 2,
      maxMeals: 3,
      hydrationPercent: 75,
      hydrationMl: 400,
      pantryKg: 4.0,
      healthStatus: 'Excellent',
      bloodType: 'DEA 1.1 Negative',
      personality: ['Playful', 'Curious', 'Loving'],
      medicalConditions: [],
      targetPortionGrams: 120,
      dailyGramsFed: 60,
      dailyGramsGoal: 240,
      dailyCaloriesFed: 210,
      dailyCaloriesGoal: 820,
      goalMl: 800,
      restingBpm: 76,
      microchipId: '985-141-209-441-002',
      vetClinic: 'Bay Paws Veterinary Specialty Center',
      emergencyContact: 'Sarah Miller',
      emergencyPhone: '+1 (555) 019-2834',
      allergies: ['Beef', 'Wheat gluten'],
      affinityPillars: activePet.affinityPillars || [],
      stepsToday: 4200,
      stepsGoal: 9000,
      caloriesBurned: 240,
      currentMl: 400,
      sleepHours: 10.5,
    };
    addPet(newP);
  };

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Pet Switcher Strip */}
      <Card className="flex items-center justify-between p-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {petList.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePetId(p.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition ${
                p.id === activePet.id
                  ? 'bg-orange-50 border border-orange-200 text-[#ae3115] font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs">{p.name}</span>
            </button>
          ))}
        </div>

        <Button variant="secondary" className="px-3 py-1.5 text-xs h-auto" onClick={handleAddNewPet}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Pet</span>
        </Button>
      </Card>

      {/* Main Profile Card */}
      <Card className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => setIsPhotoUploadOpen(true)}>
              <img
                src={activePet.avatarUrl}
                alt={activePet.name}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-orange-100 shadow-md group-hover:opacity-90 transition"
              />
              <button
                type="button"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#ff6b4a] text-white flex items-center justify-center shadow-md ring-2 ring-white hover:scale-110 active:scale-95 transition"
                title="Upload pet photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-black text-2xl text-slate-900">
                  {activePet.name}
                </h1>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Level {activePet.level}
                </span>

                {/* Digital Badge Icons Strip */}
                {unlockedBadges.length > 0 && (
                  <div className="flex items-center gap-1">
                    {unlockedBadges.map((badge) => (
                      <span
                        key={badge.id}
                        title={`${badge.name} • ${badge.tier} Tier (${badge.difficulty})`}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 border border-amber-300 text-xs shadow-2xs hover:scale-110 transition cursor-help"
                      >
                        {badge.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {activePet.breed} • {activePet.gender} • {activePet.age} {activePet.dateOfBirth ? `(DOB: ${activePet.dateOfBirth})` : ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  Size: {activePet.sizeCategory} | Activity: {activePet.activityLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsPhotoUploadOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff6b4a] hover:underline"
                >
                  <Upload className="w-3 h-3" />
                  <span>Change Profile Photo</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="secondary" className="p-2.5 h-auto" title="Upload Photo" onClick={() => setIsPhotoUploadOpen(true)}>
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="primary" className="p-2.5 h-auto" title="Edit Profile" onClick={() => setIsEditOpen(true)}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="danger" className="p-2.5 h-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" title="Delete Profile" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Biometrics Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Weight
            </span>
            <span className="font-extrabold text-sm text-slate-900 font-heading">
              {activePet.weight} kg
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Resting BPM
            </span>
            <span className="font-extrabold text-sm text-slate-900 font-heading">
              {activePet.restingBpm}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Care Score
            </span>
            <span className="font-extrabold text-sm text-emerald-600 font-heading">
              {activePet.careScore}%
            </span>
          </div>
        </div>
      </Card>

      {/* Digital Badges & Extreme Milestone System */}
      <PetBadgesSection pet={activePet} />

      {/* Clinical & Emergency Info Card */}
      <Card className="space-y-3">
        <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
          Registry &amp; Emergency Contacts
        </h3>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">ISO Microchip ID</span>
            <span className="font-mono font-bold text-slate-900 select-all">
              {activePet.microchipId}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Veterinary Clinic</span>
            <span className="font-semibold text-slate-900 text-right">
              {activePet.vetClinic}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Emergency Caregiver</span>
            <span className="font-semibold text-slate-900">
              {activePet.emergencyContact} ({activePet.emergencyPhone})
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Last Wellness Checkup</span>
            <span className="font-semibold text-slate-900">
              {activePet.lastCheckup || '2026-05-18'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <Button variant="secondary" className="flex-1 py-2.5 text-xs h-auto" onClick={() => navigate('/health')}>
            Open Medical Chart
          </Button>
          <Button variant="danger" className="flex-1 py-2.5 text-xs h-auto" onClick={() => navigate('/emergency')}>
            Emergency Pass
          </Button>
        </div>
      </Card>

      {/* Danger Zone: Permanent Profile Deletion */}
      <Card className="border border-red-100 bg-red-50/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xs text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Danger Zone: Permanent Profile Deletion</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Permanently erase {activePet.name}'s profile and all medical records from database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs shrink-0 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete {activePet.name}</span>
          </button>
        </div>
      </Card>

      <EditPetProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <PetPhotoUploadModal
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        pet={activePet}
      />

      <DeletePetModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        pet={activePet}
      />
    </div>
  );
}
