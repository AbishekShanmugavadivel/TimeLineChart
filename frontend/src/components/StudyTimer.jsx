import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Square, CheckCircle, Timer } from 'lucide-react';
import { studyService } from '../services/studyService';

const StudyTimer = ({ defaultPhaseNumber = 1, defaultTopicName = 'General Study', onSessionSaved }) => {
  const [modeMinutes, setModeMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(modeMinutes * 60);
    setIsActive(false);
    setIsPaused(false);
  }, [modeMinutes]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleFinishSession(modeMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, modeMinutes]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setSavedMsg('');
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setSecondsLeft(modeMinutes * 60);
    setSavedMsg('');
  };

  const handleFinishSession = async (minutesStudied) => {
    setIsActive(false);
    setIsPaused(false);
    try {
      await studyService.recordSession({
        phaseNumber: defaultPhaseNumber,
        topicName: defaultTopicName,
        duration: minutesStudied || Math.max(1, Math.round((modeMinutes * 60 - secondsLeft) / 60)),
        source: 'timer'
      });
      setSavedMsg(`Recorded ${minutesStudied || modeMinutes} minutes session to MongoDB! 🎉`);
      if (onSessionSaved) onSessionSaved();
    } catch (err) {
      console.error('Failed to log study session:', err);
    }
  };

  const handleStopAndSave = () => {
    const elapsedMinutes = Math.round((modeMinutes * 60 - secondsLeft) / 60);
    if (elapsedMinutes > 0) {
      handleFinishSession(elapsedMinutes);
    } else {
      handleReset();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((modeMinutes * 60 - secondsLeft) / (modeMinutes * 60)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-extrabold text-slate-900">Study Timer</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {defaultTopicName}
        </span>
      </div>

      {/* Mode Preset Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[25, 50, 90].map((mins) => (
          <button
            key={mins}
            onClick={() => setModeMinutes(mins)}
            disabled={isActive}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              modeMinutes === mins
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {mins}m
          </button>
        ))}
        <button
          onClick={() => {
            const custom = prompt('Enter custom timer duration in minutes:', '30');
            if (custom && !isNaN(custom) && custom > 0) {
              setModeMinutes(parseInt(custom));
            }
          }}
          disabled={isActive}
          className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          Custom
        </button>
      </div>

      {/* Countdown Timer Display */}
      <div className="text-center my-6">
        <div className="text-5xl font-black text-slate-900 tracking-tight font-mono">
          {formatTime(secondsLeft)}
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-extrabold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" /> Start Study
          </button>
        ) : isPaused ? (
          <button
            onClick={handleResume}
            className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-extrabold text-sm hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl font-extrabold text-sm hover:bg-amber-600 shadow-md flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4 fill-white" /> Pause
          </button>
        )}

        {isActive && (
          <button
            onClick={handleStopAndSave}
            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold border border-red-200"
            title="Stop & Log Session"
          >
            <Square className="w-5 h-5 fill-red-600" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {savedMsg && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
