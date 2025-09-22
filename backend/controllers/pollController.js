import Poll from "../models/Poll.js";

// 🔹 For Socket.IO instance
let ioInstance;
export const setIO = (io) => {
  ioInstance = io;
};

// ✅ Get all polls
export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error("❌ Error fetching polls:", err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};

// ✅ Create a new poll (teacher)
export const createPoll = async (req, res) => {
  try {
    const { question, options, timeLimit, correctAnswer } = req.body;

    if (!question || !options || options.length < 2) {
      return res
        .status(400)
        .json({ error: "Question and at least 2 options are required" });
    }

    if (correctAnswer && !options.includes(correctAnswer)) {
      return res
        .status(400)
        .json({ error: "Correct answer must be included in options" });
    }

    const poll = new Poll({
      question,
      options,
      correctAnswer,
      timeLimit: timeLimit || 60,
      answers: {},
    });

    await poll.save();

    // 🔹 If sockets are active, broadcast
    if (ioInstance) {
      ioInstance.emit("newPoll", poll);
      console.log("📢 Poll broadcasted:", poll._id);
    }

    res.status(201).json(poll);
  } catch (err) {
    console.error("❌ Error creating poll:", err);
    res.status(500).json({ error: "Failed to create poll" });
  }
};

// ✅ Submit an answer (student)
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { student, option } = req.body;

    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Check if answer is correct
    const isCorrect = poll.correctAnswer === option;

    poll.answers.set(student, {
      option,
      isCorrect,
    });

    await poll.save();

    // 🔹 Emit updated results if sockets are running
    if (ioInstance) {
      ioInstance.emit("pollResults", { pollId: poll._id, answers: poll.answers });
    }

    res.json({
      message: "Answer submitted",
      answers: poll.answers,
    });
  } catch (err) {
    console.error("❌ Error submitting answer:", err);
    res.status(500).json({ error: "Failed to submit answer" });
  }
};
