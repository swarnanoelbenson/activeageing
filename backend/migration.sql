-- Run this in DBeaver against the ta15 database
USE ta15;

-- 1. New tables

CREATE TABLE IF NOT EXISTS category_thresholds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS modifier_thresholds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  modifier_name VARCHAR(50) NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS question_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_code VARCHAR(50) NOT NULL,
  option_label VARCHAR(100) NOT NULL,
  score INT NOT NULL,
  score_type VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS exercise_recommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL,
  modifier_name VARCHAR(50) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  instructions TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS user_checkins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(100),
  exercise_frequency VARCHAR(100) NOT NULL,
  session_duration VARCHAR(100) NOT NULL,
  inactivity_level VARCHAR(100) NOT NULL,
  sleep_hours VARCHAR(100) NOT NULL,
  restedness VARCHAR(100) NOT NULL,
  activity_score INT NOT NULL,
  modifier_score INT NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  modifier_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed category_thresholds

INSERT INTO category_thresholds (category_name, min_score, max_score, description) VALUES
('Just Getting Started', 2, 3, 'Low current physical activity level'),
('Building Momentum',    4, 6, 'Moderate activity level with room to build consistency'),
('Thriving',             7, 8, 'Strong and consistent physical activity level');

-- 3. Seed modifier_thresholds

INSERT INTO modifier_thresholds (modifier_name, min_score, max_score, description) VALUES
('standard',     3,  5, 'Suitable for normal recommendation intensity'),
('lighter',      6,  8, 'Needs lighter exercise recommendations'),
('gentle_short', 9, 12, 'Needs shorter and gentler exercise recommendations');

-- 4. Seed question_options

INSERT INTO question_options (question_code, option_label, score, score_type) VALUES
('exercise_frequency', 'Every day',           4, 'activity'),
('exercise_frequency', 'A few times a week',  3, 'activity'),
('exercise_frequency', 'Once a week',         2, 'activity'),
('exercise_frequency', 'Rarely or never',     1, 'activity'),
('session_duration',   'More than 60 minutes', 4, 'activity'),
('session_duration',   '30 to 60 minutes',     3, 'activity'),
('session_duration',   '15 to 30 minutes',     2, 'activity'),
('session_duration',   'Less than 15 minutes', 1, 'activity'),
('inactivity_level',   'Very little',      1, 'modifier'),
('inactivity_level',   'Some of the day',  2, 'modifier'),
('inactivity_level',   'A lot of the day', 3, 'modifier'),
('inactivity_level',   'Most of the day',  4, 'modifier'),
('sleep_hours',        '7 to 8 hours',           1, 'modifier'),
('sleep_hours',        'More than 8 hours',      2, 'modifier'),
('sleep_hours',        '6 to less than 7 hours', 3, 'modifier'),
('sleep_hours',        'Less than 6 hours',      4, 'modifier'),
('restedness',         'Very rested',    1, 'modifier'),
('restedness',         'Fairly rested',  2, 'modifier'),
('restedness',         'A little tired', 3, 'modifier'),
('restedness',         'Very tired',     4, 'modifier');

-- 5. Seed exercise_recommendations

INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Just Getting Started', 'gentle_short', 'Seated Marching',          5,  'Sit upright and gently lift one knee at a time.', 'Good for low-intensity movement'),
('Just Getting Started', 'lighter',      'Chair Arm Raises',          6,  'Raise both arms slowly above shoulder level and lower gently.', 'Low-impact upper body movement'),
('Just Getting Started', 'standard',     'Short Gentle Walk',         8,  'Walk at a slow, comfortable pace for 8 minutes on a flat surface.', 'Entry-level outdoor movement'),
('Building Momentum',    'gentle_short', 'Seated Leg Extensions',     6,  'Sit in a chair and slowly extend one leg at a time, hold for 3 seconds.', 'Low-impact lower body'),
('Building Momentum',    'lighter',      'Gentle Standing Stretch',   8,  'Perform light full-body stretches while standing with support if needed.', 'Moderate but manageable'),
('Building Momentum',    'standard',     'Light Walking Routine',     10, 'Walk at a comfortable pace for 10 minutes.', 'Build consistency'),
('Thriving',             'gentle_short', 'Chair-Assisted Balance',    8,  'Stand behind a chair and practice single-leg balance holds for 10 seconds each side.', 'Strength and balance focus'),
('Thriving',             'lighter',      'Low-Impact Cardio Walk',    12, 'Walk at a steady pace with short recovery breaks.', 'Active but controlled'),
('Thriving',             'standard',     'Full Body Mobility Flow',   15, 'Complete a sequence of standing mobility and flexibility movements.', 'Suitable for stronger users');
