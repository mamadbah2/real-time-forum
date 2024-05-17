INSERT INTO User (username, age, gender, firstname, lastname, email, `password`)
VALUES 
    ('alicemith', 25, 'Female', 'Alice', 'Smith', 'alice.smith@example.com', 'MotDePasse123'),
    ('bobohnson', 30, 'Male', 'Bob', 'Johnson', 'bob.johnson@example.com', 'Secret456'),
    ('fatima', 40, 'Female', 'Fatima', 'Gn', 'fatima@fatima.gn', '$2a$12$S3254YLmkrIEOXmdYXo73OL6URt9Y.ccelnjwMsenQxvH8VlRymby'),
    ('charliebrown', 28, 'Male', 'Charlie', 'Brown', 'charlie.brown@example.com', 'P@ssw0rd'),
    ('davidmiller', 35, 'Male', 'David', 'Miller', 'david.miller@example.com', 'Secure789'),
    ('emmawhite', 22, 'Female', 'Emma', 'White', 'emma.white@example.com', 'Confidential987'),
    ('bobodenar', 45, 'Other', 'Bobo', 'DeNar', 'bahs@gmail.com', '$2a$12$Sa.9gDTECdrMfKK/rWYaHuUJZtzgnmiwk9i7mroAzUyscgsDDo4Zy');
-- Insertion de données fictives dans la table Category
INSERT INTO Category (name)
VALUES ('Religion'),
    ('Technologie'),
    ('Voyages'),
    ('Cuisine'),
    ('Sport'),
    ('Mode');
-- Insertion de données fictives dans la table Post
INSERT INTO Post (content, image_name, creation_date, `user_id`)
VALUES (
        'Nouvelle découverte technologique !  
        Lorem ipsum dolor sit, amet consectetur adipisicing. 
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
         Unde quo dignissimos eaque error delectus quidem incidunt sunt 
         cumque eius maxime? Iusto fuga repudiandae accusantium dolore, ullam 
         explicabo incidunt magni expedita. ',
        '',
        '2022-02-10 13:02:25',
        1
    ),
    (
        'Mes vacances à la plage de la Guinee',
        'gojo.jpg',
        '2022-02-11 01:56:00',
        2
    ),
    (
        'Recette secrète de grand-mère vraiment secrete hein',
        'goku.jpg',
        '2022-02-12 21:23:47',
        3
    ),
    (
        'Entraînement intensif maintenant',
        'narutoEres.jpeg',
        '2022-02-13 07:26:12',
        4
    ),
    (
        'Tendances de la mode automne 2022',
        'tanjiro.jpeg',
        '2022-02-14 20:01:30',
        5
    );
-- Insertion de données fictives dans la table Comment
INSERT INTO Comment (comment, date_creation, post_id, `user_id`)
VALUES ('Super article !', '2022-02-14 20:02:30', 1, 3),
    (
        "J'adore cet endroit ! ",
        '2022-03-14 10:02:30',
        5,
        3
    ),
    (
        "J'me demande pourquoi autant de beauté ! ",
        '2022-02-15 06:02:30',
        5,
        3
    ),
    (
        ' Délicieux, merci pour la recette ! ',
        '2022-02-16 16:10:30',
        3,
        3
    ),
    (
        ' Continuez comme ça ! ',
        '2022-02-15 16:12:50',
        4,
        1
    ),
    (
        ' Haha mdr c est dur actuellement fori ! ',
        '2022-03-14 21:42:30',
        4,
        3
    ),
    (
        ' Vraiment je vous encourage de nouveau !! Continuez comme ça ! ',
        '2022-02-17 20:02:30',
        4,
        1
    ),
    (
        ' Les nouvelles tendances sont incroyables ',
        '2022-02-24 14:42:20',
        5,
        1
    );
-- Insertion de données fictives dans la table PostCategory
INSERT INTO PostCategory (post_id, category_id)
VALUES (1, 1),
    (2, 2),
    (2, 4),
    (3, 5),
    (3, 3),
    (4, 4),
    (4, 2),
    (4, 1),
    (5, 5);
-- Insertion de données fictives dans la table LikeDislike
INSERT INTO LikeDislike (user_id, post_id, liked, disliked)
VALUES (1, 1, true, false),
    (2, 2, false, true),
    (2, 3, true, false),
    (3, 1, true, false),
    (3, 4, false, true),
    (4, 4, true, false),
    (5, 4, true, false);
