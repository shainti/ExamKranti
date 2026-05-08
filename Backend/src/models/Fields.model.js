const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    // custom route id
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // basic info
    name: {
      type: String,
      required: true,
    },

    shortName: {
      type: String,
      required: true,
    },

    stream: {
      type: String,
      required: true,
      lowercase: true,
    },

    // ui colors
    color: {
      type: String,
      default: "#2563eb",
    },

    colorLight: {
      type: String,
      default: "#eff6ff",
    },

    colorMid: {
      type: String,
      default: "#bfdbfe",
    },

    // icon
    icon: {
      type: String,
      default: "ti-shield",
    },

    // badge
    tag: {
      type: String,
      enum: ["Hot", "New", null],
      default: null,
    },

    // exam details
    conductedBy: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    negativeMarking: {
      type: String,
      default: "-0.5",
    },

    // selection process
    selectionProcess: [
      {
        type: String,
      },
    ],

    // subjects
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },

        questions: {
          type: Number,
          required: true,
        },

        marks: {
          type: Number,
          required: true,
        },

        color: {
          type: String,
          default: "#3b82f6",
        },

        topics: [
          {
            type: String,
          },
        ],
      },
    ],

    // test series
    testSeries: [
      {
        id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        questions: {
          type: Number,
          required: true,
        },

        minutes: {
          type: Number,
          required: true,
        },

        type: {
          type: String,
          enum: ["Free", "Premium"],
          default: "Free",
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Medium",
        },

        attempts: {
          type: Number,
          default: 0,
        },
      },
    ],

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

// only extra index
ExamSchema.index({ stream: 1 });

module.exports = mongoose.model("ExamField", ExamSchema);