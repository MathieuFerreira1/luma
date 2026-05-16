-- ============================================================
-- Luma - Massive Content Seed + Test Account (v3 - JSON-safe)
-- Utilise jsonb_build_object pour éviter les problèmes de quotes
-- ============================================================

-- ============================================================
-- PARTIE 1 : SOMMEIL (4 leçons)
-- ============================================================

-- Leçon 1.1 : Cycle de sommeil
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sleep'),
  'sleep-cycles',
  'Comprendre votre cycle de sommeil',
  'Vous ne dormez pas d''une traite. Votre nuit est un voyage à travers plusieurs mondes.',
  'Découvrez les phases du sommeil, pourquoi elles sont essentielles, et comment optimiser la qualité de vos nuits.',
  'beginner', 4, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Vous ne dormez pas d''une traite. Votre nuit est un voyage à travers plusieurs mondes.'),
    jsonb_build_object('type', 'text', 'content', 'Chaque nuit, vous traversez 4 à 6 cycles de sommeil d''environ 90 minutes. Chaque cycle contient plusieurs phases : l''endormissement léger, le sommeil profond réparateur, et le sommeil paradoxal où vous rêvez.'),
    jsonb_build_object('type', 'text', 'content', 'Le sommeil profond est essentiel pour la récupération physique. C''est durant cette phase que votre corps libère l''hormone de croissance, répare les tissus, et consolide votre système immunitaire. En vieillissant, cette phase diminue naturellement.'),
    jsonb_build_object('type', 'text', 'content', 'Le sommeil paradoxal, lui, est crucial pour votre cerveau. C''est pendant le rêve que vous faites le tri des émotions, que vous consolidez la mémoire, et que vous résolvez des problèmes de manière créative. Priver quelqu''un de ses rêves le rend irritable et moins performant mentalement.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Un cycle complet dure ~90 min. Se réveiller en milieu de cycle = fatigue. Utilisez un réveil intelligent.')
  ),
  1, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Combien de cycles de sommeil traverse-t-on en moyenne par nuit ?', 
  ARRAY['1 à 2 cycles', '4 à 6 cycles', '8 à 10 cycles', '12 à 15 cycles'], 1,
  'Un cycle dure environ 90 minutes, et une nuit de 7-8h contient généralement 4 à 6 cycles complets.', 0
FROM lessons WHERE slug = 'sleep-cycles';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle phase du sommeil est essentielle pour la mémoire et la créativité ?', 
  ARRAY['Le sommeil léger', 'Le sommeil profond', 'Le sommeil paradoxal', 'L''éveil'], 2,
  'Le sommeil paradoxal (REM) est crucial pour la consolidation de la mémoire et le traitement émotionnel.', 1
FROM lessons WHERE slug = 'sleep-cycles';

-- Leçon 1.2 : Caféine
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sleep'),
  'sleep-caffeine',
  'La caféine : amie le jour, ennemie la nuit',
  'Votre dernier café de l''après-midi perturbe encore votre sommeil à minuit. Voici pourquoi.',
  'Comprenez la demi-vie de la caféine, comment elle bloque l''adénosine, et à quelle heure arrêter pour dormir sereinement.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Votre dernier café de l''après-midi perturbe encore votre sommeil à minuit. Voici pourquoi.'),
    jsonb_build_object('type', 'text', 'content', 'La caféine a une demi-vie de 5 à 6 heures chez la plupart des adultes. Cela signifie qu''un café bu à 15h laisse encore 50% de la caféine active dans votre sang à 20-21h, et 25% à minuit.'),
    jsonb_build_object('type', 'text', 'content', 'La caféine fonctionne en bloquant les récepteurs de l''adénosine, une molécule qui accumule la fatigue tout au long de la journée. En bloquant ces récepteurs, la caféine masque la fatigue sans la dissiper. Quand l''effet s''arrête, tout l''adénosine bloqué revient d''un coup.'),
    jsonb_build_object('type', 'text', 'content', 'Certains métabolisent la caféine plus vite (génétique CYP1A2), d''autres très lentement. Si vous avez du mal à vous endormir, essayez d''arrêter la caféine après 14h pendant une semaine et observez la différence.'),
    jsonb_build_object('type', 'takeaway', 'content', 'La demi-vie de la caféine est de 5-6h. Arrêtez après 14h pour un sommeil de qualité.')
  ),
  2, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la demi-vie moyenne de la caféine chez les adultes ?', 
  ARRAY['30 minutes', '2-3 heures', '5-6 heures', '12 heures'], 2,
  'La demi-vie de la caféine est d''environ 5-6 heures, ce qui signifie qu''elle reste longtemps dans le sang.', 0
FROM lessons WHERE slug = 'sleep-caffeine';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Comment la caféine masque-t-elle la fatigue ?', 
  ARRAY['Elle produit de l''énergie', 'Elle bloque les récepteurs de l''adénosine', 'Elle stimule l''adrénaline', 'Elle hydrate le corps'], 1,
  'La caféine bloque les récepteurs de l''adénosine, empêchant le cerveau de recevoir les signaux de fatigue.', 1
FROM lessons WHERE slug = 'sleep-caffeine';