-- Insertion de données fictives dans la table LikeDislike
INSERT INTO ReactionComments (user_id, comment_id, liked, disliked)
VALUES (1, 1, true, false),
    (2, 2, false, true),
    (2, 3, true, false),
    (3, 1, true, false),
    (3, 4, false, true),
    (4, 4, true, false),
    (5, 4, true, false);
-- Insertion de données fictives dans la table Messages
INSERT INTO Messages (content, creation_date, sender_id, receiver_id)
VALUES

    -- 2024-05-07 10:09:00
    ('En effet, j apprends beaucoup de choses nouvelles.', '2024-05-07 10:09:00', 4, 3),
    ('C est génial !', '2024-05-07 10:10:00', 7, 1),
    ('Et toi, que fais-tu ?', '2024-05-07 10:11:00', 1, 7),
    ('Je suis développeur web.', '2024-05-07 10:12:00', 3, 4),
    ('Ah, c est intéressant !', '2024-05-07 10:13:00', 7, 1),
    ('J adore créer des sites web et des applications.', '2024-05-07 10:14:00', 3, 4),
    ('Moi aussi ! C est très gratifiant de voir ses créations prendre vie.', '2024-05-07 10:15:00', 1, 7),
    ('Tout à fait !', '2024-05-07 10:16:00', 3, 4),

    -- 2024-05-07 10:17:00
    ('Et quels sont tes projets en cours ?', '2024-05-07 10:17:00', 7, 1),
    ('En ce moment, je développe une application mobile pour gérer les tâches.', '2024-05-07 10:18:00', 3, 4),
    ('Cela semble très utile !', '2024-05-07 10:19:00', 1, 7),
    ('Oui, l objectif est d aider les gens à rester organisés et productifs.', '2024-05-07 10:20:00', 3, 4),
    ('C est une excellente idée ! Je suis sûr que beaucoup de gens l apprécieront.', '2024-05-07 10:21:00', 1, 7),
    ('J espère !', '2024-05-07 10:22:00', 7, 1),

    -- 2024-05-07 10:23:00
    ('As-tu déjà rencontré des difficultés pendant le développement ?', '2024-05-07 10:23:00', 7, 1),
    ('Bien sûr, comme dans tout projet de développement. Mais j aime les défis et cela me permet d apprendre de nouvelles choses.', '2024-05-07 10:24:00', 1, 7),
    ('C est vrai, les défis nous font grandir.', '2024-05-07 10:25:00', 1, 7),
    ('Exactement ! Et puis, c est toujours satisfaisant de surmonter les obstacles.', '2024-05-07 10:26:00', 3, 4),
    ('Tout à fait !', '2024-05-07 10:27:00', 1, 7),

    -- 2024-05-07 10:28:00
    ('Penses-tu partager ton application une fois terminée ?', '2024-05-07 10:28:00', 7, 1),
    ('Oui, j envisage de la publier sur les stores d applications pour que tout le monde puisse en profiter.', '2024-05-07 10:29:00', 3, 4),
    ('C est une excellente idée ! Je suis sûr qu elle aura beaucoup de succès.', '2024-05-07 10:30:00', 1, 7),
    ('Merci beaucoup ! J espère bien. J ai hâte de la partager avec le monde.', '2024-05-07 10:31:00', 7, 1),
    ('N hésite pas à me demander si tu as besoin d aide pour le développement ou la promotion de ton application.', '2024-05-07 10:32:00', 1, 7),
    ('C est très gentil de ta part, merci ! Je te tiendrai au courant de l avancement du projet.', '2024-05-07 10:33:00', 7, 1),
    ('En tout cas, je suis très impressionné par ton travail. Tu es un développeur très talentueux.', '2024-05-07 10:34:00', 1, 7),
    ('Merci beaucoup pour ton compliment ! J apprends toujours de nouvelles choses et je suis toujours à la recherche de moyens de m améliorer.', '2024-05-07 10:35:00', 7, 1),
    ('C est la bonne attitude à avoir ! C est comme ça qu on progresse et qu on réalise de grandes choses.', '2024-05-07 10:36:00', 3, 4),
    ('Tout à fait d accord ! Et puis, c est toujours plus motivant quand on est passionné par ce qu on fait.', '2024-05-07 10:37:00', 7, 1),
    ('Je suis d accord avec vous deux. La passion est le moteur du succès.', '2024-05-07 10:38:00', 1, 7),
    ('En effet ! Et il est important de s amuser en cours de route.', '2024-05-07 10:39:00', 7, 1),
    ('C est vrai ! Le développement peut parfois être ardu, mais il faut aussi savoir en profiter.', '2024-05-07 10:40:00', 1, 7);
