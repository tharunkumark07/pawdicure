import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  Search,
  Star,
  Award,
  ShieldCheck,
  AlertCircle,
  Calendar,
  ChevronRight,
  Info,
  Map as MapIcon,
  List,
  Sparkles,
  Plus,
  CheckCircle2,
  Heart,
  ArrowLeft,
  Activity,
  Zap,
} from 'lucide-react';
import { VaccineRecord } from '../types';

interface Clinic {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'mobile';
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  phone: string;
  openNow: boolean;
  hours: string;
  image: string;
  doctor: string;
  features: string[];
  pricing: 'low' | 'moderate' | 'premium';
  services: string[];
  packages: Array<{ name: string; price: string; desc: string }>;
  coords: { x: number; y: number }; // Percentage offsets for custom map
}

const CARE_CLINICS: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'Bay Paws Veterinary Specialty & Emergency Center',
    type: 'hospital',
    address: '1420 Marina Blvd, San Francisco, CA',
    distance: '0.8 miles away',
    rating: 4.9,
    reviews: 215,
    phone: '+1 (555) 019-2834',
    openNow: true,
    hours: 'Open 24/7 (Emergency Service)',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    doctor: 'Dr. Elena Rostova',
    features: ['24/7 Emergency Triage', 'Surgical Suites', 'Diagnostics & Radiology', 'Canine/Feline ICU'],
    pricing: 'premium',
    services: ['DHPP 5-in-1', 'Rabies Quad', 'FVRCP', 'Urgent Surgery', 'Microchipping'],
    packages: [
      { name: 'Full Trauma & Diagnostic Exam', price: '$120', desc: 'Comprehensive triage, vital scanning, and diagnostic review.' },
      { name: 'Core Pediatric Protection Package', price: '$85', desc: 'Full initial checkup, core immunization shots, and de-worming.' },
    ],
    coords: { x: 35, y: 30 },
  },
  {
    id: 'clinic-2',
    name: 'Sunset Heights Low-Cost Vaccine Hub',
    type: 'clinic',
    address: '2240 Sunset Blvd, San Francisco, CA',
    distance: '1.5 miles away',
    rating: 4.8,
    reviews: 142,
    phone: '+1 (415) 332-9011',
    openNow: true,
    hours: '8:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    doctor: 'Dr. Liam Vance',
    features: ['Affordable Booster Clinic', 'Express Vaccine Fast Lane', 'Walk-ins Welcomed', 'Anti-Parasite Treatments'],
    pricing: 'low',
    services: ['Rabies Shot', 'DHPP Booster', 'FVRCP (Feline Core)', 'Bordetella', 'Microchipping'],
    packages: [
      { name: 'Low-Cost Core Booster Bundle', price: '$45', desc: 'Rabies + DHPP or FVRCP booster + essential flea/tick chewable.' },
      { name: 'Companion Microchip & Registration', price: '$25', desc: 'National database chip insertion with lifetime activation.' },
    ],
    coords: { x: 75, y: 55 },
  },
  {
    id: 'clinic-3',
    name: 'Marina Feline Specialty & Wellness Center',
    type: 'clinic',
    address: '890 Chestnut St, San Francisco, CA',
    distance: '1.2 miles away',
    rating: 4.9,
    reviews: 96,
    phone: '+1 (415) 890-5511',
    openNow: true,
    hours: '9:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    doctor: 'Dr. Sophia Vance',
    features: ['100% Cat-Only Space', 'Feline Friendly Certified', 'Calming Pheromone Diffusers', 'Feline Nutrition Advisor'],
    pricing: 'moderate',
    services: ['FVRCP Booster', 'FeLV (Feline Leukemia)', 'Rabies Quad', 'Gentle Claw Trims'],
    packages: [
      { name: 'Premium Purrfect Wellness Shield', price: '$65', desc: 'FVRCP + FeLV booster + full ear-to-tail wellness examination.' },
    ],
    coords: { x: 50, y: 70 },
  },
  {
    id: 'clinic-4',
    name: 'Paws & Claws Mobile Veterinary Unit',
    type: 'mobile',
    address: 'Serving Presidio & Marina Districts, CA',
    distance: '3.1 miles away',
    rating: 4.7,
    reviews: 68,
    phone: '+1 (555) 729-1090',
    openNow: false,
    hours: '10:00 AM - 4:00 PM',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    doctor: 'Dr. Chloe Mercier',
    features: ['At-Home Diagnostics', 'Stress-Free Environment', 'Custom Itinerary Schedules', 'Tailored Senior Care'],
    pricing: 'moderate',
    services: ['Core Vaccinations', 'Nail Buffing', 'In-Home Wellness Check', 'Minor Wound Tending'],
    packages: [
      { name: 'Stress-Free Home Immunization', price: '$75', desc: 'Mobile visit charge + choice of core vaccine + vital checkup.' },
    ],
    coords: { x: 20, y: 65 },
  },
  {
    id: 'clinic-5',
    name: 'Presidio 24-Hour Trauma & Urgent Care',
    type: 'hospital',
    address: '420 Golden Gate Forest Rd, San Francisco, CA',
    distance: '2.1 miles away',
    rating: 4.9,
    reviews: 310,
    phone: '+1 (415) 561-1224',
    openNow: true,
    hours: 'Open 24/7 (Emergency Service)',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
    doctor: 'Dr. James Carter',
    features: ['Level 1 Pet Trauma ICU', 'Full Orthopedic Surgery', 'Oxygen Therapy Suites', 'Rapid Lab Blood Testing'],
    pricing: 'premium',
    services: ['DHPP 5-in-1', 'Rabies Quad', 'Emergency Fluid Therapy', 'Antidote & Toxin Flush'],
    packages: [
      { name: 'Critical Diagnostic Assessment', price: '$150', desc: 'Immediate trauma triage, blood chemistry count, and oxygen check.' },
    ],
    coords: { x: 15, y: 25 },
  },
];

