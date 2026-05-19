// backend/utils/scoring.js — Wellness scoring algorithm.
//
// Two-score design:
//   activityScore  (Q1 + Q2, range 2–8)  → determines the primary category
//                                           (Just Getting Started / Building Momentum / Thriving)
//   modifierScore  (Q3 + Q4 + Q5, range 3–12) → adjusts exercise intensity
//                                           (standard / lighter / gentle_short)
//
// Keeping the scores separate means the DB can store exercises at the
// category × modifier intersection, giving 9 distinct recommendation sets
// without needing a separate scoring model.

// ── Activity score map ──
// Maps the exact answer label strings sent by the frontend to point values.
// Higher points = more active. Default fallback is 2 (middle of range) so
// an unrecognised answer doesn't crash the scoring.
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

// ── Modifier score map ──
// Higher points = more sedentary / worse sleep. A high modifier score
// pushes the user into lighter exercise recommendations even if their
// activity category is high (e.g. daily exerciser who barely sleeps).
const modifierScoreMap = {
  // Q3: inactivity_level (range 1–4)
  "Very little":      1,
  "Some of the day":  2,
  "A lot of the day": 3,
  "Most of the day":  4,

  // Q4: sleep_hours (range 1–4)
  "7 to 8 hours":           1,  // optimal
  "More than 8 hours":      2,  // oversleeping is slightly worse than optimal
  "6 to less than 7 hours": 3,
  "Less than 6 hours":      4,

  // Q5: restedness (range 1–4)
  "Very rested":    1,
  "Fairly rested":  2,
  "A little tired": 3,
  "Very tired":     4,
};

// Activity score = Q1 + Q2 (range 2–8)
// Default ?? 2 keeps score in the middle if an answer label changes on the frontend.
function getActivityScore(answers) {
  const [q1, q2] = answers;
  return (activityScoreMap[q1] ?? 2) + (activityScoreMap[q2] ?? 2);
}

// Modifier score = Q3 + Q4 + Q5 (range 3–12)
function getModifierScore(answers) {
  const [, , q3, q4, q5] = answers;
  return (modifierScoreMap[q3] ?? 2) + (modifierScoreMap[q4] ?? 2) + (modifierScoreMap[q5] ?? 2);
}

// Category thresholds chosen to give roughly equal population distribution
// across the three tiers based on the AU 65+ activity benchmark data.
// 2–3 = Just Getting Started, 4–6 = Building Momentum, 7–8 = Thriving
function getCategoryName(activityScore) {
  if (activityScore <= 3) return "Just Getting Started";
  if (activityScore <= 6) return "Building Momentum";
  return "Thriving";
}

// Modifier thresholds: high sedentary/poor sleep → gentler exercises.
// 3–5 = standard, 6–8 = lighter, 9–12 = gentle_short
function getModifierName(modifierScore) {
  if (modifierScore <= 5) return "standard";
  if (modifierScore <= 8) return "lighter";
  return "gentle_short";
}

// Expresses activity score as a percentage of the maximum (8) for the SVG
// circle chart on the Results page. Rounds to avoid floating-point display issues.
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
