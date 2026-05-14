-- ============================================================
-- Luma - Seed Content (Leçons réelles pour l'app)
-- Run this AFTER init.sql, once categories exist
-- ============================================================

-- NOTE: Verify category UUIDs match your Supabase instance first
-- These UUIDs are from test data (categories inserted in init.sql)

WITH category_ids AS (
  SELECT 
    (SELECT id FROM categories WHERE slug = 'sleep') AS sleep_id,
    (SELECT id FROM categories WHERE slug = 'nutrition') AS nutrition_id,
    (SELECT id FROM categories WHERE slug = 'brain') AS brain_id
)

-- ============================================================
-- LESSON 1: Sleep - Circadian Rhythm
-- ============================================================
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
SELECT 
  sleep_id,
  'sleep-circadian-rhythm',
  'Votre corps possède une horloge interne',
  'Votre corps enregistre l''heure, même sans montre.',
  'Découvrez comment votre rythme circadien influence votre sommeil, votre énergie et même votre humeur au quotidien.',
  'beginner',
  4,
  25,
  '[
    {"type": "hook", "content": "Votre corps enregistre l''heure, même sans montre."},
    {"type": "text", "content": "À l''intérieur de votre cerveau se trouve une minuscule région appelée le noyau suprachiasmatique. Cet horloger biologique observe la lumière et envoie des signaux à tout votre corps pour dire quand se réveiller, quand manger, et quand se préparer au sommeil."},
    {"type": "text", "content": "Cette horloge a besoin de repères. La lumière du matin la régule, les repas la calibrent, et même l''exercice l''influence. Sans ces signaux, votre corps peut dériver comme une montre désynchronisée."},
    {"type": "text", "content": "C''est pourquoi les voyages avec décalage horaire vous fatiguent : votre horloge interne et l''heure locale ne sont plus alignées. Votre corps pense qu''il est minuit quand il est 6h du matin."},
    {"type": "takeaway", "content": "Exposer vos yeux à la lumière naturelle le matin aide à synchroniser votre horloge interne."}
  ]'::jsonb,
  1,
  true
FROM category_ids;

-- Quizzes for Lesson 1
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Où se trouve l''horloge biologique du corps ?',
  ARRAY['Dans le foie', 'Dans le cœur', 'Dans le cerveau', 'Dans le système digestif'],
  2,
  'Le noyau suprachiasmatique, situé dans l''hypothalamus du cerveau, régule le rythme circadien.',
  0
FROM lessons WHERE slug = 'sleep-circadian-rhythm';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Quelle action aide à synchroniser cette horloge ?',
  ARRAY['Manger tard le soir', 'S''exposer à la lumière du matin', 'Faire la sieste après 16h', 'Regarder des écrans le soir'],
  1,
  'La lumière naturelle du matin est le signal le plus puissant pour réguler votre rythme circadien.',
  1
FROM lessons WHERE slug = 'sleep-circadian-rhythm';

-- ============================================================
-- LESSON 2: Nutrition - Satiety
-- ============================================================
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
SELECT 
  nutrition_id,
  'nutrition-satiety',
  'Pourquoi vous vous sentez plein ou affamé',
  'Votre estomac envoie des messages à votre cerveau, mais pas celui que vous croyez.',
  'Comprenez les mécanismes de la satiété et pourquoi certains aliments vous rassasient pendant des heures tandis que d''autres vous laissent affamés une heure plus tard.',
  'beginner',
  3,
  20,
  '[
    {"type": "hook", "content": "Votre estomac envoie des messages à votre cerveau, mais pas celui que vous croyez."},
    {"type": "text", "content": "Beaucoup pensent que la satiété passe par la taille de l''estomac, mais c''est plus subtil. Votre cerveau reçoit plusieurs signaux : la distension de l''estomac (il se remplit), les hormones intestinales libérées selon les nutriments, et même la vitesse à laquelle vous mangez."},
    {"type": "text", "content": "Les protéines et les fibres déclenchent les signaux de satiété les plus puissants. C''est pourquoi un bol d''avoine rassasie plus longtemps qu''un pain au chocolat de même volume. Le pain au chocolat libère rapidement du sucre, donne un pic d''énergie, puis un creux. L''avoine libère ses nutriments lentement, gardant vos signaux de satiété actifs."},
    {"type": "text", "content": "La vitesse compte aussi : manger lentement donne le temps à votre corps d''envoyer le message de satiété avant d''avoir trop mangé. C''est pourquoi prendre le temps de savourer change non pas votre volonté, mais simplement la qualité des signaux que votre corps reçoit."},
    {"type": "takeaway", "content": 'Les protéines et fibres prolongent naturellement la sensation de satiété.'}
  ]'::jsonb,
  2,
  true
