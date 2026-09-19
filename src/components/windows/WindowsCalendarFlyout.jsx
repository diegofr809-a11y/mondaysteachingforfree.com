import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, X } from 'lucide-react';

export const WindowsCalendarFlyout = ({
  isOpen,
  onClose,
  clockFormat = '12h',
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const hoursStr = currentDateTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: clockFormat !== '24h',
  });

  const fullDateStr = currentDateTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString([], { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const isToday = (d) => {
    const today = new Date();
    return (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleResetToToday = (e) => {
    e.stopPropagation();
    setViewDate(new Date());
  };

  // Build grid
  const days = [];
  // Prev month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      today: isToday(i),
    });
  }
  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      currentMonth: false,
    });
  }

  const weekDayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed right-3 bottom-14 w-80 rounded-2xl bg-[#1e2029]/95 backdrop-blur-3xl border border-white/15 shadow-[0_12px_48px_rgba(0,0,0,0.75)] z-50 p-4 text-white select-none animate-scale-up"
    >
      {/* Top Header: Clock & Full Date */}
      <div className="pb-3 border-b border-white/10 flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">
            {hoursStr}
          </div>
          <div className="text-xs font-medium text-sky-400 mt-0.5">
            {fullDateStr}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Month Navigation */}
      <div className="py-2.5 flex items-center justify-between">
        <button
          onClick={handleResetToToday}
          className="text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          {monthName}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekDayHeaders.map((wd) => (
          <div key={wd} className="text-[10px] font-semibold text-zinc-400 py-0.5">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.slice(0, 35).map((item, idx) => (
          <div
            key={idx}
            className={`h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${
              item.today
                ? 'bg-[#0078D4] text-white font-bold shadow-[0_0_12px_rgba(0,120,212,0.6)] ring-1 ring-white/50'
                : item.currentMonth
                ? 'text-zinc-200 hover:bg-white/10 cursor-pointer'
                : 'text-zinc-600'
            }`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};
