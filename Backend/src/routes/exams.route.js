const express = require("express");
const router = express.Router();

const {
  getExams,
  getExamById,
  createExam,
  updateExam,

} = require("../controllers/Exam.controller");

const {
     getQuestions,
  getQuestionById,
  createQuestion,
  bulkCreateQuestions,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/Question.controller')
// ───────────── EXAM ROUTES ─────────────

// GET /exams

// POST /exams
router.post("/", createExam);

// PUT /exams/ssc-gd
router.put("/:examId", updateExam);

// ─────────── QUESTION ROUTES ───────────

// GET /exams/questions
router.get("/questions/all", getQuestions);

// GET /exams/questions/123
router.get("/questions/:questionId", getQuestionById);

// POST /exams/questions
router.post("/questions", createQuestion);

// POST /exams/questions/bulk
router.post("/questions/bulk", bulkCreateQuestions);

// PUT /exams/questions/123
router.put("/questions/:questionId", updateQuestion);

// DELETE /exams/questions/123
router.delete("/questions/:questionId", deleteQuestion);

router.get("/", getExams);

// GET /exams/ssc-gd
router.get("/:examId", getExamById);
module.exports = router;