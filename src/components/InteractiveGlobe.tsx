import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl@2.27.2';
import { MapPin, X } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface InteractiveGlobeProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (index: number) => void;
  maxLocations?: number;
}

export function InteractiveGlobe({ 
  locations, 
  onAddLocation, 
  onRemoveLocation,
  maxLocations = 3 
}: InteractiveGlobeProps) {
  const globeEl = useRef<any>();
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    if (globeEl.current) {
      // Disable auto-rotate for better user control
      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    if (locations.length >= maxLocations) {
      return;
    }
    
    setTempLocation(coords);
    setShowLabelInput(true);
  };

  const confirmLocation = () => {
    if (tempLocation && locationLabel.trim()) {
      onAddLocation({
        lat: tempLocation.lat,
        lng: tempLocation.lng,
        label: locationLabel.trim()
      });
      setTempLocation(null);
      setLocationLabel('');
      setShowLabelInput(false);
    }
  };

  const cancelLocation = () => {
    setTempLocation(null);
    setLocationLabel('');
    setShowLabelInput(false);
  };

  return (
    <div className="relative">
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          width={600}
          height={400}
          pointsData={locations}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => '#f97316'}
          pointAltitude={0.02}
          pointRadius={0.6}
          onGlobeClick={handleGlobeClick}
          pointLabel={(d: any) => d.label}
        />
      </div>

      {/* Selected Locations List */}
      {locations.length > 0 && (
        <div className="mt-4 space-y-2">
          {locations.map((loc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-white">{loc.label}</span>
              </div>
              <button
                onClick={() => onRemoveLocation(index)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="mt-3 text-center text-sm text-slate-400">
        {locations.length} / {maxLocations} locations selected
      </div>

      {/* Label Input Modal */}
      {showLabelInput && (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-orange-500/20">
            <h4 className="text-white mb-4">Name this location</h4>
            <p className="text-slate-400 text-sm mb-4">
              Help us understand your cultural background (e.g., "Lagos, Nigeria" or "Toronto, Canada")
            </p>
            <input
              type="text"
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmLocation()}
              className="w-full bg-slate-900 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none mb-4"
              placeholder="City, Country"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={cancelLocation}
                className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-full hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLocation}
                disabled={!locationLabel.trim()}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}