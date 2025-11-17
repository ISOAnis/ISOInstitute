import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { X, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface Availability {
  date: string;
  slots: TimeSlot[];
}

export function MentorPortal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('10:00');

  const addTimeSlot = () => {
    if (!selectedDate) return;

    const dateString = selectedDate.toISOString().split('T')[0];
    const existingAvailability = availability.find(a => a.date === dateString);

    const newSlot: TimeSlot = {
      id: `${dateString}-${Date.now()}`,
      start: newSlotStart,
      end: newSlotEnd,
    };

    if (existingAvailability) {
      setAvailability(availability.map(a =>
        a.date === dateString
          ? { ...a, slots: [...a.slots, newSlot] }
          : a
      ));
    } else {
      setAvailability([...availability, { date: dateString, slots: [newSlot] }]);
    }

    // Reset time inputs
    setNewSlotStart('09:00');
    setNewSlotEnd('10:00');
  };

  const removeTimeSlot = (dateString: string, slotId: string) => {
    setAvailability(availability.map(a =>
      a.date === dateString
        ? { ...a, slots: a.slots.filter(s => s.id !== slotId) }
        : a
    ).filter(a => a.slots.length > 0));
  };

  const selectedDateString = selectedDate?.toISOString().split('T')[0];
  const selectedDateAvailability = availability.find(a => a.date === selectedDateString);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white mb-2">Mentor Portal</h1>
          <p className="text-slate-400">
            Manage your availability so mentees can book at your earliest convenience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-white mb-4">Select Date</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-slate-700 bg-slate-800"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          {/* Time Slot Management */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-white mb-4">
              {selectedDate 
                ? `Availability for ${selectedDate.toLocaleDateString()}`
                : 'Select a date to add availability'}
            </h3>

            {selectedDate && (
              <div className="space-y-4">
                {/* Add Time Slot Form */}
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <h4 className="text-white mb-3">Add Time Slot</h4>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-slate-400 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newSlotStart}
                        onChange={(e) => setNewSlotStart(e.target.value)}
                        className="w-full bg-slate-900 text-white rounded-lg p-2 border border-slate-600 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-400 mb-1">End Time</label>
                      <input
                        type="time"
                        value={newSlotEnd}
                        onChange={(e) => setNewSlotEnd(e.target.value)}
                        className="w-full bg-slate-900 text-white rounded-lg p-2 border border-slate-600 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={addTimeSlot}
                      className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Display Current Slots */}
                <div>
                  <h4 className="text-white mb-3">Available Slots</h4>
                  {selectedDateAvailability && selectedDateAvailability.slots.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateAvailability.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <span className="text-white">
                            {slot.start} - {slot.end}
                          </span>
                          <button
                            onClick={() => removeTimeSlot(selectedDateString!, slot.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No slots available for this date</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Availability Overview */}
        <div className="mt-8 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white mb-4">All Scheduled Availability</h3>
          {availability.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availability.map((avail) => (
                <div key={avail.date} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <h4 className="text-white mb-2">
                    {new Date(avail.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h4>
                  <div className="space-y-1">
                    {avail.slots.map((slot) => (
                      <div key={slot.id} className="text-slate-400 text-sm">
                        {slot.start} - {slot.end}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No availability scheduled yet. Select a date and add time slots to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
