-- ============================================================
-- Teacher Portal Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS teacher_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teacher_portal;

-- Auth Users Table
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    university_name VARCHAR(255) NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    year_joined YEAR NOT NULL,
    department VARCHAR(150),
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Sample data (optional)
INSERT INTO auth_user (email, first_name, last_name, password, is_active)
VALUES
('alice@university.edu', 'Alice', 'Johnson', '$2y$10$exampleHashedPassword1234567890', 1),
('bob@university.edu', 'Bob', 'Smith', '$2y$10$exampleHashedPassword1234567890', 1);

INSERT INTO teachers (user_id, university_name, gender, year_joined, department, phone)
VALUES
(1, 'MIT', 'female', 2018, 'Computer Science', '+1-555-0101'),
(2, 'Stanford University', 'male', 2020, 'Mathematics', '+1-555-0202');
