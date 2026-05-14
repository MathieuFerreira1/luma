import { create } from 'zustand';

interface ProgressionState {
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, lessonXP: number) => void;
  updateStreak: () => void;
}

const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  500,  // Level 4
  850,  // Level 5
  1300, // Level 6
  1850, // Level 7
  2500, // Level 8
  3250, // Level 9
  4100, // Level 10
];

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getNextLevelThreshold(currentLevel: number): number {
  return LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function getLevelTitle(level: number): string {
  if (level <= 3) return 'Explorateur';
  if (level <= 6) return 'Curieux';
  if (level <= 9) return 'Passionné';
  return 'Expert Luma';
}

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  xp: 0,
  level: 1,
  streak: 0,
  completedLessons: [],

  addXP: (amount: number) => {
    const newXP = get().xp + amount;
    const newLevel = calculateLevel(newXP);
    
    // Si level up, notifier
    if (newLevel > get().level) {
      console.log(`Level up! ${get().level} → ${newLevel}`);
    }
    
    set({ xp: newXP, level: newLevel });
  },

  completeLesson: (lessonId: string, lessonXP: number) => {
    const { completedLessons, streak } = get();
    
    if (completedLessons.includes(lessonId)) {
      console.log('Lesson already completed');
      return;
    }

    const newStreak = streak + 1;
    const streakBonus = newStreak % 7 === 0 ? 50 : 0;
    const totalXP = lessonXP + streakBonus;

    set((state) => ({
      xp: state.xp + totalXP,
      level: calculateLevel(state.xp + totalXP),
      streak: newStreak,
      completedLessons: [...state.completedLessons, lessonId],
    }));
  },

  updateStreak: () => {
    // TODO: Logique pour vérifier si l'utilisateur a fait une leçon hier
    // Si non, réinitialiser le streak
    console.log('Checking streak...');
  },
}));

// Export helper functions
export { calculateLevel, getNextLevelThreshold, getLevelTitle };
