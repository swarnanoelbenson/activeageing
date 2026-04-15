-- Run this after migration.sql
USE ta15;

-- 1. Add gif_url column to exercise_recommendations
ALTER TABLE exercise_recommendations ADD COLUMN gif_url VARCHAR(255) NULL;

-- 2. Add more exercises to reach 3 per category+modifier combo
--    (each combo currently has 1 from migration.sql — adding 2 more each)

-- Just Getting Started + gentle_short
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Just Getting Started', 'gentle_short', 'Ankle Circles', 4, 'Sit in a chair and slowly rotate each ankle clockwise 5 times, then counter-clockwise 5 times.', 'Improves circulation and joint mobility'),
('Just Getting Started', 'gentle_short', 'Hand Squeezes', 4, 'Hold a soft ball or rolled towel and gently squeeze for 5 seconds, then release. Repeat 10 times each hand.', 'Great for hand strength and grip');

-- Just Getting Started + lighter
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Just Getting Started', 'lighter', 'Seated Neck Rolls', 5, 'Sit tall and slowly drop your right ear to your shoulder, hold 5 seconds, then roll to the left. Repeat 5 times.', 'Relieves neck tension gently'),
('Just Getting Started', 'lighter', 'Toe Taps', 5, 'While seated, alternate tapping each foot on the floor at a comfortable pace for 1 minute. Rest and repeat twice.', 'Low-impact leg activation');

-- Just Getting Started + standard
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Just Getting Started', 'standard', 'Wall Push-Ups', 7, 'Stand arm-length from a wall, place palms flat on it, and slowly bend elbows to bring your chest toward the wall. Push back. Repeat 10 times.', 'Beginner upper body strength'),
('Just Getting Started', 'standard', 'Standing Calf Raises', 6, 'Stand behind a chair holding the back for balance. Slowly rise onto your toes, hold 2 seconds, then lower. Repeat 12 times.', 'Strengthens lower legs and improves balance');

-- Building Momentum + gentle_short
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Building Momentum', 'gentle_short', 'Chair-Assisted Squats', 7, 'Stand in front of a sturdy chair. Slowly lower yourself as if sitting down, stop just above the seat, then stand back up. Repeat 8 times.', 'Builds leg strength safely'),
('Building Momentum', 'gentle_short', 'Side Bends', 5, 'Stand or sit tall. Reach one arm overhead and gently bend to the opposite side. Hold 5 seconds each side. Repeat 6 times.', 'Stretches side muscles gently');

-- Building Momentum + lighter
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Building Momentum', 'lighter', 'Marching in Place', 8, 'Stand with feet hip-width apart and march slowly in place, lifting knees to comfortable height. Continue for 2 minutes with a 1-minute rest.', 'Moderate cardio movement'),
('Building Momentum', 'lighter', 'Arm Circles', 6, 'Extend arms to sides and make small circles forward for 20 seconds, then backward. Gradually increase circle size over 3 sets.', 'Shoulder mobility and light toning');

-- Building Momentum + standard
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Building Momentum', 'standard', 'Step Touch Exercises', 9, 'Step one foot to the side, bring the other to meet it, then step the other way. Continue at a steady pace for 3 sets of 1 minute.', 'Improves coordination and heart rate'),
('Building Momentum', 'standard', 'Standing Hip Circles', 8, 'Stand with feet shoulder-width apart, hands on hips. Slowly rotate hips in a wide circle, 5 times each direction.', 'Hip mobility and core engagement');

-- Thriving + gentle_short
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Thriving', 'gentle_short', 'Single Leg Stance', 7, 'Stand behind a chair holding the back. Lift one foot slightly off the floor and hold for 10 seconds. Switch sides. Repeat 5 times each.', 'Improves balance and proprioception'),
('Thriving', 'gentle_short', 'Heel-to-Toe Walk', 6, 'Walk in a straight line placing the heel of one foot directly in front of the toes of the other. Take 20 steps, turn, and return.', 'Coordination and balance training');

-- Thriving + lighter
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Thriving', 'lighter', 'Side Steps', 10, 'Step to the right 4 steps, then left 4 steps, keeping a slight bend in the knees. Do 3 sets with 30-second rest between sets.', 'Lateral movement and hip strength'),
('Thriving', 'lighter', 'Knee Lifts', 10, 'Stand tall and alternate lifting each knee to hip height, holding for 2 seconds. Complete 3 sets of 10 reps each leg.', 'Core stability and leg strength');

-- Thriving + standard
INSERT INTO exercise_recommendations (category_name, modifier_name, exercise_name, duration_minutes, instructions, notes) VALUES
('Thriving', 'standard', 'Dynamic Stretching Routine', 12, 'Perform leg swings, arm swings, torso rotations, and hip circles in sequence — 10 reps each movement. Rest and repeat twice.', 'Full-body mobility preparation'),
('Thriving', 'standard', 'Balance Walk', 12, 'Walk slowly across the room placing each step with full attention to balance. Add arm raises while walking for extra challenge.', 'Advanced balance and coordination');
