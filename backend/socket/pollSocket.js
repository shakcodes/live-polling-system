import Poll from "../models/Poll.js";

const pollSocket = (io, socket) => {
  // Student submits answer
  socket.on("submitAnswer", async ({ pollId, student, option }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) return;

      const isCorrect = poll.correctAnswer
        ? poll.correctAnswer === option
        : null; // if no correctAnswer set, skip check

      poll.answers.set(student, { option, isCorrect });
      await poll.save();

      io.emit("pollResults", {
        pollId,
        answers: Object.fromEntries(poll.answers),
      });

      console.log(
        `📨 Answer saved: ${student} → ${option} ${
          isCorrect ? "✅ Correct" : "❌ Wrong"
        }`
      );
    } catch (err) {
      console.error("❌ Error saving answer:", err);
    }
  });
};

export default pollSocket;
