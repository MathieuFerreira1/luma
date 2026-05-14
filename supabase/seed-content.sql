-- ===========================================
-- Luma - Leçons supplémentaires
-- ===========================================

INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'nutrition'),
  'nutrition-satiety',
  'Pourquoi vous vous sentez plein ou affamé',
  'Votre estomac envoie des messages à votre cerveau, mais pas celui que vous croyez.',
  'Comprenez les mécanismes de la satiété et pourquoi certains aliments vous rassasient pendant des heures tandis que d''autres vous laissent affamés une heure plus tard.',
  'beginner',
  3,
  20,
  '[{"type": "hook", "content": "Votre estomac envoie des messages à votre cerveau, mais pas celui que vous croyez."},{"type": "text", "content": "Beaucoup pensent que la satiété passe par la taille de l''estomac, mais c''est plus subtil. Votre cerveau reçoit plusieurs signaux : la distension de l''estomac (il se remplit), les hormones intestinales libérées selon les nutriments, et même la vitesse à laquelle vous mangez."},{"type": "text", "content": "Les protéines et les fibres déclenchent les signaux de satiété les plus puissants. C''est pourquoi un bol d''avoine rassasie plus longtemps qu''un pain au chocolat de même volume. Le pain au chocolat libère rapidement du sucre, donne un pic d''énergie, puis un creux. L''avoine libère ses nutriments lentement, gardant vos signaux de satiété actifs."},{"type": "text", "content": "La vitesse compte aussi : manger lentement donne le temps à votre corps d''envoyer le message de satiété avant d''avoir trop mangé. C''est pourquoi prendre le temps de savourer change non pas votre volonté, mais simplement la qualité des signaux que votre corps reçoit."},{"type": "takeaway", "content": "Les protéines et fibres prolongent naturellement la sensation de satiété."}]'::jsonb,
  2,
  true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quels nutriments déclenchent les signaux de satiété les plus puissants ?', ARRAY['Les glucides simples', 'Les protéines et les fibres', 'Les graisses saturées', 'Le sel'], 1, 'Les protéines stimulent la libération d''hormones comme la cholecystokinine et le GLP-1, tandis que les fibres ralentissent la digestion.', 0
FROM lessons WHERE slug = 'nutrition-satiety';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Pourquoi manger lentement aide-t-il à mieux manger ?', ARRAY['Cela brûle plus de calories', 'Le cerveau a le temps de recevoir les signaux de satiété', 'Cela améliore le goût', 'Cela dilate plus l''estomac'], 1, 'Il faut environ 20 minutes pour que les signaux de satiété atteignent pleinement le cerveau.', 1
FROM lessons WHERE slug = 'nutrition-satiety';

-- ===========================================
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'brain'),
  'brain-dopamine',
  'Le rôle de la dopamine dans votre motivation',
  'Votre cerveau ne cherche pas le seul plaisir ; il cherche surtout la surprise et l''anticipation.',
  'Découvrez comment fonctionne la motivation naturelle, pourquoi les notifications vous distraient, et comment préserver votre capacité à vous concentrer sans culpabilité.',
  'beginner',
  4,
  25,
  '[{"type": "hook", "content": "Votre cerveau ne cherche pas le seul plaisir ; il cherche surtout la surprise et l''anticipation."},{"type": "text", "content": "La dopamine est souvent appelée l''hormone du bonheur, mais ce n''est pas tout à fait exact. Elle est surtout l''hormone du désir et de l''anticipation. C''est elle qui vous pousse à vérifier votre téléphone, à ouvrir le réfrigérateur, ou à ouvrir un nouvel onglet."},{"type": "text", "content": "Le problème : les notifications, les réseaux sociaux et les jeux donnent des petites doses de dopamine très fréquemment. Votre cerveau apprend alors à attendre ces récompenses rapides et devient moins réceptif aux activités plus lentes mais plus satisfaisantes, comme la lecture ou le travail en profondeur."},{"type": "text", "content": "Ce n''est pas une question de volonté. Votre cerveau s''adapte simplement à ce qu''il reçoit. La bonne nouvelle : en réduisant les distractions artificielles pendant seulement quelques heures, vos récepteurs à la dopamine retrouvent leur sensibilité. Les petites choses redeviennent satisfaisantes."},{"type": "takeaway", "content": "Couper les notifications pendant 2h permet à votre cerveau de retrouver sa capacité à apprécier les tâches profondes."}]'::jsonb,
  3,
  true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel est le rôle principal de la dopamine ?', ARRAY['Produire le bonheur', 'Le désir et l''anticipation', 'Calmer l''anxiété', 'Réguler le sommeil'], 1, 'La dopamine motive l''action et crée l''anticipation, bien plus qu''elle ne produise le plaisir lui-même.', 0
FROM lessons WHERE slug = 'brain-dopamine';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Que se passe-t-il quand vous coupez les distractions artificielles ?', ARRAY['Rien de spécial', 'Vos récepteurs à la dopamine retrouvent leur sensibilité', 'Vous devenez plus anxieux', 'Vous perdez la motivation'], 1, 'En réduisant les stimuli artificiels, le cerveau re-sensibilise ses récepteurs, rendant les activités profondes à nouveau satisfaisantes.', 1
FROM lessons WHERE slug = 'brain-dopamine';

-- Vérifier
SELECT 
  l.title,
  l.is_published,
  c.name as category,
  (SELECT COUNT(*) FROM quizzes q WHERE q.lesson_id = l.id) as quiz_count
FROM lessons l
JOIN categories c ON l.category_id = c.id
ORDER BY l.order_index;