CREATE DATABASE projet_fonctionnel;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE CHECK (LENGTH(username) > 0),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE schedules (
    id_schedule INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    day VARCHAR(255) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE VIEW schedules_view AS
SELECT
    s.id_schedule,
    s.day,
    s.start_time,
    s.end_time,
    u.id_user,
    u.username
FROM schedules s 
JOIN users u ON s.id_user = u.id_user;
