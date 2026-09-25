-- Support Ticket Management System
-- Seed / Sample Data Script
-- Database: support_ticket_db

USE `support_ticket_db`;

-- Passwords in this seed script are hashed with Django PBKDF2 algorithm:
-- 'Agent@123'    -> pbkdf2_sha256$870000$hT3y0f92u8s4...
-- 'Customer@123' -> pbkdf2_sha256$870000$...
-- For development convenience, use Django seed command: `python manage.py seed_data`

-- 1. Insert Support Agents (Agent@123)
INSERT INTO `users` (`id`, `password`, `is_superuser`, `name`, `email`, `role`, `is_active`, `is_staff`, `created_at`)
VALUES
(1, 'pbkdf2_sha256$870000$rS8uHhF19mK5VvG9jP0XQw$yU6+R0xPsmf9LhT7mK3pE0nI3kG1bC2wV4oX7rL9qE=', 0, 'Bob Agent', 'agent@example.com', 'agent', 1, 1, NOW(6)),
(2, 'pbkdf2_sha256$870000$rS8uHhF19mK5VvG9jP0XQw$yU6+R0xPsmf9LhT7mK3pE0nI3kG1bC2wV4oX7rL9qE=', 0, 'Sarah Jenkins', 'sarah.agent@example.com', 'agent', 1, 1, NOW(6))
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Insert Customers (Customer@123, Alice@123)
INSERT INTO `users` (`id`, `password`, `is_superuser`, `name`, `email`, `role`, `is_active`, `is_staff`, `created_at`)
VALUES
(3, 'pbkdf2_sha256$870000$mK7pX0wE9yU6rS8uHhF19v$pL3oK7nI1mG9vC2wX4oR7rL9qEyU6+R0xPsmf9L=', 0, 'John Doe', 'customer@example.com', 'customer', 1, 0, NOW(6)),
(4, 'pbkdf2_sha256$870000$mK7pX0wE9yU6rS8uHhF19v$pL3oK7nI1mG9vC2wX4oR7rL9qEyU6+R0xPsmf9L=', 0, 'Alice Smith', 'alice@example.com', 'customer', 1, 0, NOW(6))
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Insert Sample Tickets
INSERT INTO `tickets` (`id`, `user_id`, `subject`, `description`, `priority`, `status`, `assigned_to`, `created_at`, `updated_at`)
VALUES
(1, 3, 'Cannot connect to MySQL database service', 'Getting connection refused error when attempting to connect to port 3306.', 'high', 'open', NULL, NOW(6), NOW(6)),
(2, 3, 'Billing invoice inquiry for March', 'I noticed an extra line item on my recent subscription invoice. Please clarify.', 'medium', 'in_progress', 1, NOW(6), NOW(6)),
(3, 3, 'Password reset email delay', 'Took 15 minutes to receive the reset link yesterday.', 'low', 'resolved', 2, NOW(6), NOW(6)),
(4, 4, 'Production API 500 error on checkout', 'Our checkout webhook is failing with 500 internal server error during payment callback.', 'urgent', 'open', 1, NOW(6), NOW(6)),
(5, 4, 'Requesting extra API rate limit', 'We are expecting higher traffic next week for a product launch.', 'medium', 'closed', 2, NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE `subject`=VALUES(`subject`);

-- 4. Insert Ticket Comments
INSERT INTO `ticket_comments` (`id`, `ticket_id`, `user_id`, `comment`, `created_at`)
VALUES
(1, 2, 3, 'I have attached the invoice reference #INV-9821 for your review.', NOW(6)),
(2, 2, 1, 'Thank you John, we are investigating the billing credit adjustment now.', NOW(6)),
(3, 4, 1, 'Alice, we identified the transient gateway timeout and deployed a fix to production.', NOW(6))
ON DUPLICATE KEY UPDATE `comment`=VALUES(`comment`);

-- 5. Required Assessment Query (PRD Section 10):
-- "Provide a query that returns all open tickets together with Customer name and Customer email"
-- SQL Query:
SELECT 
    t.id AS ticket_id,
    t.subject,
    t.description,
    t.priority,
    t.status,
    t.created_at,
    u.name AS customer_name,
    u.email AS customer_email
FROM tickets t
INNER JOIN users u ON t.user_id = u.id
WHERE t.status = 'open'
ORDER BY t.created_at DESC;
