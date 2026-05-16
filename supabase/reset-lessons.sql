-- ============================================================
-- Reset des leçons (à exécuter AVANT de relancer massive-seed.sql)
-- ============================================================

-- Supprimer les quiz d'abord (contrainte FK)
DELETE FROM quizzes 
WHERE lesson_id IN (
  SELECT id FROM lessons 
  WHERE slug LIKE 'sleep-%' 
     OR slug LIKE 'nutrition-%' 
     OR slug LIKE 'brain-%' 
     OR slug LIKE 'movement-%' 
     OR slug LIKE 'longevity-%'
);

-- Supprimer les leçons
DELETE FROM lessons 
WHERE slug LIKE 'sleep-%' 
   OR slug LIKE 'nutrition-%' 
   OR slug LIKE 'brain-%' 
   OR slug LIKE 'movement-%' 
   OR slug LIKE 'longevity-%';

SELECT '🗑️ Leçons supprimées, vous pouvez maintenant réexécuter massive-seed.sql' as status;
