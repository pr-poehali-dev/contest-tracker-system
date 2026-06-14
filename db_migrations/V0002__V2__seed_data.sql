INSERT INTO t_p85443557_contest_tracker_syst.users (name, role, grade, school, email) VALUES
('Алина Смирнова', 'student', '11А', 'МБОУ Лицей №47', 'smirnova@school.ru'),
('Максим Воронов', 'student', '10Б', 'МБОУ Лицей №47', 'voronov@school.ru'),
('Диана Козлова', 'student', '11В', 'МБОУ Лицей №47', 'kozlova@school.ru'),
('Артём Петров', 'student', '9А', 'МБОУ Лицей №47', 'petrov@school.ru'),
('Кира Новикова', 'student', '10А', 'МБОУ Лицей №47', 'novikova@school.ru'),
('Иван Соколов', 'student', '11Б', 'МБОУ Лицей №47', 'sokolov@school.ru'),
('Полина Зайцева', 'student', '9В', 'МБОУ Лицей №47', 'zaitseva@school.ru'),
('Елена Морозова', 'teacher', NULL, 'МБОУ Лицей №47', 'morozova@school.ru'),
('Андрей Волков', 'admin', NULL, 'МБОУ Лицей №47', 'volkov@school.ru');

INSERT INTO t_p85443557_contest_tracker_syst.contests (title, level, deadline, status, subject) VALUES
('Всероссийская олимпиада по математике', 'Всероссийский', '2026-06-20', 'open', 'Математика'),
('Конкурс научных проектов Шаг в науку', 'Муниципальный', '2026-07-15', 'open', 'Наука'),
('Фестиваль творчества Звёздный час', 'Школьный', '2026-06-05', 'registration', 'Творчество'),
('Чемпионат по программированию', 'Региональный', '2026-06-28', 'open', 'Информатика'),
('Конкурс сочинений Моя Россия', 'Всероссийский', '2026-07-10', 'registration', 'Литература');

INSERT INTO t_p85443557_contest_tracker_syst.applications (contest_id, user_id, submitted_by, class_group, status) VALUES
(1, 1, 8, '11А', 'approved'),
(1, 2, 8, '10Б', 'pending'),
(2, 1, 8, '11А', 'approved'),
(3, 3, 8, '11В', 'approved'),
(4, 2, 8, '10Б', 'pending'),
(4, 4, 8, '9А', 'approved');

INSERT INTO t_p85443557_contest_tracker_syst.achievements (user_id, title, level, date_received, verified) VALUES
(1, 'Золото — Олимпиада по физике 2025', 'gold', '2025-03-12', TRUE),
(1, 'Серебро — Конкурс проектов Горизонт', 'silver', '2024-10-05', TRUE),
(1, 'Участие — Всероссийский диктант', 'participation', '2024-04-16', FALSE),
(2, 'Бронза — Олимпиада по информатике 2025', 'bronze', '2025-02-20', TRUE),
(3, 'Золото — Фестиваль искусств 2024', 'gold', '2024-11-01', TRUE),
(6, 'Золото — Олимпиада по истории 2025', 'gold', '2025-04-10', TRUE),
(5, 'Серебро — Конкурс иностранных языков', 'silver', '2025-01-22', TRUE),
(4, 'Бронза — Олимпиада по биологии', 'bronze', '2024-12-05', TRUE),
(7, 'Участие — Региональная конференция', 'participation', '2025-05-14', TRUE);

INSERT INTO t_p85443557_contest_tracker_syst.notifications (user_id, title, type, read) VALUES
(1, 'Старт регистрации: Олимпиада по химии', 'info', FALSE),
(1, 'Ваша заявка подтверждена: Фестиваль Звёздный час', 'success', FALSE),
(1, 'Новый документ добавлен: Грамота 9А класса', 'doc', TRUE),
(1, 'Дедлайн через 3 дня: Конкурс сочинений', 'warning', TRUE);