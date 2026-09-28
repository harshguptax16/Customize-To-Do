import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Compass,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Layers,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  LocateFixed,
  Route,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CalendarEvent, UserProfile } from '../../types';

interface Props {
  calendarEvents: CalendarEvent[];
  profile: UserProfile;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onNavigateToCalendar?: () => void;
}

// Calculate Haversine distance in kilometers
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Map pan helper component
function MapCameraController({
  target,
  zoom,
}: {
  target: { lat: number; lng: number } | null;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      if (zoom) {
        map.setZoom(zoom);
      }
    }
  }, [map, target, zoom]);
  return null;
}

export const LocationMapView: React.FC<Props> = ({
  calendarEvents,
  profile,
  onAddEvent,
}) => {
  const apiKey =
    ((import.meta as unknown as { env?: { VITE_GOOGLE_MAPS_API_KEY?: string } }).env
      ?.VITE_GOOGLE_MAPS_API_KEY) ||
    'AIzaSyBZJdvNYeQhks7jboweYHhe7keXgloFzaA';

  // Default campus location (BIT Mesra / Ranchi as featured in user blueprint)
  const defaultCampusLocation = useMemo(
    () => ({ lat: 23.4123, lng: 85.4399, name: 'BIT Mesra Campus, Ranchi' }),
    []
  );

  // User current location state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    isLiveGps: boolean;
    accuracy?: number;
  }>({
    ...defaultCampusLocation,
    isLiveGps: false,
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Map state
  const [cameraTarget, setCameraTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(defaultCampusLocation);
  const [cameraZoom, setCameraZoom] = useState<number>(6);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    calendarEvents[0]?.id || null
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortByDistance, setSortByDistance] = useState(true);

  // Add Event Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-20');
  const [newType, setNewType] = useState<CalendarEvent['type']>('hackathon');
  const [newVenue, setNewVenue] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Auto-detect real geolocation on mount if available
  useEffect(() => {
    detectCurrentLocation(false);
  }, []);

  const detectCurrentLocation = (explicitUserAction: boolean = true) => {
    if (!navigator.geolocation) {
      if (explicitUserAction) {
        setGpsError('Geolocation is not supported by your current browser.');
      }
      return;
    }

    setIsDetectingLocation(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'My Current Location (GPS)',
          isLiveGps: true,
          accuracy: Math.round(pos.coords.accuracy),
        };
        setUserLocation(coords);
        setIsDetectingLocation(false);
        if (explicitUserAction) {
          setCameraTarget({ lat: coords.lat, lng: coords.lng });
          setCameraZoom(14);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (explicitUserAction) {
          setGpsError(
            err.code === 1
              ? 'Location permission was denied. Falling back to default campus coordinates.'
              : 'Could not retrieve precise location. Check your GPS connection.'
          );
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Events that have coordinates
  const eventsWithLocation = useMemo(() => {
    return calendarEvents
      .filter((ev) => ev.coordinates && ev.coordinates.lat && ev.coordinates.lng)
      .map((ev) => {
        const dist = userLocation
          ? calculateDistanceKm(
              userLocation.lat,
              userLocation.lng,
              ev.coordinates!.lat,
              ev.coordinates!.lng
            )
          : null;
        return { ...ev, distanceKm: dist };
      });
  }, [calendarEvents, userLocation]);

  // Filtered & Sorted events
  const displayEvents = useMemo(() => {
    return eventsWithLocation
      .filter((ev) => {
        const matchesType = filterType === 'all' || ev.type === filterType;
        const matchesSearch =
          searchQuery.trim() === '' ||
          ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ev.location &&
            ev.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (ev.locationAddress &&
            ev.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortByDistance) {
          return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [eventsWithLocation, filterType, searchQuery, sortByDistance]);

  const selectedEvent = useMemo(() => {
    return eventsWithLocation.find((e) => e.id === selectedEventId) || null;
  }, [eventsWithLocation, selectedEventId]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id);
    if (event.coordinates) {
      setCameraTarget({ lat: event.coordinates.lat, lng: event.coordinates.lng });
      setCameraZoom(12);
    }
  }, []);

  const handleMapClick = (latLng: { lat: number; lng: number }) => {
    setClickedLatLng(latLng);
    setNewVenue(`Pinned Location (${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)})`);
    setIsAddModalOpen(true);
  };

  const handleCreateEventAtLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const coords = clickedLatLng || {
      lat: userLocation.lat + (Math.random() - 0.5) * 0.05,
      lng: userLocation.lng + (Math.random() - 0.5) * 0.05,
    };

    onAddEvent({
      title: newTitle.trim(),
      date: newDate,
      type: newType,
      location: newVenue.trim() || 'Custom Venue',
      locationAddress: newAddress.trim() || undefined,
      coordinates: coords,
      notes: newNotes.trim() || undefined,
      status: 'upcoming',
    });

    setNewTitle('');
    setNewVenue('');
    setNewAddress('');
    setNewNotes('');
    setClickedLatLng(null);
    setIsAddModalOpen(false);
  };

  const getMarkerColors = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'hackathon':
        return { bg: '#4f46e5', border: '#3730a3', glyph: '#ffffff', tag: 'bg-indigo-100 text-indigo-700' };
      case 'festival':
        return { bg: '#d97706', border: '#b45309', glyph: '#ffffff', tag: 'bg-amber-100 text-amber-700' };
      case 'trip':
        return { bg: '#059669', border: '#047857', glyph: '#ffffff', tag: 'bg-emerald-100 text-emerald-700' };
      case 'meeting':
        return { bg: '#2563eb', border: '#1d4ed8', glyph: '#ffffff', tag: 'bg-blue-100 text-blue-700' };
      case 'milestone':
        return { bg: '#7c3aed', border: '#6d28d9', glyph: '#ffffff', tag: 'bg-purple-100 text-purple-700' };
      default:
        return { bg: '#64748b', border: '#475569', glyph: '#ffffff', tag: 'bg-slate-100 text-slate-700' };
    }
  };

  const nearestEvent = eventsWithLocation.length > 0 ? [...eventsWithLocation].sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Key Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>Map & Event Locations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time interactive Google Map displaying your current location, hackathon venues, and scheduled destinations with distance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => detectCurrentLocation(true)}
            disabled={isDetectingLocation}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
            title="Detect real browser GPS coordinates"
          >
            <LocateFixed className={`w-4 h-4 text-indigo-600 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>{isDetectingLocation ? 'Locating...' : 'Detect GPS Location'}</span>
          </button>

          <button
            onClick={() => {
              setClickedLatLng(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event on Map</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Current Origin</span>
            <Navigation className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-sm font-black text-slate-900 mt-1 truncate">
            {userLocation.isLiveGps ? 'Live GPS Location' : 'BIT Mesra, Ranchi'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {userLocation.lat.toFixed(3)}°N, {userLocation.lng.toFixed(3)}°E
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Events on Map</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-black text-slate-900 mt-1">
            {eventsWithLocation.length} Geocoded Points
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            100% active in schedule
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Nearest Scheduled</span>
            <Route className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm font-black text-slate-900 mt-1 truncate">
            {nearestEvent ? nearestEvent.title : 'None'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {nearestEvent && nearestEvent.distanceKm !== null
              ? `${nearestEvent.distanceKm} km away`
              : 'Within reach'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quick Center</span>
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              onClick={() => {
                setCameraTarget({ lat: userLocation.lat, lng: userLocation.lng });
                setCameraZoom(13);
              }}
              className="text-[11px] px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md"
            >
              My Pin
            </button>
            <button
              onClick={() => {
                setCameraTarget(defaultCampusLocation);
                setCameraZoom(6);
              }}
              className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
            >
              All India
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Click map to pin a task</p>
        </div>
      </div>

      {/* Main Map + Event Cards Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Google Map Panel */}
        <div className="lg:col-span-8 bg-white p-2 sm:p-3 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col">
          {/* Map Top Bar */}
          <div className="p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Google Maps Platform Live Service
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Interactive Pins
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Simulate base:</span>
              <button
                onClick={() => {
                  const loc = { lat: 23.4123, lng: 85.4399, name: 'BIT Mesra Campus, Ranchi', isLiveGps: false };
                  setUserLocation(loc);
                  setCameraTarget(loc);
                  setCameraZoom(14);
                }}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                  !userLocation.isLiveGps && userLocation.lat === 23.4123
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                BIT Mesra
              </button>
              <button
                onClick={() => {
                  const loc = { lat: 22.5852, lng: 88.4095, name: 'Salt Lake, Kolkata', isLiveGps: false };
                  setUserLocation(loc);
                  setCameraTarget(loc);
                  setCameraZoom(13);
                }}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                  !userLocation.isLiveGps && userLocation.lat === 22.5852
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Kolkata
              </button>
            </div>
          </div>

          {/* Map Viewport Container */}
          <div className="w-full h-[460px] sm:h-[560px] rounded-2xl overflow-hidden relative border border-slate-200/80 bg-slate-100 mt-2">
            <APIProvider apiKey={apiKey} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
              <Map
                id="portal-events-map"
                mapId="DEMO_MAP_ID"
                defaultCenter={defaultCampusLocation}
                defaultZoom={6}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={(e) => {
                  if (e.detail?.latLng) {
                    handleMapClick(e.detail.latLng);
                  }
                }}
              >
                {/* Camera Controller */}
                <MapCameraController target={cameraTarget} zoom={cameraZoom} />

                {/* Current User Location Marker */}
                {userLocation && (
                  <AdvancedMarker
                    position={{ lat: userLocation.lat, lng: userLocation.lng }}
                    title={userLocation.name}
                  >
                    <div className="relative flex items-center justify-center cursor-pointer group">
                      <div className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-3 ring-white">
                        <Navigation className="w-4 h-4 fill-white text-white rotate-45" />
                      </div>
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none shadow-md">
                        {userLocation.isLiveGps ? 'Your Live GPS' : profile.name}
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Event Markers */}
                {eventsWithLocation.map((ev) => {
                  if (!ev.coordinates) return null;
                  const isSelected = selectedEventId === ev.id;
                  const colors = getMarkerColors(ev.type);

                  return (
                    <AdvancedMarker
                      key={ev.id}
                      position={{ lat: ev.coordinates.lat, lng: ev.coordinates.lng }}
                      onClick={() => handleSelectEvent(ev)}
                      title={`${ev.title} - ${ev.location}`}
                    >
                      <Pin
                        background={colors.bg}
                        borderColor={isSelected ? '#000000' : colors.border}
                        glyphColor={colors.glyph}
                        scale={isSelected ? 1.25 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* Selected Event InfoWindow */}
                {selectedEvent && selectedEvent.coordinates && (
                  <InfoWindow
                    position={{
                      lat: selectedEvent.coordinates.lat,
                      lng: selectedEvent.coordinates.lng,
                    }}
                    onCloseClick={() => setSelectedEventId(null)}
                    maxWidth={300}
                  >
                    <div className="p-1 space-y-2 text-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            getMarkerColors(selectedEvent.type).tag
                          }`}
                        >
                          {selectedEvent.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {selectedEvent.date}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {selectedEvent.title}
                      </h4>

                      {selectedEvent.location && (
                        <p className="text-xs text-slate-600 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{selectedEvent.location}</span>
                        </p>
                      )}

                      {selectedEvent.locationAddress && (
                        <p className="text-[11px] text-slate-500 pl-4 leading-tight">
                          {selectedEvent.locationAddress}
                        </p>
                      )}

                      {selectedEvent.distanceKm !== null && (
                        <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md flex items-center justify-between">
                          <span>From current location:</span>
                          <span className="font-mono">{selectedEvent.distanceKm} km</span>
                        </div>
                      )}

                      {selectedEvent.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                          {selectedEvent.notes}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            selectedEvent.locationAddress ||
                              selectedEvent.location ||
                              `${selectedEvent.coordinates.lat},${selectedEvent.coordinates.lng}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Get Directions</span>
                          <ExternalLink className="w-3 h-3 text-indigo-200" />
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* Quick Map Overlay Instructions */}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none shadow-md">
              <Info className="w-3 h-3 text-indigo-400" />
              <span>Click anywhere on the map to pin a task/event location</span>
            </div>
          </div>
        </div>

        {/* Right Event Sidebar List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Scheduled Locations ({displayEvents.length})</span>
                </h3>
                <button
                  onClick={() => setSortByDistance(!sortByDistance)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                    sortByDistance
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {sortByDistance ? 'Nearest First' : 'By Date'}
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, city, or venue..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {['all', 'hackathon', 'festival', 'trip', 'meeting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterType(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition-colors ${
                      filterType === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Events */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {displayEvents.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No events found matching your filter or query.
                </div>
              ) : (
                displayEvents.map((ev) => {
                  const isSelected = selectedEventId === ev.id;
                  const colors = getMarkerColors(ev.type);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleSelectEvent(ev)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 text-xs group ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${colors.tag}`}
                          >
                            {ev.type}
                          </span>
                          <h4 className="font-bold text-slate-900 mt-1 leading-snug group-hover:text-indigo-600 transition-colors">
                            {ev.title}
                          </h4>
                        </div>

                        {ev.distanceKm !== null && (
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {ev.distanceKm} km
                          </span>
                        )}
                      </div>

                      {ev.location && (
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {ev.date}
                        </span>

                        <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                          <span>Focus on Map</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal with Location Pinning */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Mark Event with Location</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {clickedLatLng
                ? `Pinned at coordinates (${clickedLatLng.lat.toFixed(4)}, ${clickedLatLng.lng.toFixed(4)})`
                : 'Add a new location-aware event to your calendar and map'}
            </p>

            <form onSubmit={handleCreateEventAtLocation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. SIH National Finals or Goa Retreat"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CalendarEvent['type'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="hackathon">⚡ Hackathon</option>
                    <option value="festival">🎉 Festival</option>
                    <option value="trip">✈️ Trip Plan</option>
                    <option value="meeting">🤝 Meeting</option>
                    <option value="milestone">🎯 Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Venue / Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Science City, Convention Hall 2"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Address / City
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Topsia Road, Kolkata, West Bengal"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Sprint goals, room reservation, teammates..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Pin to Map & Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
