import React from 'react';
import { Volume2, VolumeX, Eye, Sparkles, Type, RotateCcw } from 'lucide-react';

interface SensoryBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  dyslexiaFont: boolean;
  onToggleDyslexiaFont: () => void;
  calmTheme: boolean;
  onToggleCalmTheme: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'larger';
  onChangeFontSize: (size: 'normal' | 'large' | 'larger') => void;
  onResetPreferences: () => void;
}

export const SensoryAccessibilityBar: React.FC<SensoryBarProps> = ({
  soundEnabled,
  onToggleSound,
  dyslexiaFont,
  onToggleDyslexiaFont,
  calmTheme,
  onToggleCalmTheme,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
  onResetPreferences
}) => {
  return (
    <div id="sensory-accessibility-bar" className="bg-emerald-950 text-emerald-100 text-xs py-2 px-3 sm:px-6 border-b border-emerald-900/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Sensory Affirmation Tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center p-1 bg-emerald-800/80 rounded-full text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium tracking-wide">
            Sensory-Safe Comfort Settings:
          </span>
          <span className="text-emerald-400/90 hidden md:inline">
            Customize contrast, gentle sound, & reading ease
          </span>
        </div>

        {/* Accessibility Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              soundEnabled
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60'
            }`}
            title="Toggle soft auditory cues"
            aria-label="Toggle soft auditory cues"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Gentle Sound: On' : 'Muted'}</span>
          </button>

          {/* Calm Mode */}
          <button
            id="toggle-calm-theme-btn"
            onClick={onToggleCalmTheme}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              calmTheme
                ? 'bg-amber-600/90 text-white shadow-sm'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60'
            }`}
            title="Soften screen brightness and color saturation"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{calmTheme ? 'Calm Mode: On' : 'Calm Colors'}</span>
          </button>

          {/* High Contrast */}
          <button
            id="toggle-high-contrast-btn"
            onClick={onToggleHighContrast}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              highContrast
                ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60'
            }`}
            title="Increase text edge contrast"
          >
            <span>Contrast</span>
          </button>

          {/* Dyslexia-Friendly Font */}
          <button
            id="toggle-dyslexia-font-btn"
            onClick={onToggleDyslexiaFont}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              dyslexiaFont
                ? 'bg-teal-500 text-white font-semibold'
                : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60'
            }`}
            title="Switch to high-legibility font geometry"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{dyslexiaFont ? 'Legibility Font: On' : 'Easy Font'}</span>
          </button>

          {/* Font Size Chooser */}
          <div className="inline-flex items-center bg-emerald-900/60 rounded-full p-0.5 border border-emerald-800/50">
            <button
              id="font-size-normal"
              onClick={() => onChangeFontSize('normal')}
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                fontSize === 'normal' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'
              }`}
              title="Default text scale"
            >
              A
            </button>
            <button
              id="font-size-large"
              onClick={() => onChangeFontSize('large')}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                fontSize === 'large' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'
              }`}
              title="Larger text (+15%)"
            >
              A+
            </button>
          </div>

          {/* Reset button if any altered */}
          {(dyslexiaFont || calmTheme || highContrast || !soundEnabled || fontSize !== 'normal') && (
            <button
              id="reset-sensory-btn"
              onClick={onResetPreferences}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-200 px-1 py-0.5 text-xs transition-colors ml-1"
              title="Reset sensory controls to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
