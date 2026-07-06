import * as React from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar } from './ui/calendar';
import { useAuth } from '../contexts/AuthContext';
import { createDiscoveryBooking, parseScheduledAt } from '../services/discoveryService';

interface ConsultationModalProps {
  coachName: string;
  coachId?: string;
  categoryId?: string;
  onClose: () => void;
  onScheduleComplete: () => void;
}

export function ConsultationModal({ 
  coachName, 
  coachId,
  categoryId,
  onClose, 
  onScheduleComplete 
}: ConsultationModalProps) {
  const { user, plan, isLoggedIn } = useAuth();
  const [step, setStep] = useState<'calendar' | 'success'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock available time slots
  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', 
    '4:00 PM', '5:00 PM'
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select a date and time.');
      return;
    }

    if (!isLoggedIn || !user?.id) {
      alert('Please sign in to schedule a try-out.');
      return;
    }

    if (!coachId || !categoryId) {
      alert('Coach information is missing. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createDiscoveryBooking({
        playerId: user.id,
        coachId,
        pathwayId: categoryId,
        plan,
        scheduledAt: parseScheduledAt(selectedDate, selectedTimeSlot),
      });
      setStep('success');
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err instanceof Error ? err.message : 'Could not schedule try-out. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessButtonClick = () => {
    onScheduleComplete();
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle date selection - reset time slot when date changes
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 10003,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step === 'calendar') {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'relative',
          zIndex: 10004,
          backgroundColor: '#0f172a',
          borderRadius: '2rem',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.1)',
          border: '1px solid rgba(249, 115, 22, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'calendar' ? (
          <>
            {/* Elegant Header with Gradient */}
            <div 
              className="relative p-8 text-white overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)'
              }}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
              </div>
              
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all z-10 border border-white/20"
                style={{
                  right: '1.5rem',
                  left: 'auto'
                }}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative pr-12">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-white/90" />
                  <span className="text-white/90 text-sm font-medium uppercase tracking-wide">Book Consultation</span>
                </div>
                <h2 
                  className="text-white text-3xl font-bold mb-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: '700' }}
                >
                  Schedule with {coachName}
                </h2>
                <p 
                  className="text-white/80 text-base"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Choose your preferred date and time slot
                </p>
              </div>
            </div>

            {/* Modern Grid Layout */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Left: Calendar Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 
                      className="text-white text-lg font-semibold"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Select Date
                    </h3>
                  </div>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </motion.div>

                {/* Right: Time Slots Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 
                      className="text-white text-lg font-semibold"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Select Time
                    </h3>
                  </div>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimeSlots.map((slot, index) => {
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <motion.button
                            key={slot}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-4 rounded-xl text-center text-sm font-medium transition-all transform hover:scale-105 ${
                              isSelected
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 border-2 border-orange-400'
                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border-2 border-slate-600/50 hover:border-slate-600'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-800/30 border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center">
                      <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-400 text-sm font-medium">Select a date first</p>
                      <p className="text-slate-500 text-xs mt-1">to see available time slots</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Elegant Submit Button */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={handleSchedule}
                  disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
                  className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:hover:shadow-orange-500/20 overflow-hidden"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        Schedule Consultation
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </motion.div>
            </div>
          </>
        ) : (
          /* Success Screen - ISO Request Submitted */
          <div className="p-12 text-center relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative z-10"
            >
              {/* Success Icon with Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
                  {/* Pulse ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-green-500/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: '800' }}
              >
                ISO Request Submitted!
              </motion.h2>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6 max-w-lg mx-auto"
              >
                <p 
                  className="text-slate-200 text-lg mb-3"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Your consultation with <span className="text-orange-400 font-semibold">{coachName}</span> has been scheduled for
                </p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CalendarIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-semibold text-lg">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-semibold text-lg">{selectedTimeSlot}</span>
                </div>
              </motion.div>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-base mb-8 max-w-md mx-auto leading-relaxed"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Once the coach accepts your request, check your portal or email for confirmation and video link.
              </motion.p>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleSuccessButtonClick}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center gap-2 mx-auto"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                See ISO Membership Options
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (!mounted) return null;

  // Render to document.body using portal to avoid z-index conflicts
  return createPortal(modalContent, document.body);
}
