import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudSun, Clock, MapPin, Compass } from 'lucide-react';

export const ClockWeatherWidget = ({
  clockFormat = '12h',
  showSeconds = true,
  showWeather = true,
  tempUnit = 'F',
  weatherLocation = 'Local City',
  compact = false,
}) => {
  const [time, setTime] = useState(new Date());
  const [unit, setUnit] = useState(tempUnit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setUnit(tempUnit);
  }, [tempUnit]);

  // Format hours and minutes
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  let ampm = '';

  if (clockFormat === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
  }
  const formattedHours = String(hours).padStart(2, '0');

  // Format full date
  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Simulated live weather calculation based on hour of day
  const hourVal = time.getHours();
  const isDay = hourVal >= 6 && hourVal < 20;
  const tempF = 72;
  const tempC = Math.round(((tempF - 32) * 5) / 9);
  const displayTemp = unit === 'C' ? `${tempC}°C` : `${tempF}°F`;

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'F' ? 'C' : 'F'));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)]/80 backdrop-blur-md border border-[var(--border-color)] text-xs text-[var(--text-main)] shadow-sm select-none">
        <div className="flex items-center gap-1.5 font-mono font-bold tracking-wider">
          <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>
            {formattedHours}:{minutes}
            {showSeconds && `:${seconds}`}
          </span>
          {ampm && <span className="text-[10px] text-[var(--text-dim)]">{ampm}</span>}
        </div>
        {showWeather && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--border-color)] text-[var(--text-dim)]">
            {isDay ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-blue-300" />
            )}
            <button
              onClick={toggleUnit}
              title="Click to toggle °F / °C"
              className="hover:text-[var(--text-main)] font-semibold cursor-pointer"
            >
              {displayTemp}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[var(--bg-card)]/60 backdrop-blur-xl border border-[var(--border-color)] shadow-2xl text-[var(--text-main)] select-none max-w-md w-full transition-all duration-300 hover:border-[var(--accent-color)]/50 group">
      {/* Time Display */}
      <div className="flex items-baseline gap-2 font-mono font-black tracking-tight">
        <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-md text-[var(--text-main)]">
          {formattedHours}:{minutes}
        </span>
        {showSeconds && (
          <span className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] opacity-90">
            :{seconds}
          </span>
        )}
        {ampm && (
          <span className="text-xs sm:text-sm font-extrabold uppercase px-2 py-0.5 rounded-md bg-[var(--accent-color)]/20 text-[var(--accent-color)] ml-1 border border-[var(--accent-color)]/30">
            {ampm}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="text-xs sm:text-sm font-medium text-[var(--text-muted)] mt-2 tracking-wide flex items-center gap-2">
        <span>{dateStr}</span>
      </div>

      {/* Weather Sub-widget */}
      {showWeather && (
        <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-[var(--border-color)]/70 w-full px-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-color)]">
              {isDay ? (
                <CloudSun className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Cloud className="w-4 h-4 text-sky-400" />
              )}
            </div>
            <div>
              <div className="font-bold text-[var(--text-main)]">
                {isDay ? 'Partly Sunny' : 'Clear Twilight'}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span>{weatherLocation}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-surface)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
            <span className="font-extrabold text-[var(--text-main)] text-sm">{displayTemp}</span>
            <button
              onClick={toggleUnit}
              className="text-[10px] text-[var(--text-dim)] hover:text-[var(--accent-color)] transition-colors cursor-pointer font-bold px-1"
              title="Switch unit"
            >
              ⇄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
