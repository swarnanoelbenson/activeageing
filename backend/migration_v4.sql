-- Run this in DBeaver against the ta15 database to update exercise names
USE ta15;

-- Replace Neck Rotations → Shoulder Rolls
UPDATE exercise_recommendations
SET exercise_name = 'Shoulder Rolls',
    instructions  = 'Sit upright on a chair with arms relaxed at your sides. Slowly roll both shoulders forward in a circular motion, then reverse and roll them backward.'
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
