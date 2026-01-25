import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl@2.27.2';
import { MapPin, X, Search } from 'lucide-react';
import { locationOptions, LocationOption } from '../data/locations';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<LocationOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      // Disable auto-rotate for better user control
      controls.autoRotate = false;
      // Enable zoom
      controls.enableZoom = true;
      // Enable rotation (drag to rotate)
      controls.enableRotate = true;
      // Enable panning
      controls.enablePan = true;
      // Set zoom limits (closer = more zoomed in)
      controls.minDistance = 150;
      controls.maxDistance = 800;
      // Make controls more responsive
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 1.2;
      // Enable damping for smoother interactions
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }
  }, []);

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = locationOptions.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10); // Limit to 10 results
      setFilteredLocations(filtered);
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    if (locations.length >= maxLocations) {
      return;
    }
    
    // Zoom to clicked location
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 2 }, 1000);
    }
    
    setTempLocation(coords);
    setShowLabelInput(true);
  };

  const handleLocationSelect = (location: LocationOption) => {
    if (locations.length >= maxLocations) {
      return;
    }
    
    // Zoom to selected location
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: location.lat, lng: location.lng, altitude: 2 }, 1000);
    }
    
    // Add location immediately with the location name
    onAddLocation({
      lat: location.lat,
      lng: location.lng,
      label: location.name
    });
    
    setSearchQuery('');
    setShowDropdown(false);
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

  const handleAddLocationClick = () => {
    if (locations.length >= maxLocations) {
      return;
    }
    setShowLabelInput(true);
  };

  return (
    <div className="relative">
      <div className="relative inline-block">
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
          enablePointerInteraction={true}
        />
        {/* Instructions overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs p-3 rounded-lg border border-white/10 max-w-[200px] z-10">
          <p className="font-semibold mb-1">How to use:</p>
          <ul className="space-y-1 text-slate-300">
            <li>• Drag to rotate</li>
            <li>• Scroll to zoom</li>
            <li>• Click to select location</li>
          </ul>
        </div>
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

      {/* Location Search Dropdown */}
      {locations.length < maxLocations && (
        <div className="mt-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowDropdown(true)}
              placeholder="Search for a city or country..."
              className="w-full bg-slate-800 text-white rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          
          {/* Dropdown Results */}
          {showDropdown && filteredLocations.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto"
            >
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{location.name}</div>
                      <div className="text-slate-400 text-sm">{location.country}</div>
                    </div>
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {showDropdown && searchQuery && filteredLocations.length === 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 text-center text-slate-400"
            >
              No locations found
            </div>
          )}
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