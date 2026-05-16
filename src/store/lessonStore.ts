import { create } from 'zustand';
import { supabase } from '@/src/services/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
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
  orderIndex?: number;
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
  completeLesson: (lessonId: string, xpEarned: number) => Promise<any>;
  lessonsByCategory: Record<string, Lesson[]>;
}

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
      const categories = data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
      }));
      set({ categories });
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      set({ error: err.message });
    }
  },

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch lessons with categories
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
      const lessonIds = lessonsData.map((l) => l.id);
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .in('lesson_id', lessonIds);

      if (quizzesError) throw quizzesError;

      // Map data to our Lesson type
      const lessons = lessonsData.map((lesson) => ({
        id: lesson.id,
        category: {
          id: lesson.category_id,
          name: lesson.categories?.name || 'Unknown',
          slug: lesson.categories?.slug || '',
          color: lesson.categories?.color || '#6E6AE8',
        },
        title: lesson.title,
        hook: lesson.hook,
        description: lesson.description || '',
        difficulty: lesson.difficulty,
        duration: lesson.estimated_time,
        xpReward: lesson.xp_reward,
        orderIndex: lesson.order_index || 0,
        blocks: lesson.blocks || [],
        quiz:
          (quizzesData || [])
            .filter((q) => q.lesson_id === lesson.id)
            .sort((a, b) => a.order_index - b.order_index)
            .map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer,
            })),
      }));

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
    } catch (err: any) {
      console.error('Error fetching lessons:', err);
      set({ error: err.message, isLoading: false });
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

      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', id);

      return {
        id: lessonData.id,
        category: {
          id: lessonData.category_id,
          name: lessonData.categories?.name || 'Unknown',
          slug: lessonData.categories?.slug || '',
          color: lessonData.categories?.color || '#6E6AE8',
        },
        title: lessonData.title,
        hook: lessonData.hook,
        description: lessonData.description || '',
        difficulty: lessonData.difficulty,
        duration: lessonData.estimated_time,
        xpReward: lessonData.xp_reward,
        orderIndex: lessonData.order_index || 0,
        blocks: lessonData.blocks || [],
        quiz:
          (quizzesData || [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer,
            })),
      };
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  },

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  completeLesson: async (lessonId: string, xpEarned: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user');

      const { error } = await supabase.from('user_progress').upsert(
        {
          user_id: session.user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          xp_earned: xpEarned,
        },
        { onConflict: 'user_id,lesson_id' }
      );

      if (error) throw error;

      // Refresh lessons to update state
      await get().fetchLessons();
      return xpEarned;
    } catch (err: any) {
      console.error('Error completing lesson:', err);
      throw err;
    }
  },
}));

export type { Lesson, LessonBlock, QuizQuestion, Category };
