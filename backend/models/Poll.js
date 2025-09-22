import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    timeLimit: { type: Number, default: 60 },
    correctAnswer: { type: String }, // store teacher’s correct answer
    answers: {
      type: Map,
      of: new mongoose.Schema({
        option: { type: String, required: true },
        isCorrect: { type: Boolean, required: true, default:true },
      }),
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
