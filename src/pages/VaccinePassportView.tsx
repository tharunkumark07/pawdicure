import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Award, 
  Stethoscope, 
  ArrowLeft,
  ChevronRight,
  Info,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  ExternalLink,
  History
} from 'lucide-react';

import { calculateNextDueDate } from '../lib/vaccinationService';

export function VaccinePassportView() {
  const { activePet, householdData, navigate, verifyVaccine } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  
  const petHistory = (householdData.vaccinationHistory || []).filter(v => v.petId === activePet.id);
  const completedVaccines = petHistory.filter(v => v.completed).sort((a, b) => new Date(b.administeredDate || 0).getTime() - new Date(a.administeredDate || 0).getTime());
  
  // Distinguish between actual scheduled and predicted
  const upcomingVaccines = petHistory.filter(v => !v.completed && !v.isPrediction).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const predictedVaccines = petHistory.filter(v => v.isPrediction).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const nextVaccine = upcomingVaccines[0] || predictedVaccines[0];

  const handleVerify = async (e: React.MouseEvent, vaccineId: string) => {
    e.stopPropagation();
    setIsVerifying(vaccineId);
    await verifyVaccine(vaccineId);
    setIsVerifying(null);
  };

  const getVerificationIcon = (level?: string) => {
    switch (level) {
      case 'Laboratory Confirmed': return <FlaskConical className="w-3 h-3" />;
      case 'Clinic Verified': return <BadgeCheck className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  const getVerificationColor = (level?: string) => {
    switch (level) {
      case 'Laboratory Confirmed': return 'text-purple-500 bg-purple-500/10 border-purple-200/20';
      case 'Clinic Verified': return 'text-emerald-500 bg-emerald-500/10 border-emerald-200/20';
      default: return 'text-[var(--text-muted)] bg-[var(--background-alt)] border-[var(--card-border)]';
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 rounded-full bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text)] transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="font-heading font-black text-xl text-[var(--text)]">Vaccine Passport</h1>
          <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Clinical Record V2.0</p>
        </div>
        <button className="p-2 rounded-full bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--card-border)] text-[var(--text-muted)] shadow-sm">
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Unique "Physical Card" Style Passport */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl border border-slate-700"
      >
        {/* Holographic Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/40 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/40 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Passport Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Digital Immunity</span>
              </div>
              <h2 className="text-3xl font-heading font-black tracking-tight">{activePet.name}</h2>
              <p className="text-xs text-slate-400 font-medium">{activePet.breed} • {activePet.gender}</p>
            </div>
            <div className="w-20 h-20 rounded-2xl border-2 border-slate-600 p-1 bg-slate-800 overflow-hidden shadow-inner relative group">
              <img src={activePet.avatarUrl} alt={activePet.name} className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Weight</p>
              <p className="text-sm font-bold">{activePet.weight} kg</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Blood Type</p>
              <p className="text-sm font-bold">{activePet.bloodType || 'DEA 1.1'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Chip ID</p>
              <p className="text-sm font-bold font-mono tracking-tighter">{activePet.microchipId?.slice(-6) || 'N/A'}</p>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Status</p>
                <p className="text-xs font-bold text-emerald-400">Verified Clinical History</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Issued By</p>
              <p className="text-xs font-bold">{activePet.vetClinic || 'PAWdiCURE Lab'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Vaccine Prediction Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Next Immunization Prediction</h2>
          <Info className="w-4 h-4 text-[var(--text-muted)] opacity-40" />
        </div>
        
        {nextVaccine ? (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-[var(--card-bg)] rounded-[2rem] p-5 border border-[var(--primary)]/10 shadow-sm relative overflow-hidden group"
          >
            {/* Warning Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--primary)]/10 transition-all duration-500" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-[var(--text)]">{nextVaccine.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wide">
                        {nextVaccine.isPrediction ? 'Predicted Optimal Window' : 'Scheduled booster'}
                      </p>
                      {nextVaccine.isPrediction && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase">AI Prediction</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pt-1">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-bold uppercase">Estimated Date</p>
                    <p className="text-sm font-black text-[var(--text)]">{nextVaccine.dueDate}</p>
                  </div>
                  <div className="border-l border-[var(--card-border)] pl-6">
                    <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-bold uppercase">Protocol Confidence</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 w-12 bg-[var(--primary)]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[94%]" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600">94%</span>
                    </div>
                    <p className="text-[8px] text-[var(--text-muted)] opacity-40 uppercase mt-1 font-bold">Standard {activePet.species} Interval</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/health/clinics')}
                className="bg-[var(--text)] text-[var(--background)] p-3 rounded-2xl shadow-lg hover:shadow-xl transition active:scale-95"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-emerald-50 rounded-[2rem] p-8 text-center border border-emerald-100">
             <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
             <p className="text-sm font-bold text-emerald-900">Maximum Immunity Reached</p>
             <p className="text-[11px] text-emerald-700/70 mt-1">No upcoming vaccines detected in the next 12 months.</p>
          </div>
        )}
      </div>

      {/* Vertical Immunization Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Immunization History</h2>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] opacity-60">
            <History className="w-3 h-3" />
            <span>Full Archive</span>
          </div>
        </div>
        
        <div className="relative space-y-4 pl-4 before:content-[''] before:absolute before:left-[1.25rem] before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--card-border)]">
          {completedVaccines.map((v, i) => (
            <motion.div 
              key={v.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-10"
            >
              {/* Timeline Dot/Icon */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-sm z-10">
                <CheckCircle2 className={`w-4 h-4 ${v.verificationLevel ? 'text-emerald-500' : 'opacity-20'}`} />
              </div>
              
              <div 
                onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                className={`bg-[var(--card-bg)] rounded-3xl p-4 border transition-all cursor-pointer group ${expandedId === v.id ? 'border-emerald-500/50 shadow-md' : 'border-[var(--card-border)] shadow-xs hover:border-[var(--primary)]/30'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[var(--text)]">{v.name}</h4>
                      <div className={`px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase flex items-center gap-1 ${v.category === 'Core' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' : 'text-[var(--text-muted)] bg-[var(--primary)]/5 border-[var(--primary)]/10'}`}>
                        <span>{v.category}</span>
                      </div>
                      {v.verificationLevel && (
                        <div className={`px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase flex items-center gap-1 ${getVerificationColor(v.verificationLevel)}`}>
                          {getVerificationIcon(v.verificationLevel)}
                          <span>{v.verificationLevel}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-bold mt-0.5">{v.administeredDate} • {v.vet || 'Clinical Record'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {v.verificationLevel !== 'Clinic Verified' && v.verificationLevel !== 'Laboratory Confirmed' && (
                      <button 
                        onClick={(e) => handleVerify(e, v.id)}
                        disabled={isVerifying === v.id}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition disabled:opacity-50"
                        title="Verify Record"
                      >
                        {isVerifying === v.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    {expandedId === v.id ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)] opacity-40" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] opacity-40 group-hover:opacity-70 transition" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedId === v.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-[var(--card-border)] space-y-4">
                        {/* Primary Clinic Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-[var(--text-muted)] opacity-40 uppercase">Provider</p>
                            <div className="flex items-center gap-1.5">
                              <Stethoscope className="w-3.5 h-3.5 opacity-40" />
                              <span className="text-[11px] text-[var(--text)] font-bold">{v.vet}</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-[var(--text-muted)] opacity-40 uppercase">Manufacturer</p>
                            <div className="flex items-center justify-end gap-1.5">
                              <FileText className="w-3.5 h-3.5 opacity-40" />
                              <span className="text-[11px] text-[var(--text)] font-bold">{v.manufacturer || 'Documented'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Clinical Details */}
                        <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--background-alt)] rounded-2xl border border-[var(--card-border)]">
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-tighter">Batch Number</p>
                            <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] opacity-80">{v.batchNumber || 'V-88219-X'}</p>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-[8px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-tighter">Registration Tag</p>
                            <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] opacity-80">#{v.tagNumber || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Clinical Notes */}
                        <div className="space-y-3">
                          {v.notes && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-[var(--text-muted)] opacity-40 uppercase">Physician Notes</p>
                              <p className="text-[11px] text-[var(--text-muted)] opacity-80 leading-relaxed italic line-clamp-2">
                                "{v.notes}"
                              </p>
                            </div>
                          )}

                          <div className="p-3 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-[10px] font-black text-[var(--text)] uppercase tracking-wide">Next Due Prediction</p>
                              </div>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md uppercase">AI Protocol</span>
                            </div>
                            <p className="text-xs font-black text-[var(--text)] mt-2 pl-8">
                              {calculateNextDueDate(v.name, v.administeredDate || '', activePet.species) || 'TBD'}
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)] opacity-60 mt-1 pl-8">
                              Based on {activePet.species} clinical intervals
                            </p>
                          </div>
                        </div>

                        <button className="w-full py-2 bg-[var(--text)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Official Certificate</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!expandedId && (
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-[var(--card-border)]">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 opacity-40" />
                      <span className="text-[10px] text-[var(--text-muted)] font-medium truncate">{v.vet.split(' • ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <MapPin className="w-3.5 h-3.5 opacity-40" />
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">Clinic Record</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Schedule Predictions */}
      {predictedVaccines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Immunization Predictions</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <FlaskConical className="w-3 h-3" />
              <span>AI Protocol Engine</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
             {predictedVaccines.map(v => (
               <div key={v.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--text-muted)] opacity-40">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text)]">{v.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-bold uppercase tracking-wider">Window: {v.dueDate}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-tighter border border-emerald-500/20">
                    Predicted
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="px-4 py-6 bg-[var(--background-alt)] rounded-[2rem] border border-[var(--card-border)]">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--text-muted)] opacity-40 shrink-0 mt-0.5" />
          <p className="text-[10px] text-[var(--text-muted)] opacity-60 leading-relaxed italic">
            This digital vaccine passport is a synthesized clinical record. Ensure physical certificates are kept for international travel. Predictions are based on standard veterinary protocols for {activePet.species === 'Dog' ? 'Canine' : 'Feline'} immunology.
          </p>
        </div>
      </div>
    </div>
  );
}
