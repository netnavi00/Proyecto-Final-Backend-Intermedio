import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Calendar } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());
  
  // Dummy weather data
  const weather = {
    temp: 24,
    condition: 'Soleado',
    icon: <Sun className="w-6 h-6 text-yellow-400" />
  };

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-medium text-slate-600 capitalize">
          {formatDate(date)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {weather.icon}
        <span className="text-sm font-bold text-slate-800">{weather.temp}°C</span>
        <span className="text-xs text-slate-500 hidden sm:inline">{weather.condition}</span>
      </div>
    </div>
  );
};
