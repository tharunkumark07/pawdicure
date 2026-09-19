import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MapPin,
  List,
  Search,
  Heart,
  Star,
  Phone,
  Clock,
  ExternalLink,
  Filter,
  Navigation,
} from 'lucide-react';
import { PlaceItem } from '../types';

export function ExploreView() {
  const { householdData, togglePlaceFavorite, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  const places = householdData.places || [];

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Places', icon: '📍' },
    { id: 'park', label: 'Parks & Trails', icon: '🌲' },
    { id: 'vet', label: 'Vet Clinics', icon: '🩺' },
    { id: 'cafe', label: 'Pet Cafes', icon: '☕' },
    { id: 'groomer', label: 'Grooming & Spa', icon: '✂️' },
  ];

  return (
    <div className="flex flex-col w-full pb-12 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[var(--primary-light)] rounded-3xl p-4 sm:p-5 border border-[var(--primary-border)] flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--primary)]/20 text-[10px] font-bold text-[var(--primary)] shadow-2xs mb-1">
            <Compass className="w-3 h-3" />
            <span>Pet-Friendly Explorer</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-[var(--text)]">
            Explore Nearby
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Discover off-leash trails, trauma hospitals &amp; dog cafes
          </p>
        </div>

        {/* List / Map Toggle */}
        <div className="flex items-center p-1 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'list'
                ? 'bg-[var(--text)] text-[var(--background)] shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'map'
                ? 'bg-[var(--text)] text-[var(--background)] shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Chips */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parks, emergency vets, cafes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition ${
                categoryFilter === cat.id
                  ? 'bg-[var(--text)] text-[var(--background)] shadow-2xs'
                  : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:bg-[var(--background-alt)]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE: MAP */}
      {viewMode === 'map' ? (
        <div className="relative bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner h-96 flex flex-col items-center justify-center p-4 text-center">
          {/* Stylized Interactive Map Canvas */}
          <div className="absolute inset-0 bg-slate-50 border border-slate-200 opacity-70" />

          {/* Map Pin Elements */}
          {filteredPlaces.map((place, idx) => {
            const positions = [
              { top: '25%', left: '30%' },
              { top: '45%', left: '65%' },
              { top: '65%', left: '40%' },
              { top: '35%', left: '80%' },
              { top: '75%', left: '20%' },
            ];
            const pos = positions[idx % positions.length];

            return (
              <button
                key={place.id}
                type="button"
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedPlace(place)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group"
              >
                <div className="px-2 py-1 rounded-xl bg-[var(--text)] text-[var(--background)] text-[10px] font-bold shadow-md whitespace-nowrap mb-1 opacity-90 group-hover:scale-105 transition">
                  {place.name.split(' ')[0]}
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-bounce">
                  <MapPin className="w-4 h-4" />
                </div>
              </button>
            );
          })}

          <div className="relative z-10 bg-[var(--card-bg)]/90 backdrop-blur-md p-3 rounded-2xl shadow-md border border-[var(--card-border)] text-xs font-semibold text-[var(--text)] max-w-xs">
            📍 Showing {filteredPlaces.length} verified pet-friendly spots. Tap any pin to preview directions &amp; details.
          </div>
        </div>
      ) : (
        /* VIEW MODE: LIST */
        <div className="space-y-3">
          {filteredPlaces.length === 0 ? (
            <div className="bg-[var(--card-bg)] p-8 rounded-3xl border border-dashed border-[var(--card-border)] text-center space-y-2">
              <span className="text-3xl">🔍</span>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                No locations match your filter
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Try clearing search terms or selecting another category.
              </p>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-[var(--card-bg)] rounded-3xl p-4 border border-[var(--card-border)] shadow-xs hover:border-[var(--primary)]/30 transition space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-heading font-bold text-xs text-slate-900 leading-snug">
                        {place.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => togglePlaceFavorite(place.id)}
                        className={`p-1.5 rounded-full transition shrink-0 ${
                          place.isFavorite
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart
                          className={`w-4 h-4 ${place.isFavorite ? 'fill-red-500' : ''}`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {place.address}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                      <span className="font-bold text-[#ae3115] bg-orange-50 px-2 py-0.5 rounded-md">
                        {place.distance}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{place.rating}</span>
                        <span className="text-slate-400">({place.reviews})</span>
                      </span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded-md ${
                          place.openNow
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {place.openNow ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                {place.features && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                    {place.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={`tel:${place.phone}`}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{place.phone}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Navigating to ${place.name}...`, 'info', '🧭');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                  >
                    <Navigation className="w-3 h-3 text-[#ff6b4a]" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Place Details Modal if tapped on Map */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedPlace(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-3 animate-in zoom-in-95 duration-200">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.name}
              className="w-full h-36 rounded-2xl object-cover"
            />
            <h3 className="font-heading font-black text-base text-slate-900">
              {selectedPlace.name}
            </h3>
            <p className="text-xs text-slate-500">{selectedPlace.address}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-orange-600">{selectedPlace.distance}</span>
              <span>•</span>
              <span className="font-bold text-emerald-600">
                {selectedPlace.openNow ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${selectedPlace.phone}`}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center"
              >
                Call Place
              </a>
              <button
                type="button"
                onClick={() => {
                  showToast(`Opening GPS route to ${selectedPlace.name}...`, 'info');
                  setSelectedPlace(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold"
              >
                Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