-- Leçon 1.3 : Sieste
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sleep'),
  'sleep-nap',
  'La sieste parfaite en 20 minutes',
  'Une sieste bien faite recharge vos batteries. Une mauvaise sieste vous laisse groggy jusqu''au soir.',
  'Apprenez la science de la sieste optimale : durée, timing, et techniques pour vous réveiller frais et productif.',
  'intermediate', 3, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Une sieste bien faite recharge vos batteries. Une mauvaise sieste vous laisse groggy jusqu''au soir.'),
    jsonb_build_object('type', 'text', 'content', 'La sieste idéale dure entre 10 et 20 minutes. Assez long pour reposer l''esprit, assez court pour ne pas entrer en sommeil profond. Au-delà de 30 minutes, vous risquez le réveil en plein sommeil profond = état de confusion appelé inertie du sommeil.'),
    jsonb_build_object('type', 'text', 'content', 'Le meilleur moment pour une sieste est entre 13h et 15h, quand votre corps connaît naturellement une baisse d''énergie (rhythme circadien). Évitez les siestes après 16h car elles peuvent repousser votre endormissement le soir.'),
    jsonb_build_object('type', 'text', 'content', 'Astuce : buvez un café juste avant une sieste de 20 min. La caféine met ~20 min à agir. Au réveil, vous avez les bénéfices de la sieste PLUS ceux de la caféine. C''est la coffee nap, utilisée par les pilotes de course et les étudiants coréens.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Sieste de 10-20 min entre 13h-15h. Évitez au-delà de 30 min pour prévenir l''inertie du sommeil.')
  ),
  3, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la durée idéale d''une sieste pour éviter l''inertie du sommeil ?', 
  ARRAY['5 minutes', '10-20 minutes', '45 minutes', '90 minutes'], 1,
  '10-20 minutes permettent de se reposer sans entrer en sommeil profond, évitant ainsi l''inertie du sommeil.', 0
FROM lessons WHERE slug = 'sleep-nap';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel est le meilleur créneau horaire pour une sieste ?', 
  ARRAY['10h-11h', '13h-15h', '16h-17h', '19h-20h'], 1,
  'Entre 13h et 15h correspond à la baisse naturelle d''énergie du rythme circadien, idéale pour une sieste réparatrice.', 1
FROM lessons WHERE slug = 'sleep-nap';

-- Leçon 1.4 : Lumière bleue
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sleep'),
  'sleep-blue-light',
  'Pourquoi vos écrans volent votre sommeil',
  'Votre cerveau confond l''écran de votre téléphone avec le soleil de midi. Et il réagit en conséquence.',
  'Découvrez comment la lumière bleue affecte la mélatonine, pourquoi le mode nuit ne suffit pas, et des stratégies concrètes pour protéger vos nuits.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Votre cerveau confond l''écran de votre téléphone avec le soleil de midi. Et il réagit en conséquence.'),
    jsonb_build_object('type', 'text', 'content', 'Votre cerveau utilise la lumière pour réguler votre horloge interne. En particulier, la lumière bleue (450-495 nm) qui domine les écrans LED. Quand vos yeux reçoivent cette lumière le soir, le cerveau pense qu''il fait jour et supprime la production de mélatonine, l''hormone du sommeil.'),
    jsonb_build_object('type', 'text', 'content', 'Le mode nuit ou Night Shift réduit la lumière bleue mais ne l''élimine pas complètement. De plus, le contenu stimulant (notifications, réseaux sociaux, emails) garde votre cerveau actif. La lumière + le contenu = double effet négatif.'),
    jsonb_build_object('type', 'text', 'content', 'Solution pratique : arrêtez tout écran 1h avant le coucher. Si c''est impossible, utilisez des lunettes anti-lumière bleue (70-90% de filtrage), réduisez la luminosité au minimum, et évitez le contenu stimulant. Lisez un livre papier : la lumière réfléchie est bien moins intense que la lumière émise par un écran.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Arrêtez les écrans 1h avant le coucher. La lumière bleue supprime la mélatonine même en mode nuit.')
  ),
  4, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle hormone est supprimée par la lumière bleue des écrans ?', 
  ARRAY['La cortisol', 'La mélatonine', 'La sérotonine', 'L''adrénaline'], 1,
  'La mélatonine, hormone du sommeil, est supprimée par l''exposition à la lumière bleue le soir.', 0
FROM lessons WHERE slug = 'sleep-blue-light';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Pourquoi le mode nuit des écrans ne suffit-il pas ?', 
  ARRAY['Il n''existe pas', 'Il filtre mal la lumière bleue', 'Il émet trop de lumière', 'Il augmente la luminosité'], 1,
  'Le mode nuit réduit la lumière bleue mais ne l''élimine pas complètement. Le contenu stimulant reste aussi un problème.', 1
FROM lessons WHERE slug = 'sleep-blue-light';


-- ============================================================
-- PARTIE 2 : NUTRITION (4 leçons)
-- ============================================================

-- Leçon 2.2 : Microbiome
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'nutrition'),
  'nutrition-microbiome',
  'Votre deuxième cerveau vit dans votre ventre',
  '100 000 milliards d''organismes vivent en vous. Ils influencent votre humeur, votre poids, et même vos décisions.',
  'Découvrez le microbiome intestinal, son rôle sur la santé mentale et physique, et comment le nourrir correctement.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', '100 000 milliards d''organismes vivent en vous. Ils influencent votre humeur, votre poids, et même vos décisions.'),
    jsonb_build_object('type', 'text', 'content', 'Votre intestin contient environ 100 000 milliards de bactéries, soit 10 fois plus que de cellules humaines dans votre corps. Ensemble, elles forment le microbiome, un écosystème complexe qui pèse environ 2 kg.'),
    jsonb_build_object('type', 'text', 'content', 'Ces bactéries ne digèrent pas seulement votre nourriture. Elles produisent des vitamines (K, B12), régulent votre système immunitaire, et communiquent avec votre cerveau via l''axe intestin-cerveau. 95% de votre sérotonine, l''hormone du bien-être, est produite dans l''intestin.'),
    jsonb_build_object('type', 'text', 'content', 'Un microbiome diversifié est un microbiome sain. La diversité vient de manger varié : fibres, légumineuses, fruits, légumes fermentés (kimchi, choucroute, kéfir). Évitez les antibiotiques inutiles et les aliments ultra-transformés qui appauvrissent cette flore.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Mangez varié et fermenté pour nourrir votre microbiome. La diversité alimentaire = diversité bactérienne = santé.')
  ),
  3, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel pourcentage de la sérotonine est produit dans l''intestin ?', 
  ARRAY['10%', '50%', '70%', '95%'], 3,
  'Environ 95% de la sérotonine, l''hormone du bien-être, est produite dans l''intestin, pas dans le cerveau.', 0
