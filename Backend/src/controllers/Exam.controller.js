const Exam = require("../models/Fields.model");

// ───────────────── EXAMS ─────────────────

// GET /exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select("-testSeries -subjects")
      .lean();

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /exams/:examId
exports.getExamById = async (req, res) => {
  try {
    const { examId } = req.params;

    // Find exam using custom id
    const exam = await Exam.findOne({
      id: examId,
      isActive: true,
    }).lean();

    // If exam not found
    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // Send exact exam object response
    res.status(200).json(exam);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// POST /exams
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /exams/:examId
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.examId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
