-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 16 2025 г., 13:10
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `store`
--

-- --------------------------------------------------------

--
-- Структура таблицы `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`) VALUES
(1, 'Бухгалтерия'),
(2, 'Продажный зал'),
(3, 'Склад'),
(4, 'Склад'),
(5, 'Склад'),
(6, 'Продажный зал'),
(7, 'Продажный зал'),
(8, 'Продажный зал'),
(9, 'Бухгалтерия'),
(10, 'Бухгалтерия');

-- --------------------------------------------------------

--
-- Структура таблицы `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hire_date` date NOT NULL,
  `job_title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `qualification` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `employees`
--

INSERT INTO `employees` (`employee_id`, `first_name`, `last_name`, `email`, `phone_number`, `hire_date`, `job_title`, `qualification`, `salary`, `department_id`) VALUES
(1, 'Иван', 'Валюткин', 'hsqnkavh51@mail.com', '+7 (937) 902-64-35', '2022-11-24', 'Продавец', 'Высшая', 25000.00, 1),
(2, 'Елена', 'Иванова', 'vqlcdyqk45@mail.com', '+7 (929) 297-85-58', '2023-01-15', 'Продавец', 'Средняя', 12000.00, 2),
(3, 'Алексей', 'Смирнов', 'alexey.smirnov@email.com', '+7 (964) 137-99-11', '2023-02-05', 'Работник склада', 'Средняя', 18000.00, 3),
(4, 'Мария', 'Кузнецова', 'becker-kiley31@gmail.com', '+7 (923) 701-39-61', '2023-01-02', 'Работник склада', 'Высшая', 18000.00, 4),
(5, 'Сергей', 'Морозов', 'dewinna67@gmail.com', '+7 (912) 103-53-37', '2023-01-13', 'Работник склада', 'Средняя', 15000.00, 5),
(6, 'Анна', 'Лебедева', 'lillysalazar5@yandex.ru', '+7 (918) 171-13-11', '2023-04-18', 'Продавец', 'Высшая', 20000.00, 6),
(7, 'Павел', 'Соколов', 'edbaon155@mail.com', '+7 (954) 847-10-19', '2023-03-07', 'Кассир', 'Средняя', 28000.00, 7),
(8, 'Наталья', 'Попова', 'natalyaVa@yandex.ru', '+7 (988) 392-24-51', '2023-04-03', 'Заведующий склада', 'Средняя', 28000.00, 8),
(9, 'Денис', 'Козлов', 'dcuddsmu@mail.com', '+7 (988) 392-24-51', '2023-02-11', 'Бухгалтер', 'Высшая', 35000.00, 9),
(10, 'Ольга', 'Никитина', 'gsnONajz@gmail.com', '+7 (971) 621-87-18', '2023-02-18', 'Бухгалтер', 'Средняя', 35000.00, 10);

-- --------------------------------------------------------

--
-- Структура таблицы `mails`
--

CREATE TABLE `mails` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `mail_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `report_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `report_data` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reports`
--

INSERT INTO `reports` (`report_id`, `report_date`, `report_description`, `report_data`, `employee_id`) VALUES
(1, '2023-06-09', 'Ежедневный отчет', 'Текст отчета 1', 1),
(2, '2023-05-12', 'Ежедневный отчет', 'Текст отчета 2', 2),
(3, '2023-05-16', 'Ежедневный отчет', 'Текст отчета 3', 3),
(4, '2023-03-02', 'Ежедневный отчет', 'Текст отчета 4', 4),
(5, '2023-07-08', 'Ежедневный отчет', 'Текст отчета 5', 5),
(6, '2023-08-15', 'Ежедневный отчет', 'Текст отчета 6', 6),
(7, '2023-09-14', 'Ежедневный отчет', 'Текст отчета 7', 7),
(8, '2023-06-13', 'Ежедневный отчет', 'Текст отчета 8', 8),
(9, '2023-02-14', 'Ежедневный отчет', 'Текст отчета 9', 9),
(10, '2023-01-09', 'Ежедневный отчет', 'Текст отчета 10', 10);

-- --------------------------------------------------------

--
-- Структура таблицы `vacations`
--

CREATE TABLE `vacations` (
  `vacation_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `vacation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `vacations`
--

INSERT INTO `vacations` (`vacation_id`, `start_date`, `end_date`, `vacation_type`, `employee_id`) VALUES
(1, '2023-06-03', '2023-06-10', 'Оплачиваемый', 1),
(2, '2023-06-15', '2023-06-22', 'Оплачиваемый', 2),
(3, '2023-04-17', '2023-04-24', 'Оплачиваемый', 3),
(4, '2023-08-03', '2023-08-10', 'Оплачиваемый', 4),
(5, '2023-08-28', '2023-09-04', 'Оплачиваемый', 5),
(6, '2023-07-15', '2023-07-22', 'Оплачиваемый', 6),
(7, '2023-08-02', '2023-08-09', 'Оплачиваемый', 7),
(8, '2023-08-13', '2023-08-20', 'Оплачиваемый', 8),
(9, '2023-04-22', '2023-04-29', 'Оплачиваемый', 9),
(10, '2023-05-25', '2023-06-01', 'Оплачиваемый', 10);

-- --------------------------------------------------------

--
-- Структура таблицы `workschedules`
--

CREATE TABLE `workschedules` (
  `schedule_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `working_hours` int(11) NOT NULL,
  `shift_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `workschedules`
--

INSERT INTO `workschedules` (`schedule_id`, `start_date`, `end_date`, `working_hours`, `shift_type`, `employee_id`) VALUES
(1, '2023-01-15', '2023-11-01', 135, 'Дневная смена', 1),
(2, '2023-02-20', '2023-11-01', 135, 'Дневная смена', 2),
(3, '2023-03-10', '2023-11-01', 135, 'Ночная смена', 3),
(4, '2023-04-05', '2023-11-01', 135, 'Смешанная смена', 4),
(5, '2023-05-15', '2023-11-01', 135, 'Дневная смена', 5),
(6, '2023-06-20', '2023-11-01', 135, 'Дневная смена', 6),
(7, '2023-07-10', '2023-11-01', 135, 'Ночная смена', 7),
(8, '2023-08-05', '2023-11-01', 135, 'Смешанная смена', 8),
(9, '2023-09-15', '2023-11-01', 135, 'Дневная смена', 9),
(10, '2023-10-20', '2023-11-01', 135, 'Дневная смена', 10);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Индексы таблицы `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `Employees_krkr_1` (`department_id`);

--
-- Индексы таблицы `mails`
--
ALTER TABLE `mails`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `Reports_krkr_1` (`employee_id`);

--
-- Индексы таблицы `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacation_id`);

--
-- Индексы таблицы `workschedules`
--
ALTER TABLE `workschedules`
  ADD PRIMARY KEY (`schedule_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `mails`
--
ALTER TABLE `mails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT для таблицы `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `workschedules`
--
ALTER TABLE `workschedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `Reports_krkr_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
