-- Support Ticket Management System
-- Database Schema Script (MySQL 8.0+)
-- Database: support_ticket_db

CREATE DATABASE IF NOT EXISTS `support_ticket_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `support_ticket_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `password` VARCHAR(128) NOT NULL,
    `last_login` DATETIME(6) NULL,
    `is_superuser` TINYINT(1) NOT NULL DEFAULT 0,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(254) NOT NULL UNIQUE,
    `role` VARCHAR(20) NOT NULL DEFAULT 'customer',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME(6) NOT NULL,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tickets Table
CREATE TABLE IF NOT EXISTS `tickets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'medium',
    `status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `assigned_to` BIGINT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_tickets_user_id` (`user_id`),
    INDEX `idx_tickets_assigned_to` (`assigned_to`),
    INDEX `idx_tickets_status` (`status`),
    INDEX `idx_tickets_priority` (`priority`),
    INDEX `idx_tickets_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Ticket Comments Table
CREATE TABLE IF NOT EXISTS `ticket_comments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `comment` LONGTEXT NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_comments_ticket_id` (`ticket_id`),
    INDEX `idx_comments_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Section 8 — Assessment Example Database Query Requirement:
-- "Write a query that returns all open tickets along with the customer's name
--  and email. The query should demonstrate use of a JOIN and filtering."
-- ============================================================================

SELECT 
    t.id AS ticket_id,
    t.subject,
    t.description,
    t.priority,
    t.status,
    t.created_at,
    u.id AS customer_id,
    u.name AS customer_name,
    u.email AS customer_email
FROM `tickets` AS t
INNER JOIN `users` AS u ON t.user_id = u.id
WHERE t.status = 'open'
ORDER BY t.created_at DESC;

