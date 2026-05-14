-- Run this in DBeaver against the ta15 database to update exercise names
USE ta15;

-- Replace Neck Rotations → Seated Forward Lean
UPDATE exercise_recommendations
SET exercise_name = 'Seated Forward Lean',
    instructions  = 'Sit upright on a chair with feet flat on the floor. Slowly lean your upper body forward, sliding your hands toward your knees, keeping your back straight, then return upright.'
WHERE exercise_name = 'Neck Rotations';

-- Replace Ankle Rotations → Seated Knee Extensions
UPDATE exercise_recommendations
SET exercise_name = 'Seated Knee Extensions',
    instructions  = 'Sit upright on a chair with feet flat on the floor. Slowly straighten one leg until parallel to the floor, hold briefly, then lower and switch legs.'
WHERE exercise_name = 'Ankle Rotations';

-- Replace Calf Raises → Arm Raises
UPDATE exercise_recommendations
SET exercise_name = 'Arm Raises',
    duration_minutes = 8,
    instructions  = 'Stand or sit upright with arms at your sides. Slowly raise both arms out to the sides until they reach shoulder height, then gently lower them back down.'
WHERE exercise_name = 'Calf Raises';