FROM lessons WHERE slug = 'nutrition-microbiome';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Comment favoriser un microbiome diversifié ?', 
  ARRAY['Manger toujours la même chose', 'Éviter les fibres', 'Manger varié et fermenté', 'Prendre des antibiotiques'], 2,
  'La diversité alimentaire, notamment les aliments fermentés et riches en fibres, favorise un microbiome diversifié.', 1
FROM lessons WHERE slug = 'nutrition-microbiome';

-- Leçon 2.3 : Hydratation
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'nutrition'),
  'nutrition-hydration',
  'Boire de l''eau : plus complexe que vous ne le pensez',
  'Le verre d''eau au réveil est une bonne idée. Mais le moment et la quantité comptent autant que l''acte.',
  'Apprenez quand et combien boire, l''impact de l''hydratation sur le cerveau, et les pièges des boissons hydratantes.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Le verre d''eau au réveil est une bonne idée. Mais le moment et la quantité comptent autant que l''acte.'),
    jsonb_build_object('type', 'text', 'content', 'Votre corps est composé à 60% d''eau. Votre cerveau, à 75%. Même une légère déshydratation de 1-2% affecte votre concentration, votre humeur, et votre performance physique. Le problème : vous ne ressentez la soif que quand vous avez déjà perdu 1-2% d''eau.'),
    jsonb_build_object('type', 'text', 'content', 'La stratégie du grand verre au réveil est excellente car vous perdez de l''eau pendant le sommeil (respiration, transpiration). Mais évitez de boire trop avant de dormir pour ne pas vous réveiller. Répartissez votre consommation tout au long de la journée.'),
    jsonb_build_object('type', 'text', 'content', 'Méfiez-vous des boissons hydratantes sucrées. Le sucre peut augmenter la production d''urine et réduire l''hydratation nette. L''eau reste la meilleure option. Le thé, le café (en quantité modérée) et les fruits/légumes aqueux (concombre, pastèque, orange) comptent aussi.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Buvez un grand verre d''eau au réveil. Répartissez la consommation dans la journée. L''eau pure > boissons sucrées.')
  ),
  4, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'À quel pourcentage de déshydratation votre concentration est affectée ?', 
  ARRAY['0.5%', '1-2%', '5%', '10%'], 1,
  'Même une légère déshydratation de 1-2% affecte la concentration et les performances cognitives.', 0
FROM lessons WHERE slug = 'nutrition-hydration';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Pourquoi un verre d''eau au réveil est particulièrement bénéfique ?', 
  ARRAY['Cela purge les toxines', 'Vous perdez de l''eau pendant le sommeil', 'Cela active le métabolisme', 'Toutes ces réponses'], 1,
  'Pendant le sommeil, on perd de l''eau par respiration et transpiration. Le verre du matin compense cette perte.', 1
FROM lessons WHERE slug = 'nutrition-hydration';

-- Leçon 2.4 : Sucre caché
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'nutrition'),
  'nutrition-sugar',
  'Le sucre caché dans votre assiette',
  'Il se cache sous 56 noms différents. Vous en mangez probablement 3 fois plus que vous ne le pensez.',
  'Apprenez à repérer le sucre caché, comprenez son impact sur les vaisseaux sanguins, et découvrez des alternatives naturelles.',
  'beginner', 4, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Il se cache sous 56 noms différents. Vous en mangez probablement 3 fois plus que vous ne le pensez.'),
    jsonb_build_object('type', 'text', 'content', 'Le sucre ne se limite pas à la table à café. Il se cache sous des noms comme sirop de glucose-fructose, dextrose, maltodextrine, jus de fruits concentré. Même les produits sans sucres ajoutés peuvent contenir des sucres naturels en quantité élevée.'),
    jsonb_build_object('type', 'text', 'content', 'L''OMS recommande moins de 25g de sucres ajoutés par jour. Un yaourt aux fruits en contient souvent 15-20g. Un verre de soda = 35g. Un pain au chocolat = 20g. Cumulé sur une journée, on atteint facilement 80-100g sans s''en rendre compte.'),
    jsonb_build_object('type', 'text', 'content', 'Effet mécanisme : le sucre provoque un pic d''insuline, puis un creux. Ce cycle montagnes russes affecte votre énergie, votre humeur, et à long terme favorise l''inflammation et la résistance à l''insuline. Remplacez les boissons sucrées par de l''eau infusée (citron, menthe, concombre). C''est la modification la plus impactante et simple.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Lisez les étiquettes. L''OMS recommande <25g/jour de sucres ajoutés. L''eau infusée remplace avantageusement les boissons sucrées.')
  ),
  5, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la recommendation OMS pour les sucres ajoutés par jour ?', 
  ARRAY['Moins de 10g', 'Moins de 25g', 'Moins de 50g', 'Pas de limite'], 1,
  'L''OMS recommande de limiter les sucres ajoutés à moins de 25g par jour pour un adulte.', 0
FROM lessons WHERE slug = 'nutrition-sugar';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel est l''effet montagnes russes du sucre sur l''organisme ?', 
  ARRAY['Pic de suivi d''un creux de glycémie', 'Augmentation constante d''énergie', 'Amélioration du sommeil', 'Réduction de l''appétit'], 0,
  'Le sucre provoque un pic d''insuline suivi d''un creux, créant des cycles d''énergie et de fatigue.', 1
FROM lessons WHERE slug = 'nutrition-sugar';


-- ============================================================
-- PARTIE 3 : CERVEAU (4 leçons)
-- ============================================================

