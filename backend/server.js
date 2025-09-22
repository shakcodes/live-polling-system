import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Poll from "./models/Poll.js";
import pollRoutes from "./routes/pollRoutes.js";
import { setIO } from "./controllers/pollController.js";



dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173" })); // frontend URL
app.use(express.json());

// ✅ REST API routes
app.use("/api/polls", pollRoutes);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

setIO(io);

// 🔹 Socket.IO
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Teacher creates poll
  socket.on("createPoll", async (data) => {
    try {
      const poll = new Poll({
        question: data.question,
        options: data.options,
        timeLimit: data.timeLimit || 60,
        correctAnswer: data.correctAnswer, // ✅ store correct answer
        answers: {},
      });
      await poll.save();

      console.log("✅ Poll created:", poll._id);

      io.emit("newPoll", poll); // broadcast poll
    } catch (err) {
      console.error("❌ Error creating poll:", err);
    }
  });

  // Student submits answer
  socket.on("submitAnswer", async ({ student, option }) => {
    try {
      const poll = await Poll.findOne().sort({ createdAt: -1 }); // latest poll
      if (!poll) return;

      const isCorrect = poll.correctAnswer === option; // ✅ check answer
      poll.answers.set(student, { option, isCorrect });

      await poll.save();

      io.emit("pollResults", { pollId: poll._id, answers: poll.answers });
    } catch (err) {
      console.error("❌ Error submitting answer:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
// 🔹 MongoDB + Server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