FROM category_ids;

-- Quizzes for Lesson 2
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Quels nutriments déclenchent les signaux de satiété les plus puissants ?',
  ARRAY['Les glucides simples', 'Les protéines et les fibres', 'Les graisses saturées', 'Le sel'],
  1,
  'Les protéines stimulent la libération d''hormones comme la cholecystokinine et le GLP-1, tandis que les fibres ralentissent la digestion.',
  0
FROM lessons WHERE slug = 'nutrition-satiety';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Pourquoi manger lentement aide-t-il à mieux manger ?',
  ARRAY['Cela brûle plus de calories', 'Le cerveau a le temps de recevoir les signaux de satiété', 'Cela améliore le goût', 'Cela dilate plus l''estomac'],
  1,
  'Il faut environ 20 minutes pour que les signaux de satiété atteignent pleinement le cerveau.',
  1
FROM lessons WHERE slug = 'nutrition-satiety';

-- ============================================================
-- LESSON 3: Brain & Energy - Dopamine
-- ============================================================
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
SELECT 
  brain_id,
  'brain-dopamine',
  'Le rôle de la dopamine dans votre motivation',
  'Votre cerveau ne cherche pas le seul plaisir ; il cherche surtout la surprise et l''anticipation.',
  'Découvrez comment fonctionne la motivation naturelle, pourquoi les notifications vous distraient, et comment préserver votre capacité à vous concentrer sans culpabilité.',
  'beginner',
  4,
  25,
  '[
    {"type": "hook", "content": "Votre cerveau ne cherche pas le seul plaisir ; il cherche surtout la surprise et l''anticipation."},
    {"type": "text", "content": "La dopamine est souvent appelée l''hormone du bonheur, mais ce n''est pas tout à fait exact. Elle est surtout l''hormone du désir et de l''anticipation. C''est elle qui vous pousse à vérifier votre téléphone, à ouvrir le réfrigérateur, ou à ouvrir un nouvel onglet."},
    {"type": "text", "content": "Le problème : les notifications, les réseaux sociaux et les jeux donnent des petites doses de dopamine très fréquemment. Votre cerveau apprend alors à attendre ces récompenses rapides et devient moins réceptif aux activités plus lentes mais plus satisfaisantes, comme la lecture ou le travail en profondeur."},
    {"type": "text", "content": "Ce n''est pas une question de volonté. Votre cerveau s''adapte simplement à ce qu''il reçoit. La bonne nouvelle : en réduisant les distractions artificielles pendant seulement quelques heures, vos récepteurs à la dopamine retrouvent leur sensibilité. Les petites choses redeviennent satisfaisantes."},
    {"type": "takeaway", "content": "Couper les notifications pendant 2h permet à votre cerveau de retrouver sa capacité à apprécier les tâches profondes."}
  ]'::jsonb,
  3,
  true
FROM category_ids;

-- Quizzes for Lesson 3
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Quel est le rôle principal de la dopamine ?',
  ARRAY['Produire le bonheur', 'Le désir et l''anticipation', 'Calmer l''anxiété', 'Réguler le sommeil'],
  1,
  'La dopamine motive l''action et crée l''anticipation, bien plus qu''elle ne produise le plaisir lui-même.',
  0
FROM lessons WHERE slug = 'brain-dopamine';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT 
  id,
  'Que se passe-t-il quand vous coupez les distractions artificielles ?',
  ARRAY['Rien de spécial', 'Vos récepteurs à la dopamine retrouvent leur sensibilité', 'Vous devenez plus anxieux', 'Vous perdez la motivation'],
  1,
  'En réduisant les stimuli artificiels, le cerveau re-sensibilise ses récepteurs, rendant les activités profondes à nouveau satisfaisantes.',
  1
FROM lessons WHERE slug = 'brain-dopamine';

-- ============================================================
-- Verify inserted data
-- ============================================================
SELECT 
  l.title,
  l.is_published,
  c.name as category,
  (SELECT COUNT(*) FROM quizzes q WHERE q.lesson_id = l.id) as quiz_count
FROM lessons l
JOIN categories c ON l.category_id = c.id
ORDER BY l.order_index;