export function NearbyCareView() {
  const {
    activePet,
    householdData,
    addVetVisit,
    addReminder,
    updateHousehold,
    showToast,
    navigate,
    addXp,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  // Booking Flow State
  const [bookingClinic, setBookingClinic] = useState<Clinic | null>(null);
  const [bookingVaccineId, setBookingVaccineId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-25');
  const [bookingTime, setBookingTime] = useState<string>('10:30 AM');
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);

  // Filtered Clinics list
  const filteredClinics = CARE_CLINICS.filter((c) => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Get active pet's incomplete vaccines to schedule
  const petVaccines = (householdData.vaccines || []).filter(
    (v) => v.petId === activePet.id
  );
  const pendingVaccines = petVaccines.filter((v) => !v.completed);

  // Handle Vaccine Booking completion
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClinic) return;

    const chosenVaccine = petVaccines.find((v) => v.id === bookingVaccineId);
    const vaccineName = chosenVaccine ? chosenVaccine.name : 'Routine Wellness Booster';

    // 1. Log Vet Visit
    addVetVisit({
      petId: activePet.id,
      vetName: bookingClinic.doctor,
      clinic: bookingClinic.name,
      date: bookingDate,
      reason: `Scheduled Immunization: ${vaccineName}`,
      diagnosis: 'Immunization Booster administered successfully.',
      treatment: `Administered ${vaccineName} booster & checked key biometric vitals.`,
      notes: `Booked online via Pawdicure Care Locator. Next dose scheduled with clinic.`,
      cost: bookingClinic.pricing === 'low' ? '$45.00' : bookingClinic.pricing === 'moderate' ? '$65.00' : '$85.00',
    });

    // 2. Mark Vaccine as completed in state
    if (bookingVaccineId) {
      updateHousehold((prev) => ({
        ...prev,
        vaccines: (prev.vaccines || []).map((v) =>
          v.id === bookingVaccineId
            ? {
                ...v,
                completed: true,
                status: 'Verified Current',
                administeredDate: bookingDate,
                vet: `${bookingClinic.doctor} @ ${bookingClinic.name}`,
              }
            : v
        ),
      }));
    }

    // 3. Add care reminder for next checkup/next booster
    const nextBoosterYear = parseInt(bookingDate.slice(0, 4)) + 1;
    const nextBoosterDate = `${nextBoosterYear}${bookingDate.slice(4)}`;
    addReminder({
      petId: activePet.id,
      type: 'vaccination',
      title: `${vaccineName} Booster Reminder`,
      time: '09:00 AM',
      date: nextBoosterDate,
      repeat: 'Once',
      notes: `Booster renewal checkup scheduled with ${bookingClinic.doctor}.`,
      completed: false,
    });

    // 4. Boost pawPoints as reward
    updateHousehold((prev) => ({
      ...prev,
      pawPoints: (prev.pawPoints || 0) + 20,
    }));
    addXp(30, `Booked ${vaccineName} appointment online`);
    showToast(`Earned +20 Paw Points for scheduling care! ✨`, 'success');

    setIsBookedSuccess(true);
  };

  return (
    <div className="flex flex-col w-full pb-12 space-y-4 animate-in fade-in duration-200">
      {/* Back to Health Link & Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/health')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Center</span>
        </button>

        <span className="text-[10px] bg-red-50 text-[#ff6b4a] border border-orange-200 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>24/7 Veterinary Coverage Active</span>
        </span>
      </div>

      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl p-4 sm:p-5 border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-[#ae3115] shadow-2xs mb-1">
            <ShieldCheck className="w-3 h-3 text-[#ff6b4a]" />
            <span>Immunization &amp; Urgent Care Locator</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-tight">
            Vaccine Centres &amp; Hospitals
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Locate 24/7 trauma clinics, certified low-cost vaccine stations, and schedule boosters instantly.
          </p>
        </div>

        {/* List / Map Toggle */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Clinic List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'map'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Live Map</span>
          </button>
        </div>
      </div>

      {/* Main Filter & Search Hub */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, vaccines (Rabies, DHPP, FVRCP), emergency vets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Care Locations', icon: '🩺' },
            { id: 'hospital', label: '24/7 Emergency Hospitals', icon: '🚨' },
            { id: 'clinic', label: 'Booster & Vaccine Clinics', icon: '💉' },
            { id: 'mobile', label: 'Mobile Veterinary Units', icon: '🚐' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFilterType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                filterType === type.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alert Banner for pending vaccines if any exist */}
      {pendingVaccines.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-amber-900">
              {activePet.name} has pending immunization booster windows
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
              Select one of the low-cost clinics or hospitals below to schedule these core vaccinations and maintain their vital clinical health passport.
            </p>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {pendingVaccines.map((v) => (
                <span
                  key={v.id}
                  className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold"
                >
                  ⏳ {v.name} (Due: {v.dueDate})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MAP MODE */}
      {viewMode === 'map' ? (
        <div className="relative bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner h-[400px] flex flex-col items-center justify-center p-4 text-center">
          {/* Custom vector grids mimicking street map segments */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />

          {/* Major Map Roads overlay visual */}
          <div className="absolute top-1/3 left-0 right-0 h-4 bg-slate-200 -rotate-6 shadow-xs border-y border-slate-300" />
          <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-slate-200 rotate-12 shadow-xs border-x border-slate-300" />
          <div className="absolute right-1/4 top-0 bottom-0 w-3 bg-slate-200 -rotate-45 shadow-xs border-x border-slate-300" />

          {/* Custom Parks visual mapping */}
          <div className="absolute top-[10%] left-[45%] w-32 h-24 rounded-full bg-emerald-100/50 blur-md" />
          <div className="absolute bottom-[15%] right-[10%] w-24 h-24 rounded-full bg-sky-100/50 blur-md" />

          {/* User Marker */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-[9px] font-black tracking-wider uppercase shadow-md mb-1 border border-orange-500 animate-pulse">
              📍 Current Location
            </div>
            <div className="w-5 h-5 rounded-full bg-orange-600 ring-4 ring-white shadow-xl flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>

          {/* Map Clinic Pin Elements */}
          {filteredClinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;
            return (
              <button
                key={clinic.id}
                type="button"
                style={{ top: `${clinic.coords.y}%`, left: `${clinic.coords.x}%` }}
                onClick={() => setSelectedClinic(clinic)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 flex flex-col items-center group cursor-pointer"
              >
                {/* Popover micro tag */}
                <div className={`px-2 py-0.5 rounded-lg text-[9px] font-bold shadow-md whitespace-nowrap mb-1 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white scale-110'
                    : 'bg-white text-slate-800 scale-95 border border-slate-200 group-hover:scale-100'
                }`}>
                  {clinic.name.split(' ')[0]} ({clinic.distance.split(' ')[0]}m)
                </div>

                {/* Marker Pin */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white transition-all ${
                  isSelected
                    ? 'bg-[#ff6b4a] scale-120 animate-bounce text-white'
                    : clinic.type === 'hospital'
                    ? 'bg-red-500 text-white group-hover:bg-red-600'
                    : clinic.type === 'clinic'
                    ? 'bg-blue-500 text-white group-hover:bg-blue-600'
                    : 'bg-emerald-500 text-white group-hover:bg-emerald-600'
                }`}>
                  {clinic.type === 'hospital' ? (
                    <span className="text-[10px]">🚨</span>
                  ) : clinic.type === 'clinic' ? (
                    <span className="text-[10px]">💉</span>
                  ) : (
                    <span className="text-[10px]">🚐</span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Active Overlay Card for map selection */}
          {selectedClinic ? (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl text-left flex gap-3 animate-in slide-in-from-bottom-3 duration-200 z-30">
              <img
                src={selectedClinic.image}
                alt={selectedClinic.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md mb-1 ${
                  selectedClinic.type === 'hospital'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : selectedClinic.type === 'clinic'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {selectedClinic.type}
                </span>
                <h3 className="font-heading font-black text-xs text-slate-900 truncate">
                  {selectedClinic.name}
                </h3>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{selectedClinic.address}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px]">
                  <span className="font-bold text-orange-600">{selectedClinic.distance}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    ★ {selectedClinic.rating}
                  </span>
                  <span className={`font-semibold ${selectedClinic.openNow ? 'text-emerald-600' : 'text-slate-400'}`}>
                    • {selectedClinic.openNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setBookingClinic(selectedClinic);
                    setIsBookedSuccess(false);
                    // Pre-select first pending vaccine if available
                    if (pendingVaccines.length > 0) {
                      setBookingVaccineId(pendingVaccines[0].id);
                    } else {
                      setBookingVaccineId('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[10px] font-bold shadow-sm transition active:scale-95 text-center whitespace-nowrap"
                >
                  Book Instant Booster
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClinic(null)}
                  className="px-3 py-1 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold text-center"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-xs text-slate-600 text-[10px] font-bold flex items-center justify-center gap-1.5">
              <span>🗺️ GPS Mapping Simulator: Tap any colored marker pin to show services &amp; schedule appointments.</span>
            </div>
          )}
        </div>
      ) : (
        /* VIEW: LIST MODE */
        <div className="space-y-4">
          {filteredClinics.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
              <span className="text-4xl">🔍</span>
              <h3 className="font-heading font-bold text-sm text-slate-800">No clinics match search criteria</h3>
              <p className="text-xs text-slate-500">Try modifying search tags or clearing filters.</p>
            </div>
          ) : (
            filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:border-orange-200 hover:shadow-md transition duration-200 space-y-3.5"
              >
                {/* Header Profile */}
                <div className="flex items-start gap-3">
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                        clinic.type === 'hospital'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : clinic.type === 'clinic'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {clinic.type}
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400">Rate:</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{clinic.rating}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">({clinic.reviews} reviews)</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-extrabold text-sm text-slate-900 leading-snug">
                      {clinic.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{clinic.address} • <strong>{clinic.distance}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clinic.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="text-slate-400">💼 Staff Doctor:</span>
                    <span className="text-slate-800 font-bold">{clinic.doctor}</span>
                  </div>
                </div>

                {/* Features & Supported Immunizations */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {clinic.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Vaccines Offered:
                    </span>
                    {clinic.services.map((srv, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5"
                      >
                        💉 {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Booking Panel */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">ESTIMATED COST</span>
                    <span className="text-xs font-bold text-slate-800">
                      {clinic.pricing === 'low' ? '💲 Budget-Friendly ($)' : clinic.pricing === 'premium' ? '💲💲💲 Specialty Premium ($$$)' : '💲💲 Moderate ($$)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${clinic.phone}`}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Call Clinic</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingClinic(clinic);
                        setIsBookedSuccess(false);
                        if (pendingVaccines.length > 0) {
                          setBookingVaccineId(pendingVaccines[0].id);
                        } else {
                          setBookingVaccineId('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Book Core Booster</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vaccine Advisory Checklist Info */}
      <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 p-4 rounded-3xl border border-blue-100/50 space-y-2">
        <h4 className="text-xs font-extrabold text-blue-900 flex items-center gap-1">
          <Info className="w-4 h-4 text-blue-500" />
          <span>General Immunization Guidance for Caregivers</span>
        </h4>
        <p className="text-[11px] text-blue-800/90 leading-relaxed">
          Maintaining clinical compliance with vaccination boosters is essential for preventing communicable diseases:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-blue-700/90 font-medium pl-1 list-disc list-inside">
          <li><strong>DHPP 5-in-1 Booster</strong> protects canines from Distemper, Hepatitis, Parvovirus, and Parainfluenza.</li>
          <li><strong>FVRCP Core Shot</strong> protects felines from Rhinotracheitis, Calicivirus, and Panleukopenia.</li>
          <li><strong>Rabies Protection</strong> is legally mandated across most municipalities with strict timelines.</li>
          <li><strong>Bordetella booster</strong> is highly recommended for canine socialization, boarding, or playparks.</li>
        </ul>
      </div>

      {/* BOOKING MODAL */}
      {bookingClinic && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setBookingClinic(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    Clinic Appointment Scheduler
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Book core immunizations with verified staff
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingClinic(null)}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-900 transition"
              >
                ✕
              </button>
            </div>

            {/* Success state vs Form */}
            {isBookedSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-black text-base text-emerald-900">
                    Appointment Successfully Confirmed!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Appointment is logged in {activePet.name}'s medical passport and synchronized with <strong>{bookingClinic.name}</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Companion:</span>
                    <span className="font-bold text-slate-900">{activePet.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Clinic:</span>
                    <span className="font-bold text-slate-900">{bookingClinic.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Veterinarian:</span>
                    <span className="font-bold text-slate-900">{bookingClinic.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-bold text-slate-950 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                      {bookingDate} • {bookingTime}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-200/50 flex items-center gap-2 max-w-sm mx-auto">
                  <span className="text-lg">✨</span>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-900">+30 XP &amp; +20 Paw Points Awarded</p>
                    <p className="text-[10px] text-slate-600">Rewards added to household balance for routine care tracking.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingClinic(null);
                      navigate('/health');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-black transition shadow-sm"
                  >
                    Return to Health Center
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="p-4 sm:p-5 space-y-4">
                {/* Pet Summary */}
                <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-2xl">{activePet.species === 'Cat' ? '🐱' : '🐕'}</span>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">Scheduling for:</span>
                    <span className="text-xs font-bold text-slate-800">{activePet.name} ({activePet.breed})</span>
                  </div>
                </div>

                {/* Clinic Summary */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Selected Care Facility</label>
                  <p className="text-xs font-bold text-slate-800">{bookingClinic.name}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
                    🏥 Attending: <strong>{bookingClinic.doctor}</strong> • Distance: <strong>{bookingClinic.distance}</strong>
                  </p>
                </div>

                {/* Select Vaccine */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Immunization / Reason</label>
                  {pendingVaccines.length > 0 ? (
                    <select
                      value={bookingVaccineId}
                      onChange={(e) => setBookingVaccineId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                      required
                    >
                      {pendingVaccines.map((v) => (
                        <option key={v.id} value={v.id}>
                          💉 {v.name} (Due: {v.dueDate})
                        </option>
                      ))}
                      <option value="">🔬 Routine Wellness Physical Exam Only</option>
                    </select>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 font-medium">
                      ✓ All core vaccines are currently complete! Scheduling a general pet wellness and biomechanical physical checkup.
                    </div>
                  )}
                </div>

                {/* Pick Date & Time */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Preferred Hour</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                      required
                    >
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="09:15 AM">09:15 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:15 AM">11:15 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:45 PM">03:45 PM</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Cost info */}
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Estimated Appointment Cost:</span>
                  <span className="text-slate-900 font-extrabold">
                    {bookingClinic.pricing === 'low' ? '$45.00' : bookingClinic.pricing === 'moderate' ? '$65.00' : '$85.00'}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingClinic(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Confirm Booking</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
