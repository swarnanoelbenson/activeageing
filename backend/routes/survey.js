const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/survey
// Body: { answers: [answer1, answer2, answer3, answer4, answer5, answer6] }
router.post("/", async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 6) {
    return res.status(400).json({ error: "Expected 6 answers" });
  }

  try {
    await pool.query(
      `INSERT INTO survey_responses
        (exercise_frequency, mobility, session_duration, health_conditions, energy_level, social_frequency)
       VALUES (?, ?, ?, ?, ?, ?)`,
      answers
    );
    res.json({ message: "Survey saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