-- Leçon 3.2 : Neuroplasticité
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'brain'),
  'brain-neuroplasticity',
  'Votre cerveau change à tout âge',
  'Vous n''êtes pas condamné à vos habitudes. Votre cerveau se restructure constamment, à 20 ans comme à 60.',
  'Découvrez la neuroplasticité, comment créer de nouvelles connexions neuronales, et pourquoi la répétition crée l''habitude.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Vous n''êtes pas condamné à vos habitudes. Votre cerveau se restructure constamment, à 20 ans comme à 60.'),
    jsonb_build_object('type', 'text', 'content', 'La neuroplasticité est la capacité du cerveau à se modifier tout au long de la vie. Chaque fois que vous apprenez quelque chose de nouveau, des connexions neuronales se créent ou se renforcent. C''est comme créer un sentier dans une forêt : au début difficile à tracer, puis de plus en plus facile à emprunter.'),
    jsonb_build_object('type', 'text', 'content', 'Le principe clé : ce qui s''active ensemble se relie ensemble. Quand vous répétez une action, les neurones impliqués se connectent plus fortement. Après 21 jours de répétition, une nouvelle habitude commence à s''ancrer. Après 66 jours, elle devient quasi-automatique selon les recherches récentes.'),
    jsonb_build_object('type', 'text', 'content', 'La mauvaise nouvelle : les vieilles connexions ne disparaissent pas complètement. La bonne : vous pouvez les désservir en évitant de les activer, tout en renforçant les nouvelles. C''est pourquoi remplacer une mauvaise habitude par une bonne est plus efficace que de simplement supprimer la mauvaise.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Votre cerveau se restructure constamment. Répétez une action 66 jours pour ancrer une habitude. Remplacez plutôt que supprimez.')
  ),
  4, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Combien de jours environ pour ancrer une nouvelle habitude selon les recherches ?', 
  ARRAY['7 jours', '21 jours', '66 jours', '100 jours'], 2,
  'Selon une étude de 2009, il faut en moyenne 66 jours pour qu''une nouvelle habitude devienne automatique.', 0
FROM lessons WHERE slug = 'brain-neuroplasticity';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel est le principe fondamental de la neuroplasticité ?', 
  ARRAY['Les neurones ne changent jamais', 'Ce qui s''active ensemble se relie ensemble', 'Le cerveau arrête de grandir à 25 ans', 'Seuls les jeunes peuvent apprendre'], 1,
  'Le principe de Hebb : les neurones qui s''activent ensemble établissent des connexions plus fortes.', 1
FROM lessons WHERE slug = 'brain-neuroplasticity';

-- Leçon 3.3 : Stress et cortisol
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'brain'),
  'brain-stress',
  'Le stress : ennemi invisible de votre cerveau',
  'Un peu de stress vous motive. Trop de stress pendant trop longtemps détruit vos neurones.',
  'Comprendre le cortisol, la différence entre stress aigu et chronique, et des techniques de régulation simples.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Un peu de stress vous motive. Trop de stress pendant trop longtemps détruit vos neurones.'),
    jsonb_build_object('type', 'text', 'content', 'Le stress aigu (courte durée) est utile : il mobilise l''énergie, aiguise vos sens, améliore la mémoire à court terme. C''est la réaction fuite ou combat héritée de nos ancêtres. Mais le stress chronique (tous les jours, pendant des mois) est toxique.'),
    jsonb_build_object('type', 'text', 'content', 'Le cortisol, hormone du stress, est libéré en continu. À long terme, il réduit la production de BDNF (factor de croissance neuronale), rétrécit l''hippocampe (mémoire), et affaiblit le système immunitaire. Le stress chronique accélère aussi le vieillissement cellulaire via les télomères.'),
    jsonb_build_object('type', 'text', 'content', 'Bonne nouvelle : le cerveau peut récupérer. Des techniques comme la respiration 4-7-8 (4s inspiration, 7s rétention, 8s expiration), la marche en pleine conscience 10 min/jour, ou le contact avec la nature réduisent significativement le cortisol en quelques semaines. Le sport régulier est aussi un antistress puissant.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Le stress chronique rétrécit l''hippocampe. Respiration 4-7-8, marche, sport, nature : antidotes validés par la science.')
  ),
  5, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle hormone est associée au stress chronique ?', 
  ARRAY['L''insuline', 'Le cortisol', 'La mélatonine', 'L''ocytocine'], 1,
  'Le cortisol est l''hormone principale du stress, toxique à long terme pour le cerveau et le corps.', 0
FROM lessons WHERE slug = 'brain-stress';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle technique de respiration peut réduire le stress rapidement ?', 
  ARRAY['Respiration 2-2-2', 'Respiration 4-7-8', 'Respiration 1-10-1', 'Respiration 8-8-8'], 1,
  'La respiration 4-7-8 (4s inspiration, 7s rétention, 8s expiration) active le système parasympathique et réduit le stress.', 1
FROM lessons WHERE slug = 'brain-stress';

-- Leçon 3.4 : Mémoire et révision
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'brain'),
  'brain-memory',
  'Apprendre une fois, retenir pour toujours',
  'Relire 5 fois la même page est la méthode la moins efficace. Voici ce que dit la science sur la mémoire.',
  'Découvrir la courbe de l''oubli, la répétition espacée, et l''effet de test pour apprendre efficacement.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Relire 5 fois la même page est la méthode la moins efficace. Voici ce que dit la science sur la mémoire.'),
    jsonb_build_object('type', 'text', 'content', 'La courbe de l''oubli d''Ebbinghaus montre qu''on oublie 50% d''une information en 1 heure, 70% en 24h, et 90% en une semaine. Seulement si on ne fait rien. Mais avec la bonne technique, on peut retenir 80% sur le long terme.'),
    jsonb_build_object('type', 'text', 'content', 'La répétition espacée : révisez l''information juste avant de l''oublier. Jour 1 après l''apprentissage, puis jour 3, jour 7, jour 14, jour 30. C''est le principe des applications comme Anki. Effort minimal, rétention maximale.'),
    jsonb_build_object('type', 'text', 'content', 'L''effet de test : se tester sur une information la retient mieux que de la relire. Posez-vous des questions, expliquez à voix haute comme à un enfant (technique Feynman), ou faites des flashcards. L''effort pour retrouver l''information renforce les connexions neuronales.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Révisez au jour 1, 3, 7, 14, 30. Testez-vous plutôt que de relire. L''effort de récupération renforce la mémoire.')
  ),
  6, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Selon la courbe de l''oubli, quel pourcentage est oublié en 24h sans révision ?', 
  ARRAY['20%', '50%', '70%', '90%'], 2,
  'Sans révision, on oublie environ 70% d''une information en 24 heures selon Ebbinghaus.', 0
