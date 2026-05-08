const Question = require("../models/question.model");

// ───────────────── GET QUESTIONS ─────────────────

// GET /questions?examSlug=ssc-gd&subject=Physics&limit=20
exports.getQuestions = async (req, res) => {
  try {
    const {
      examSlug,
      stream,
      subject,
      difficulty,
      limit = 20,
    } = req.query;

    // filter
    const filter = {
      isActive: true,
    };

    if (examSlug) filter.examSlug = examSlug;
    if (stream) filter.stream = stream;
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    // fetch questions
    const pool = await Question.find(filter)
      .select("-__v -createdAt -updatedAt")
      .lean();

    // no questions
    if (pool.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    // shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // limit
    const questions = pool.slice(0, Number(limit));

    res.status(200).json({
      success: true,
      total: questions.length,
      data: questions,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ───────────────── GET SINGLE QUESTION ─────────────────

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.questionId
    ).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ───────────────── CREATE QUESTION ─────────────────

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ───────────────── BULK CREATE QUESTIONS ─────────────────

exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "questions array is required",
      });
    }

    const inserted = await Question.insertMany(questions, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      inserted: inserted.length,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ───────────────── UPDATE QUESTION ─────────────────

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ───────────────── DELETE QUESTION ─────────────────

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      id: question._id,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};