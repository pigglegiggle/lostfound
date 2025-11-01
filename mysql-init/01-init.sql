-- MySQL initialization script for Lost & Found system
-- This script will be run automatically when the MySQL container starts

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS lost_found_system;

-- Use the database
USE lost_found_system;

-- Set the default authentication plugin for MySQL 8.0 compatibility
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '1234';

-- Create a dedicated application user
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT ALL PRIVILEGES ON lost_found_system.* TO 'app_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Set timezone
SET GLOBAL time_zone = '+07:00';

-- Log that initialization is complete
SELECT 'MySQL initialization completed successfully!' AS status;