FROM lessons WHERE slug = 'brain-memory';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle technique est plus efficace que la relecture simple ?', 
  ARRAY['Souligner en couleurs', 'Se tester (effet de test)', 'Écouter de la musique', 'Cramer de minuit'], 1,
  'Se tester sur le contenu (effet de test) renforce la mémoire bien plus que la simple relecture.', 1
FROM lessons WHERE slug = 'brain-memory';


-- ============================================================
-- PARTIE 4 : MOUVEMENT (4 leçons)
-- ============================================================

-- Leçon 4.1 : Cardio
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'movement'),
  'movement-cardio',
  'Pourquoi 20 minutes de marche changent votre cerveau',
  'Vous n''avez pas besoin d''une salle de sport. Un simple mouvement régulier redessine votre cerveau.',
  'Découvrez comment l''exercice modéré affecte la neurogenèse, l''humeur, et la cognition sur le long terme.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Vous n''avez pas besoin d''une salle de sport. Un simple mouvement régulier redessine votre cerveau.'),
    jsonb_build_object('type', 'text', 'content', '20 minutes d''exercice modéré (marche rapide, vélo) augmentent le flux sanguin cérébral de 15-20%. Immédiatement après, votre humeur s''améliore grâce aux endorphines et à la sérotonine. Votre mémoire de travail fonctionne aussi mieux pendant 1-2h.'),
    jsonb_build_object('type', 'text', 'content', 'À long terme, l''exercice régulier stimule la neurogenèse (naissance de nouveaux neurones) dans l''hippocampe, la zone de la mémoire. Il augmente aussi la production de BDNF, la protéine qui fertilise vos connexions neuronales. Résultat : meilleure mémoire, clarté mentale, et réduction du risque de démence.'),
    jsonb_build_object('type', 'text', 'content', 'L''astuce : la régularité bat l''intensité. 20 min/jour, 5 jours/semaine battent largement 2h intensives par semaine. Le cerveau répond mieux à la fréquence qu''à l''intensité. Commencez par une promenade de 10 minutes après le déjeuner. C''est déjà un excellent début.'),
    jsonb_build_object('type', 'takeaway', 'content', '20 min/jour de marche rapide > 2h intensif/semaine. La régularité stimule la neurogenèse et la mémoire.')
  ),
  1, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel effet l''exercice a-t-il sur le flux sanguin cérébral ?', 
  ARRAY['Il le diminue', 'Il l''augmente de 15-20%', 'Il n''a pas d''effet', 'Il le bloque'], 1,
  '20 minutes d''exercice modéré augmentent le flux sanguin cérébral de 15-20%, améliorant la cognition.', 0
FROM lessons WHERE slug = 'movement-cardio';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle zone cérébrale bénéficie de la neurogenèse grâce à l''exercice ?', 
  ARRAY['Le cortex frontal', 'L''hippocampe', 'Le cervelet', 'L''amygdale'], 1,
  'L''exercice stimule la neurogenèse dans l''hippocampe, la zone clé de la mémoire et de l''apprentissage.', 1
FROM lessons WHERE slug = 'movement-cardio';

-- Leçon 4.2 : Marche quotidienne
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'movement'),
  'movement-walk',
  'La marche : méditation en mouvement',
  'Pas besoin de courir un marathon. Marcher, c''est déjà transformer votre santé mentale et physique.',
  'Explorez les bénéfices de la marche quotidienne, les techniques de marche consciente, et comment en faire une habitude.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Pas besoin de courir un marathon. Marcher, c''est déjà transformer votre santé mentale et physique.'),
    jsonb_build_object('type', 'text', 'content', 'La marche est l''exercice le plus naturel et le plus accessible. 30 minutes de marche quotidienne réduisent le risque cardiovasculaire de 30%, améliorent le sommeil, réduisent l''anxiété, et stimulent la créativité. Des études montrent que marcher augmente la production d''idées créatives de 60% comparé au fait d''être assis.'),
    jsonb_build_object('type', 'text', 'content', 'La marche en pleine conscience amplifie ces bénéfices. Au lieu de penser à votre to-do list, concentrez-vous sur : le contact de vos pieds au sol, le rythme de votre respiration, les sons autour de vous, la sensation de l''air sur votre peau. Cela ancre le moment présent et calme le système nerveux.'),
    jsonb_build_object('type', 'text', 'content', 'Intégrez la marche dans votre routine : marchez pour répondre à un appel, faites une réunion en marchant, marchez après le déjeuner pour la digestion, ou faites un tour de quartier après le travail pour marquer la transition. Le pas compte, pas la distance.'),
    jsonb_build_object('type', 'takeaway', 'content', '30 min de marche/jour = -30% risque cardiaque, +60% créativité. Marchez en pleine conscience pour décupler les bénéfices.')
  ),
  2, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'De combien la marche augmente-t-elle la créativité selon les études ?', 
  ARRAY['10%', '30%', '60%', '100%'], 2,
  'Des études montrent que marcher augmente la production d''idées créatives de 60% comparé au fait d''être assis.', 0
FROM lessons WHERE slug = 'movement-walk';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel pourcentage de réduction du risque cardiovasculaire avec 30 min de marche/jour ?', 
  ARRAY['10%', '20%', '30%', '50%'], 2,
  '30 minutes de marche quotidienne réduisent le risque cardiovasculaire d''environ 30%.', 1
FROM lessons WHERE slug = 'movement-walk';

