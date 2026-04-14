import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, Loader2, Calendar } from 'lucide-react';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'f0d31ab118ad9dbfe0d08c5c689ea5c2'; // Reemplaza con tu llave de OpenWeather

  // 1. Obtener la fecha completa formateada
  const fechaCompleta = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
        );
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error("Error al obtener clima:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Intentar obtener ubicación del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Si el usuario rechaza, usamos una ubicación por defecto (CDMX)
          fetchWeather(19.4326, -99.1332);
        }
      );
    } else {
      fetchWeather(19.4326, -99.1332);
    }
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
      <Loader2 size={16} className="animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest">Localizando...</span>
    </div>
  );

  return (
    <div className="flex items-center gap-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md px-6 py-2.5 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
      
      {/* LADO IZQUIERDO: FECHA COMPLETA */}
      <div className="flex items-center gap-3 border-r border-slate-200 dark:border-slate-700 pr-6">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Calendar size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter leading-none mb-1">
            Fecha
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-white capitalize leading-none">
            {fechaCompleta}
          </span>
        </div>
      </div>

      {/* LADO DERECHO: CLIMA AUTOMÁTICO */}
      <div className="flex items-center gap-4">
        {weather && (
          <>
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5 text-slate-500 dark:text-slate-300">
                <MapPin size={12} className="text-indigo-500 dark:text-indigo-400" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{weather.name}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white">{Math.round(weather.main.temp)}°C</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-200 uppercase border-l border-slate-200 dark:border-slate-700 pl-2">
                  {weather.weather[0].description}
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 text-white">
              {weather.weather[0].main === 'Clear' ? <Sun size={20} /> : 
               weather.weather[0].main === 'Rain' ? <CloudRain size={20} /> : 
               <Cloud size={20} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};