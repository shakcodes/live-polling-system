import express from "express";
import { getPolls, createPoll, submitAnswer } from "../controllers/pollController.js";

const router = express.Router();

// GET /api/polls
router.get("/", getPolls);

// POST /api/polls (optional, for REST testing)
router.post("/", createPoll);
router.post("/:id/answer", submitAnswer);

export default router;