-- Leçon 4.3 : Échauffement
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'movement'),
  'movement-warmup',
  'Pourquoi votre échauffement est aussi important que l''exercice',
  'Passer à côté de l''échauffement, c''est comme démarrer une voiture par -10°C sans laisser tourner le moteur.',
  'Comprendre la physiologie de l''échauffement, pourquoi les étirements statiques avant sont contre-produits, et la routine optimale.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Passer à côté de l''échauffement, c''est comme démarrer une voiture par -10°C sans laisser tourner le moteur.'),
    jsonb_build_object('type', 'text', 'content', 'L''échauffement a 4 fonctions essentielles : augmenter la température musculaire (meilleure contraction), accélérer le rythme cardiaque (meilleur flux sanguin), lubrifier les articulations (synovie), et préparer le système nerveux (coordination). Sans échauffement, risque de blessure +50%.'),
    jsonb_build_object('type', 'text', 'content', 'Mauvaise nouvelle : les étirements statiques (toucher ses pieds) AVANT l''exercice réduisent la force musculaire de 5-8% et n''empêchent pas les blessures. Ils assouplissent mais affaiblissent temporairement. Gardez les étirements statiques pour APRÈS l''exercice.'),
    jsonb_build_object('type', 'text', 'content', 'Bonne routine : 5 min de mouvement général (marche, vélo lent), puis des mobilisations dynamiques (cercles de bras, rotations de hanches, fentes marchées). Enfin, des répétitions légères du mouvement principal. Cela prépare spécifiquement votre corps pour ce qui vient.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Échauffement dynamique > statique. 5 min de cardio léger + mobilisations articulaires avant. Étirements APRÈS.')
  ),
  3, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Pourquoi éviter les étirements statiques avant l''exercice ?', 
  ARRAY['Ils augmentent le risque de blessure', 'Ils réduisent temporairement la force de 5-8%', 'Ils sont inefficaces', 'Toutes ces réponses'], 1,
  'Les étirements statiques avant l''exercice réduisent la force musculaire de 5-8% sans prévenir les blessures.', 0
FROM lessons WHERE slug = 'movement-warmup';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la meilleure séquence d''échauffement ?', 
  ARRAY['Étirements statiques puis cardio', 'Cardio léger + mobilisations dynamiques', 'Exercice maximal immédiatement', 'Étirements + poids lourds'], 1,
  'La séquence optimale est cardio léger (5 min) puis mobilisations dynamiques, puis exercice principal.', 1
FROM lessons WHERE slug = 'movement-warmup';

-- Leçon 4.4 : Posture
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'movement'),
  'movement-posture',
  'Votre posture affecte votre humeur (et vice versa)',
  'Vous ne vous tenez pas mal parce que vous êtes triste. Vous êtes peut-être triste parce que vous vous tenez mal.',
  'Découvrir le lien corps-esprit via la posture, les effets de la position assise prolongée, et des exercices correctifs simples.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Vous ne vous tenez pas mal parce que vous êtes triste. Vous êtes peut-être triste parce que vous vous tenez mal.'),
    jsonb_build_object('type', 'text', 'content', 'Une étude de 2017 montre que tenir une posture droite augmente la confiance en soi et réduit la fatigue mentale. Inversement, une posture voutée augmente les pensées négatives. Le corps et le cerveau s''influencent mutuellement : le feedback proprioceptif (position du corps) affecte directement les circuits émotionnels.'),
    jsonb_build_object('type', 'text', 'content', 'Le problème moderne : 8-10h/jour assis. La position assise prolongée rétrécit les hanches, affaiblit les fessiers, allonge les muscles du dos, et comprime les disques vertébraux. Résultat : douleurs lombaires, maux de tête, fatigue. Même un bon fauteuil ne compense pas le fait d''être assis.'),
    jsonb_build_object('type', 'text', 'content', 'Solutions simples : levez-vous toutes les 30-45 minutes (même 1 min suffit). Faites des étirements de hanche (fente du coureur) et des ponts de fessiers tous les jours. Surveillez votre écran à hauteur des yeux pour éviter le coup en avant. Utilisez un bureau debout quelques heures par jour si possible.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Posture droite = humeur positive. Levez-vous toutes les 30-45 min. Étirez hanches et fessiers quotidiennement.')
  ),
  4, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Selon une étude de 2017, quelle posture améliore la confiance et réduit la fatigue ?', 
  ARRAY['Posture voutée', 'Posture droite', 'Posture couchée', 'Posture tête en bas'], 1,
  'Une posture droite augmente la confiance en soi et réduit la fatigue mentale selon les recherches.', 0
FROM lessons WHERE slug = 'movement-posture';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'À quelle fréquence se lever quand on est assis longtemps ?', 
  ARRAY['Toutes les 2 heures', 'Toutes les 30-45 minutes', 'Une fois par jour', 'Jamais'], 1,
  'Se lever toutes les 30-45 minutes, même 1 minute, prévient les problèmes liés à la position assise prolongée.', 1
FROM lessons WHERE slug = 'movement-posture';


-- ============================================================
-- PARTIE 5 : LONGEVITE (4 leçons)
-- ============================================================

