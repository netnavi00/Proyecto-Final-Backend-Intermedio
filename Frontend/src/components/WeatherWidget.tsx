import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, Loader2, Search, MapPin, Globe } from 'lucide-react';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ city: 'CDMX', state: 'DF', country: 'MX' });
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const API_KEY = 'COLOCA KEY AQUI'; 

  // --- CERRAR SUGERENCIAS AL CLICKEAR FUERA ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- BUSCAR SUGERENCIAS (GEOCONDING) ---
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error en sugerencias:", err);
    }
  };

  // --- OBTENER CLIMA DE UNA CIUDAD SELECCIONADA ---
  const fetchWeather = async (lat: number, lon: number, name: string, state: string, country: string) => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      setWeather({
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: data.weather[0].main
      });

      setLocation({ city: name, state: state || '', country: country });
      setSearchInput('');
    } catch (err) {
      console.error("Error al obtener clima:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchWeather(19.4326, -99.1332, 'Mexico City', 'CDMX', 'MX');
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear': return <Sun className="text-amber-400" size={18} />;
      case 'Clouds': return <Cloud className="text-slate-400" size={18} />;
      case 'Rain': case 'Drizzle': return <CloudRain className="text-blue-400" size={18} />;
      default: return <Sun className="text-amber-400" size={18} />;
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white p-1.5 pl-4 rounded-2xl border border-slate-200 shadow-sm relative" ref={wrapperRef}>
      
      {/* Buscador con Lista Desplegable */}
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            placeholder="Buscar ciudad..."
            className="pl-8 pr-3 py-1.5 bg-slate-50 border-none rounded-xl text-xs font-medium w-32 md:w-44 outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        {/* LISTA DESPLEGABLE */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-[99] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => fetchWeather(s.lat, s.lon, s.name, s.state, s.country)}
                className="w-full text-left px-4 py-2 text-[11px] hover:bg-indigo-50 transition-colors flex flex-col border-b border-slate-50 last:border-none"
              >
                <span className="font-bold text-slate-700">{s.name}</span>
                <span className="text-slate-400 text-[9px]">{s.state ? `${s.state}, ` : ''}{s.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-8 bg-slate-100 mx-1" />

      {/* Info del Clima */}
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="animate-spin text-indigo-500" size={18} />
        ) : (
          <>
            <div className="text-right hidden md:block leading-tight">
              <p className="text-[10px] font-black text-slate-700 uppercase flex items-center justify-end gap-1">
                <MapPin size={10} className="text-indigo-500" /> 
                {location.city}{location.state ? `, ${location.state}` : ''}
              </p>
              <p className="text-[9px] font-bold text-slate-400 flex items-center justify-end gap-1 uppercase tracking-tighter">
                <Globe size={9} /> {location.country}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              <span className="text-sm font-black text-slate-800">
                {weather?.temp}°
              </span>
              {weather && getWeatherIcon(weather.icon)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};