import { create } from 'zustand';
import { supabase } from '@/src/services/supabase';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Lesson {
  id: string;
  category: Category;
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
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchLessons: () => Promise<void>;
  fetchLessonById: (id: string) => Promise<Lesson | null>;
  setCurrentLesson: (lesson: Lesson | null) => void;
  completeLesson: (lessonId: string) => void;
  lessonsByCategory: Record<string, Lesson[]>;
}

const mapLessonFromSupabase = (row: any): Lesson => ({
  id: row.id,
  category: {
    id: row.category_id,
    name: row.categories?.name || 'Unknown',
    color: row.categories?.color || '#6E6AE8',
  },
  title: row.title,
  hook: row.hook,
  description: row.description || '',
  difficulty: row.difficulty,  
  duration: row.estimated_time,
  xpReward: row.xp_reward,
  blocks: row.blocks || [],
  quiz: [], // Will be fetched separately
});

export const useLessonStore = create<LessonState>((set, get) => ({
  currentLesson: null,
  lessons: [],
  categories: [],
  isLoading: false,
  error: null,
  lessonsByCategory: {},

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const categories = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
      }));

      set({ categories });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({ error: error.message });
    }
  },

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch lessons with their categories
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*, categories(*)')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      if (!lessonsData) {
        set({ lessons: [], isLoading: false });
        return;
      }

      // Fetch quizzes for these lessons
      const lessonIds = lessonsData.map(l => l.id);
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .in('lesson_id', lessonIds);

      if (quizzesError) throw quizzesError;

      // Map data to our Lesson type
      const lessons = lessonsData.map(lesson => {
        const mapped = mapLessonFromSupabase(lesson);
        // Attach quizzes
        const lessonQuizzes = (quizzesData || [])
          .filter(q => q.lesson_id === lesson.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
          }));
        mapped.quiz = lessonQuizzes;
        return mapped;
      });

      // Build lessonsByCategory
      const lessonsByCategory = lessons.reduce((acc, lesson) => {
        const catId = lesson.category.id;
        if (!acc[catId]) {
          acc[catId] = [];
        }
        acc[catId].push(lesson);
        return acc;
      }, {} as Record<string, Lesson[]>);

      set({ lessons, lessonsByCategory, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching lessons:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLessonById: async (id: string) => {
    try {
      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('*, categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!lessonData) return null;

      const mapped = mapLessonFromSupabase(lessonData);

      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', id);

      mapped.quiz = (quizzesData || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
        }));

      return mapped;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  },

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  completeLesson: async (lessonId: string) => {
    console.log(`Lesson ${lessonId} completed`);
    // TODO: Save to user_progress table via progressionStore
  },
}));

export type { Lesson, LessonBlock, QuizQuestion, Category };
