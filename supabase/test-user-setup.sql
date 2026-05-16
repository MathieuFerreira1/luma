-- ============================================================
-- Luma - Test User Setup (à exécuter APRÈS création dans Supabase Auth)
-- 
-- ETAPE 1 : Créer l'utilisateur dans Supabase Dashboard
--   Authentication → Users → New User
--   Email: test@luma.app
--   Password: LumaTest123
--   Confirmer l'email
--
-- ETAPE 2 : Exécuter ce script dans l'éditeur SQL
--   Il va mettre à jour le profil et ajouter la progression
-- ============================================================

-- Mettre à jour le profil (créé automatiquement par le trigger handle_new_user)
UPDATE profiles 
SET 
  username = 'TestUser',
  level = 3, 
  xp = 350,
  streak = 5,
  max_streak = 10,
  last_lesson_date = CURRENT_DATE - INTERVAL '1 day',
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'test@luma.app')
AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'test@luma.app');

-- Marquer 8 leçons comme complétées
INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, xp_earned)
SELECT 
  u.id,
  l.id,
  true,
  NOW() - INTERVAL '7 days',
  l.xp_reward
FROM auth.users u
CROSS JOIN lessons l
WHERE u.email = 'test@luma.app'
  AND l.slug IN (
    'sleep-cycles', 
    'sleep-caffeine',
    'nutrition-satiety', 
    'nutrition-hydration',
    'brain-dopamine', 
    'brain-memory',
    'movement-cardio', 
    'movement-walk'
  )
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Débloquer quelques achievements
INSERT INTO user_achievements (user_id, achievement_id)
SELECT 
  u.id,
  a.id
FROM auth.users u
CROSS JOIN achievements a
WHERE u.email = 'test@luma.app'
  AND a.slug IN ('first-lesson', 'five-lessons', 'streak-3', 'perfect-quiz')
ON CONFLICT (user_id, achievement_id) DO NOTHING;


-- ============================================================
-- FONCTIONS DE RESET (pour tester en boucle)
-- ============================================================

-- Réinitialiser UNE leçon spécifique
CREATE OR REPLACE FUNCTION reset_lesson_progress(p_user_id UUID, p_lesson_slug TEXT)
RETURNS VOID AS $$
DECLARE
  v_lesson_id UUID;
  v_xp_earned INTEGER;
BEGIN
  SELECT id INTO v_lesson_id FROM lessons WHERE slug = p_lesson_slug;
  
  IF v_lesson_id IS NULL THEN
    RAISE EXCEPTION 'Leçon non trouvée: %', p_lesson_slug;
  END IF;
  
  SELECT xp_earned INTO v_xp_earned 
  FROM user_progress 
  WHERE user_id = p_user_id AND lesson_id = v_lesson_id;
  
  DELETE FROM user_progress 
  WHERE user_id = p_user_id AND lesson_id = v_lesson_id;
  
  IF v_xp_earned IS NOT NULL THEN
    UPDATE profiles
    SET xp = GREATEST(0, xp - v_xp_earned),
        level = CASE
          WHEN GREATEST(0, xp - v_xp_earned) >= 2500 THEN 8
          WHEN GREATEST(0, xp - v_xp_earned) >= 1850 THEN 7
          WHEN GREATEST(0, xp - v_xp_earned) >= 1300 THEN 6
          WHEN GREATEST(0, xp - v_xp_earned) >= 850 THEN 5
          WHEN GREATEST(0, xp - v_xp_earned) >= 500 THEN 4
          WHEN GREATEST(0, xp - v_xp_earned) >= 250 THEN 3
          WHEN GREATEST(0, xp - v_xp_earned) >= 100 THEN 2
          ELSE 1
        END
    WHERE id = p_user_id;
  END IF;
  
  RAISE NOTICE 'Progression réinitialisée pour la leçon: %', p_lesson_slug;
END;
$$ LANGUAGE plpgsql;

-- Réinitialiser TOUTE la progression
CREATE OR REPLACE FUNCTION reset_all_progress(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM user_progress WHERE user_id = p_user_id;
  DELETE FROM user_achievements WHERE user_id = p_user_id;
  
  UPDATE profiles
  SET xp = 0, level = 1, streak = 0, max_streak = 0, last_lesson_date = NULL
  WHERE id = p_user_id;
  
  RAISE NOTICE 'Toute la progression réinitialisée pour: %', p_user_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT '🎯 COMPTE TEST' as info,
  p.username, p.level, p.xp, p.streak, p.max_streak,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'test@luma.app';

SELECT '🏆 LECONS COMPLETEES' as info,
  l.slug,
  l.title as lesson,
  c.name as category,
  up.xp_earned
FROM user_progress up
JOIN lessons l ON l.id = up.lesson_id
JOIN categories c ON c.id = l.category_id
JOIN auth.users u ON u.id = up.user_id
WHERE u.email = 'test@luma.app';
