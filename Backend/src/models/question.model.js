const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    // exam info
    examSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      // ssc-gd | joait | bsf-hc-rm | himachal-police
    },

    stream: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      // ssc_gd | joa_it | bsf_hc_rm | hp_police
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    // question
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // options
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 2,
        message: "Minimum 2 options required",
      },
    },

    // correct answer
    correctIndex: {
      type: Number,
      required: true,
    },

    // explanation
    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    // categorization
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // year
    year: {
      type: Number,
      default: null,
    },

    // question type
    type: {
      type: String,
      enum: ["MCQ", "True/False"],
      default: "MCQ",
    },

    // language
    language: {
      type: String,
      enum: ["Hindi", "English"],
      default: "English",
    },

    // active status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// compound index
QuestionSchema.index({ examSlug: 1, subject: 1 });

module.exports = mongoose.model("Question", QuestionSchema);