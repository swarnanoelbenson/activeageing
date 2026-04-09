// Maps each survey answer label to a score (1–4)
const scoreMap = {
  // Q1: exercise_frequency
  "Every day":           4,
  "A few times a week":  3,
  "Once a week":         2,
  "Rarely or never":     1,

  // Q2: session_duration
  "Less than 15 minutes": 1,
  "15 to 30 minutes":     2,
  "30 to 60 minutes":     3,
  "More than 60 minutes": 4,

  // Q3: inactivity_level (more inactive = lower score)
  "Very little":      4,
  "Some of the day":  3,
  "A lot of the day": 2,
  "Most of the day":  1,

  // Q4: sleep_hours (7-8 hours is optimal)
  "Less than 6 hours":      1,
  "6 to less than 7 hours": 2,
  "7 to 8 hours":           4,
  "More than 8 hours":      3,

  // Q5: restedness
  "Very rested":    4,
  "Fairly rested":  3,
  "A little tired": 2,
  "Very tired":     1,
};

// Total score range: 5 (min) to 20 (max)
function getScore(answers) {
  return answers.reduce((total, answer) => {
    return total + (scoreMap[answer] ?? 2);
  }, 0);
}

function getCategoryId(score) {
  if (score <= 8)  return 1; // Gentle Start
  if (score <= 12) return 2; // Building Momentum
  if (score <= 16) return 3; // Active Mover
  return 4;                  // Peak Vitality
}

// Chart percent relative to max score of 20
function getChartPercent(score) {
  return Math.round((score / 20) * 100);
}

module.exports = { getScore, getCategoryId, getChartPercent };
