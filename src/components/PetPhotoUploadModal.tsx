import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Pet } from '../types';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Check,
  Image as ImageIcon,
  Link,
  RefreshCw,
} from 'lucide-react';
import { processImageFile, PRESET_PET_AVATARS } from '../lib/imageUtils';

interface PetPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: Pet;
  onPhotoSelected?: (photoUrl: string) => void;
}

export function PetPhotoUploadModal({
  isOpen,
  onClose,
  pet,
  onPhotoSelected,
}: PetPhotoUploadModalProps) {
  const { activePet, updatePet, showToast } = useApp();
  const currentPet = pet || activePet;

  const [previewUrl, setPreviewUrl] = useState<string>(currentPet.avatarUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      const dataUrl = await processImageFile(file, 600, 0.88);
      setPreviewUrl(dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process this image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSavePhoto = () => {
    if (!previewUrl) return;

    if (onPhotoSelected) {
      onPhotoSelected(previewUrl);
    } else {
      const updatedPet: Pet = {
        ...currentPet,
        avatarUrl: previewUrl,
      };
      updatePet(updatedPet);
      showToast(`📸 ${currentPet.name}'s profile photo has been updated!`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6b4a]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Update Pet Photo
              </h3>
              <p className="text-[11px] text-slate-500">
                Set a custom profile picture for {currentPet.name}
              </p>
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

        {/* Live Preview Card */}
        <div className="mt-4 flex flex-col items-center justify-center p-4 bg-[var(--primary-light)] rounded-3xl border border-[var(--primary-border)]">
          <div className="relative group">
            <img
              src={previewUrl}
              alt={currentPet.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 mt-2.5">
            {currentPet.name}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Preview of profile avatar
          </span>
        </div>

        {/* Tabs: Upload vs Presets vs Web URL */}
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Breed Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Web Link</span>
          </button>
        </div>

        {/* Tab 1: Device File Upload */}
        {activeTab === 'upload' && (
          <div className="mt-3.5 space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-[#ff6b4a] bg-orange-50/60'
                  : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6b4a] flex items-center justify-center mb-2 shadow-2xs">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                {isProcessing
                  ? 'Optimizing image...'
                  : 'Drag & drop your pet’s photo here'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                or <span className="text-[#ff6b4a] font-semibold underline">browse from your phone or computer</span>
              </p>
              <span className="text-[10px] text-slate-400 mt-2">
                Supports JPG, PNG, HEIC, WEBP (auto-compressed)
              </span>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Curated Presets */}
        {activeTab === 'presets' && (
          <div className="mt-3.5 space-y-2.5">
            <p className="text-[11px] text-slate-500">
              Select an avatar matching your pet's breed or style:
            </p>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
              {PRESET_PET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(preset.url)}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition ${
                    previewUrl === preset.url
                      ? 'border-[#ff6b4a] ring-2 ring-orange-200 scale-95'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                  {previewUrl === preset.url && (
                    <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Custom URL */}
        {activeTab === 'url' && (
          <div className="mt-3.5 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Image Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://.../photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) {
                      setPreviewUrl(customUrl.trim());
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSavePhoto}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 active:scale-95 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Set Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
}
