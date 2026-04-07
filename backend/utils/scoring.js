// Maps each survey answer label to a score (1–4)
const scoreMap = {
  // Q1: Exercise frequency
  "Every day": 4,
  "A few times a week": 3,
  "Once a week": 2,
  "Rarely or never": 1,

  // Q2: Mobility
  "I move freely without assistance": 4,
  "I have some limitations but manage well": 3,
  "I need support or aids to move around": 2,

  // Q3: Session duration
  "Less than 15 minutes": 1,
  "15 to 30 minutes": 2,
  "30 to 60 minutes": 3,
  "More than 60 minutes": 4,

  // Q4: Health conditions
  "None": 4,
  "Joint Pain or stiffness": 3,
  "Breathlessness during light activity": 2,
  "Balance issues": 2,

  // Q5: Energy levels
  "I feel energetic and active": 4,
  "I have moderate energy but tire easily": 3,
  "I feel tired most of the time": 2,

  // Q6: Social frequency
  "Daily": 4,
  "Once a week or less": 2,

  // Neutral fallback for N/A answers
  "N/A": 3,
};

// Total score range: 6 (min) to 24 (max)
// Categories split into 4 equal-ish bands
function getScore(answers) {
  return answers.reduce((total, answer) => {
    return total + (scoreMap[answer] ?? 2); // default 2 if unknown
  }, 0);
}

function getCategoryId(score) {
  if (score <= 10) return 1; // Gentle Start
  if (score <= 15) return 2; // Building Momentum
  if (score <= 20) return 3; // Active Mover
  return 4;                  // Peak Vitality
}

// Chart percent shown on Results page (relative to max score of 24)
function getChartPercent(score) {
  return Math.round((score / 24) * 100);
}

module.exports = { getScore, getCategoryId, getChartPercent };
