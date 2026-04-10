// Individual score maps per question
const activityScoreMap = {
  // Q1: exercise_frequency (range 1–4)
  "Every day":           4,
  "A few times a week":  3,
  "Once a week":         2,
  "Rarely or never":     1,

  // Q2: session_duration (range 1–4)
  "Less than 15 minutes": 1,
  "15 to 30 minutes":     2,
  "30 to 60 minutes":     3,
  "More than 60 minutes": 4,
};

const modifierScoreMap = {
  // Q3: inactivity_level (range 1–4)
  "Very little":      1,
  "Some of the day":  2,
  "A lot of the day": 3,
  "Most of the day":  4,

  // Q4: sleep_hours (range 1–4)
  "7 to 8 hours":           1,
  "More than 8 hours":      2,
  "6 to less than 7 hours": 3,
  "Less than 6 hours":      4,

  // Q5: restedness (range 1–4)
  "Very rested":    1,
  "Fairly rested":  2,
  "A little tired": 3,
  "Very tired":     4,
};

// Activity score = Q1 + Q2 (range 2–8)
function getActivityScore(answers) {
  const [q1, q2] = answers;
  return (activityScoreMap[q1] ?? 2) + (activityScoreMap[q2] ?? 2);
}

// Modifier score = Q3 + Q4 + Q5 (range 3–12)
function getModifierScore(answers) {
  const [, , q3, q4, q5] = answers;
  return (modifierScoreMap[q3] ?? 2) + (modifierScoreMap[q4] ?? 2) + (modifierScoreMap[q5] ?? 2);
}

// Category from activity score
// 2–3 = Just Getting Started, 4–6 = Building Momentum, 7–8 = Thriving
function getCategoryName(activityScore) {
  if (activityScore <= 3) return "Just Getting Started";
  if (activityScore <= 6) return "Building Momentum";
  return "Thriving";
}

// Modifier from modifier score
// 3–5 = standard, 6–8 = lighter, 9–12 = gentle_short
function getModifierName(modifierScore) {
  if (modifierScore <= 5) return "standard";
  if (modifierScore <= 8) return "lighter";
  return "gentle_short";
}

// Chart percent: activity score relative to max of 8
function getChartPercent(activityScore) {
  return Math.round((activityScore / 8) * 100);
}

module.exports = {
  getActivityScore,
  getModifierScore,
  getCategoryName,
  getModifierName,
  getChartPercent,
};