-- Leçon 5.1 : Inflammation chronique
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'longevity'),
  'longevity-inflammation',
  'L''inflammation silencieuse qui vieillit vos cellules',
  'Vous ne la voyez pas, ne la sentez pas, mais elle travaille lentement à dégrader votre corps.',
  'Comprendre l''inflammation chronique faible grade, ses causes alimentaires, et comment la réduire naturellement.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Vous ne la voyez pas, ne la sentez pas, mais elle travaille lentement à dégrader votre corps.'),
    jsonb_build_object('type', 'text', 'content', 'L''inflammation aiguë est utile : elle soigne une coupure ou combat une infection. Mais l''inflammation chronique faible grade est silencieuse et dévastatrice. Elle est impliquée dans les maladies cardiovasculaires, le diabète, la démence, et le vieillissement accéléré.'),
    jsonb_build_object('type', 'text', 'content', 'Les principaux déclencheurs : sucre raffiné, graisses trans, alcool excessif, sédentarité, stress chronique, manque de sommeil, et obésité viscérale (graisse du ventre). Cette graisse n''est pas inerte : elle produit des cytokines pro-inflammatoires en continu.'),
    jsonb_build_object('type', 'text', 'content', 'Antidotes puissants : oméga-3 (poissons gras, graines de lin, noix), légumes à feuilles vertes (épinards, chou kale), baies (myrtilles, canneberges), épices (curcuma, gingembre, cannelle), et exercice régulier. Le jeûne intermittent de 12-16h réduit aussi les marqueurs d''inflammation.'),
    jsonb_build_object('type', 'takeaway', 'content', 'L''inflammation chronique accélère le vieillissement. Réduisez sucre, graisses trans, stress. Augmentez oméga-3, légumes verts, épices.')
  ),
  1, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle graisse produit des cytokines pro-inflammatoires ?', 
  ARRAY['La graisse sous-cutanée', 'La graisse viscérale (ventre)', 'La graisse brune', 'Toutes les graisses'], 1,
  'La graisse viscérale (autour des organes) produit des cytokines pro-inflammatoires, alimentant l''inflammation chronique.', 0
FROM lessons WHERE slug = 'longevity-inflammation';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel nutriment est un puissant anti-inflammatoire ?', 
  ARRAY['Oméga-3', 'Sucre raffiné', 'Alcool', 'Sodium'], 0,
  'Les oméga-3 (poissons gras, graines de lin, noix) ont des propriétés anti-inflammatoires documentées.', 1
FROM lessons WHERE slug = 'longevity-inflammation';

-- Leçon 5.2 : Jeûne intermittent
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'longevity'),
  'longevity-fasting',
  'Le jeûne intermittent : régénération cellulaire',
  'Ne pas manger pendant 16h ne vous affaiblit pas. Au contraire, cela déclenche un nettoyage cellulaire profond.',
  'Découvrir l''autophagie, les protocoles de jeûne, et comment commencez sans risque pour votre métabolisme.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Ne pas manger pendant 16h ne vous affaiblit pas. Au contraire, cela déclenche un nettoyage cellulaire profond.'),
    jsonb_build_object('type', 'text', 'content', 'L''autophagie, mot grec signifiant se manger soi-même, est un processus de nettoyage cellulaire. Quand vous jeûnez 12-16h, votre corps passe en mode maintenance : il recycle les protéines endommagées, nettoie les mitochondries dysfonctionnelles, et stimule la production de BDNF. C''est comme un reset interne.'),
    jsonb_build_object('type', 'text', 'content', 'Les bénéfices documentés : amélioration de la sensibilité à l''insuline, réduction des marqueurs inflammatoires, meilleure fonction cognitive, et potentiellement allongement de l''espérance de vie (données animales solides, humaines encourageantes). Le jeûne de 16h (par exemple repas à 20h, prochain à 12h) est accessible à la plupart.'),
    jsonb_build_object('type', 'text', 'content', 'Commencez progressivement : 12h pendant une semaine, puis 14h, puis 16h. Buvez beaucoup d''eau, thé, café noir (sans sucre). Si vous êtes enceinte, diabétique sous insuline, ou avec antécédents de trouble alimentaire, consultez un médecin avant. Le jeûne n''est pas une punition, c''est un outil de santé.'),
    jsonb_build_object('type', 'takeaway', 'content', '12-16h de jeûne déclenchent l''autophagie (nettoyage cellulaire). Commencez par 12h, progressez lentement. Buvez beaucoup d''eau.')
  ),
  2, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Qu''est-ce que l''autophagie ?', 
  ARRAY['Une maladie', 'Un nettoyage cellulaire', 'Un type de régime', 'Un supplément'], 1,
  'L''autophagie est un processus de recyclage cellulaire activé par le jeûne de 12-16 heures.', 0
FROM lessons WHERE slug = 'longevity-fasting';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la durée minimale de jeûne pour activer l''autophagie ?', 
  ARRAY['4 heures', '8 heures', '12-16 heures', '48 heures'], 2,
  'L''autophagie commence généralement après 12-16h de jeûne chez la plupart des individus.', 1
FROM lessons WHERE slug = 'longevity-fasting';

-- Leçon 5.3 : Vitamine D
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'longevity'),
  'longevity-vitamin-d',
  'La vitamine D : hormone solaire méconnue',
  '80% des Européens en manquent en hiver. Et ce n''est pas qu''une question d''os solides.',
  'Découvrir le rôle hormonal de la vitamine D, ses effets sur l''immunité et l''humeur, et comment optimiser ses niveaux.',
  'beginner', 3, 20,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', '80% des Européens en manquent en hiver. Et ce n''est pas qu''une question d''os solides.'),
    jsonb_build_object('type', 'text', 'content', 'La vitamine D est en réalité une hormone synthétisée par la peau sous exposition au UVB. Elle régule plus de 1000 gènes dans votre corps. Rôle osseux connu, mais aussi : système immunitaire (réduction des infections respiratoires), humeur (lien avec la dépression saisonnière), et potentiellement prévention de certaines maladies auto-immunes.'),
    jsonb_build_object('type', 'text', 'content', 'L''exposition solaire reste la meilleure source. 15-20 min de soleil sur bras et jambes (sans écran) génèrent 10 000-20 000 UI. En hiver, l''angle du soleil est trop faible en Europe pour produire de la vitamine D. D''où la carence massive de novembre à mars.'),
    jsonb_build_object('type', 'text', 'content', 'Aliments riches : poissons gras (saumon, maquereau, sardines), jaunes d''œufs, champignons exposés au UV. Supplémentation recommandée en hiver : 1000-2000 UI/jour (vérifier vos niveaux sanguins d''abord). Attention : la vitamine D est liposoluble, elle s''accumule. Ne dépassez pas 4000 UI/jour sans surveillance médicale.'),
    jsonb_build_object('type', 'takeaway', 'content', '15-20 min de soleil/jour en été. En hiver : poissons gras ou supplémentation 1000-2000 UI. Vérifiez vos niveaux sanguins.')
  ),
  3, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel pourcentage d''Européens manque de vitamine D en hiver ?', 
  ARRAY['20%', '50%', '80%', '95%'], 2,
  'Environ 80% des Européens présentent une carence en vitamine D durant l''hiver.', 0
