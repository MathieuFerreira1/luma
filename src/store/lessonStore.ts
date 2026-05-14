import { create } from 'zustand';

interface Lesson {
  id: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  title: string;
  hook: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  xpReward: number;
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
}

interface LessonBlock {
  type: 'hook' | 'text' | 'visual' | 'interaction' | 'quote' | 'takeaway';
  content?: string;
  animation?: string;
  imageUrl?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonState {
  currentLesson: Lesson | null;
  lessons: Lesson[];
  isLoading: boolean;
  fetchLessons: () => Promise<void>;
  setCurrentLesson: (lesson: Lesson | null) => void;
  completeLesson: (lessonId: string) => void;
  lessonsByCategory: Record<string, Lesson[]>;
}

// Données de démonstration
const DEMO_LESSONS: Lesson[] = [
  {
    id: 'sleep-light',
    category: {
      id: 'sleep',
      name: 'Sommeil',
      color: '#AFCBFF',
    },
    title: 'Pourquoi la lumière influence votre énergie',
    hook: 'Votre cerveau utilise la lumière pour réguler votre énergie.',
    description: 'Découvrez comment la lumière naturelle affecte vos cycles de sommeil et votre énergie quotidienne.',
    difficulty: 'beginner',
    duration: 3,
    xpReward: 20,
    blocks: [
      {
        type: 'hook',
        content: 'Votre cerveau utilise la lumière pour réguler votre énergie.',
      },
      {
        type: 'text',
        content: 'Chaque matin, la lumière du soleil envoie un signal à votre cerveau qui dit : "C\'est l\'heure de se réveiller !" Ce signal arrête la production de mélatonine, l\'hormone du sommeil.',
      },
      {
        type: 'text',
        content: 'À l\'inverse, la lumière bleue des écrans le soir peut tromper votre cerveau et le faire croire qu\'il fait encore jour.',
      },
      {
        type: 'takeaway',
        content: 'La lumière du matin aide aussi à préparer votre sommeil plus tard dans la journée.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Quel signal envoie la lumière du soleil le matin au cerveau ?',
        options: [
          'C\'est l\'heure de dormir',
          'C\'est l\'heure de se réveiller',
          'C\'est l\'heure de manger',
          'C\'est l\'heure de faire du sport',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        question: 'Quelle hormone est arrêtée par la lumière du matin ?',
        options: [
          'Dopamine',
          'Sérotonine',
          'Mélatonine',
          'Cortisol',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'nutrition-protein',
    category: {
      id: 'nutrition',
      name: 'Nutrition',
      color: '#9DB8A1',
    },
    title: 'Pourquoi les protéines sont essentielles',
    hook: 'Votre corps reconstruit constamment ses protéines.',
    description: 'Comprendrez le rôle des protéines dans la satiété, l\'énergie et la construction musculaire.',
    difficulty: 'beginner',
    duration: 4,
    xpReward: 20,
    blocks: [
      {
        type: 'hook',
        content: 'Votre corps reconstruit constamment ses protéines.',
      },
      {
        type: 'text',
        content: 'Les protéines sont les briques de construction de votre corps. Elles forment les muscles, les enzymes, les hormones et même votre système immunitaire.',
      },
      {
        type: 'takeaway',
        content: 'Une portion de protéines à chaque repas aide à maintenir votre énergie stable.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Que forment les protéines dans le corps ?',
        options: [
          'Les os uniquement',
          'Les muscles, enzymes et hormones',
          'La graisse corporelle',
          'Le sang uniquement',
        ],
        correctAnswer: 1,
      },
    ],
  },
];

export const useLessonStore = create<LessonState>((set) => ({
  currentLesson: null,
  lessons: DEMO_LESSONS,
  isLoading: false,
  lessonsByCategory: DEMO_LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.category.id]) {
      acc[lesson.category.id] = [];
    }
    acc[lesson.category.id].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>),

  fetchLessons: async () => {
    set({ isLoading: true });
    try {
      // TODO: Fetch from Supabase
      // const { data, error } = await supabase
      //   .from('lessons')
      //   .select('*, categories(*), quizzes(*)');
      
      // if (error) throw error;
      // set({ lessons: data });
      
      // Simulation pour l'instant
      console.log('Fetching lessons...');
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  completeLesson: (lessonId: string) => {
    console.log(`Lesson ${lessonId} completed`);
  },
}));

export type { Lesson, LessonBlock, QuizQuestion };