FROM lessons WHERE slug = 'longevity-vitamin-d';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quelle est la meilleure source de vitamine D ?', 
  ARRAY['Les agrumes', 'L''exposition solaire', 'Les légumes verts', 'Le lait'], 1,
  'L''exposition au soleil reste la source la plus efficace et naturelle de vitamine D.', 1
FROM lessons WHERE slug = 'longevity-vitamin-d';

-- Leçon 5.4 : Sommeil profond et longévité
INSERT INTO lessons (category_id, slug, title, hook, description, difficulty, estimated_time, xp_reward, blocks, order_index, is_published)
VALUES (
  (SELECT id FROM categories WHERE slug = 'longevity'),
  'longevity-sleep-deep',
  'Dormir pour vivre plus longtemps',
  'Chaque heure de sommeil profond est une heure de maintenance corporelle. Négligez-la, et votre corps s''use plus vite.',
  'Explorer le lien entre qualité du sommeil et longévité, les mécanismes de réparation nocturne, et comment optimiser chaque phase.',
  'intermediate', 4, 25,
  jsonb_build_array(
    jsonb_build_object('type', 'hook', 'content', 'Chaque heure de sommeil profond est une heure de maintenance corporelle. Négligez-la, et votre corps s''use plus vite.'),
    jsonb_build_object('type', 'text', 'content', 'Le sommeil profond (slow wave sleep) est la phase de réparation maximale. Votre cerveau active le système glymphatique, un réseau de drainage qui élimine les déchets métaboliques accumulés dans la journée, y compris les plaques bêta-amyloïdes associées à Alzheimer. Sans sommeil profond suffisant, ces déchets s''accumulent.'),
    jsonb_build_object('type', 'text', 'content', 'Durant le sommeil profond, votre corps libère l''hormone de croissance, répare les vaisseaux sanguins, renforce le système immunitaire, et régule l''insuline. Les études montrent que dormir moins de 6h régulièrement augmente le risque de maladies cardiovasculaires de 48%, de diabète de type 2 de 30%, et de démence de 33%.'),
    jsonb_build_object('type', 'text', 'content', 'Pour maximiser le sommeil profond : maintenez un horaire régulier (même le week-end), gardez la chambre fraîche (18-19°C), évitez l''alcool 3h avant le coucher (il fragmente le sommeil profond), et exposez-vous à la lumière naturelle le matin pour ancrer votre rythme circadien.'),
    jsonb_build_object('type', 'takeaway', 'content', 'Le sommeil profond élimine les déchets cérébraux et répare le corps. <6h/nuit augmente significativement les risques de maladies chroniques.')
  ),
  4, true
);

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel système élimine les déchets cérébraux pendant le sommeil profond ?', 
  ARRAY['Le système lymphatique', 'Le système glymphatique', 'Le système nerveux', 'Le système digestif'], 1,
  'Le système glymphatique activé pendant le sommeil profond draine les déchets métaboliques du cerveau.', 0
FROM lessons WHERE slug = 'longevity-sleep-deep';

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT id, 'Quel est le risque additionnel de maladies cardiovasculaires avec <6h de sommeil ?', 
  ARRAY['10%', '25%', '48%', '75%'], 2,
  'Dormir moins de 6h régulièrement augmente le risque de maladies cardiovasculaires de 48%.', 1
FROM lessons WHERE slug = 'longevity-sleep-deep';


-- ============================================================
-- PARTIE 6 : COMPTE TEST AVEC PROGRESSION
-- ============================================================
-- 
-- ETAPES MANUELLES :
-- 1. Créer l'utilisateur dans Supabase Dashboard :
--    Authentication → Users → New User
--    Email: test@luma.app
--    Password: LumaTest123
--    Le trigger handle_new_user() va créer automatiquement le profil
-- 2. Une fois créé, récupérer son UUID (généralement généré automatiquement)
-- 3. Exécuter la suite avec le bon UUID
--
-- IMPORTANT : Remplacez 'USER_UUID_HERE' par le vrai UUID de l'utilisateur

-- Exemple avec un UUID placeholder :
-- Mettre à jour le profil créé par le trigger
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

-- Progression : marquer plusieurs leçons comme complétées
INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, xp_earned)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'test@luma.app'),
  l.id,
  true,
  NOW() - INTERVAL '7 days',
  l.xp_reward
FROM lessons l
WHERE l.slug IN (
  'sleep-cycles', 'sleep-caffeine' -- Vous pouvez en ajouter d'autres
)
AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'test@luma.app')
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Quelques achievements débloqués
INSERT INTO user_achievements (user_id, achievement_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'test@luma.app'),
  a.id
FROM achievements a
WHERE a.slug IN ('first-lesson', 'streak-3')
AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'test@luma.app')
ON CONFLICT (user_id, achievement_id) DO NOTHING;


-- ============================================================
-- PARTIE 7 : FONCTIONS POUR RESET LA PROGRESSION (TESTS)
-- ============================================================

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
SELECT '📊 CONTENU CREE' as info;

SELECT 
  c.name as category,
  COUNT(l.id) as lesson_count,
  SUM((SELECT COUNT(*) FROM quizzes q WHERE q.lesson_id = l.id)) as quiz_count
FROM categories c
LEFT JOIN lessons l ON l.category_id = c.id
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order;

SELECT '🎯 COMPTE TEST' as info,
  username, level, xp, streak
FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'test@luma.app');