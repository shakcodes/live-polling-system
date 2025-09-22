import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import { setPoll, setResults, clearPoll } from "../features/pollSlice";
import { GiAlarmClock } from "react-icons/gi";

export default function Student() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const poll = useSelector((state) => state.poll.currentPoll);
  const results = useSelector((state) => state.poll.results);
  const dispatch = useDispatch();

  // Fetch latest poll
  useEffect(() => {
    fetch("http://localhost:5000/api/polls")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const latest = data[0];
          dispatch(setPoll(latest));
          setTimeLeft(latest.timeLimit || 60);
        }
      })
      .catch((err) => console.error("❌ Error fetching polls:", err));
  }, [dispatch]);

  // Socket listeners
  useEffect(() => {
    socket.on("newPoll", (pollData) => {
      dispatch(setPoll(pollData));
      dispatch(setResults({}));
      setAnswer("");
      setTimeLeft(pollData.timeLimit || 60);
    });

    socket.on("pollResults", (data) => {
      dispatch(setResults(data.answers));
    });

    socket.on("pollEnded", (data) => {
      dispatch(setResults(data.answers));
      dispatch(clearPoll());
      setTimeLeft(0);
    });

    return () => {
      socket.off("newPoll");
      socket.off("pollResults");
      socket.off("pollEnded");
    };
  }, [dispatch]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const join = () => {
    if (!name.trim()) return;
    socket.emit("joinStudent", name);
    setJoined(true);
  };

  // ✅ Auto submit on click
  const handleAnswer = (opt) => {
    if (answer) return; // prevent multiple answers
    setAnswer(opt);
    socket.emit("submitAnswer", { student: name, option: opt });
  };

  // ✅ Calculate percentages
  const calculatePercentages = () => {
    if (!results || !poll) return {};
    const total = Object.keys(results).length;
    const counts = {};

    poll.options.forEach((opt) => (counts[opt] = 0));
    Object.values(results).forEach((res) => {
      counts[res.option] = (counts[res.option] || 0) + 1;
    });

    const percentages = {};
    poll.options.forEach((opt) => {
      percentages[opt] = total > 0 ? ((counts[opt] / total) * 100).toFixed(1) : 0;
    });

    return percentages;
  };

  const percentages = calculatePercentages();

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Join as Student</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mt-4"
        />
        <button
          onClick={join}
          className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col justify-center items-center h-screen w-full">
        {/* Timer */}
      <div className="flex items-center gap-2 text-gray-500 text-left w-[85%] pr-4 mt-2">
  <GiAlarmClock className="text-2xl font-extrabold text-black" />
  <span className="font-medium text-xl text-red-700">00:{timeLeft}</span>
</div>

  {poll ? (
    <div className="w-full max-w-3xl rounded-2xl shadow-lg">
      {/* Question */}
      <h3 className="text-xl font-semibold text-white bg-gradient-to-l from-[#6E6E6E] to-[#343434] p-4 rounded-t-2xl">
        {poll.question}
      </h3>

      {/* Options */}
      <div className="space-y-2 mt-4 p-4">
        {poll.options.map((opt, idx) => {
          const isCorrect = poll.correctAnswer === opt;
          const isSelected = answer === opt;

          return (
           <div
  key={idx}
  onClick={() => handleAnswer(opt)}
  className={`relative flex justify-between items-center p-4 border rounded-md cursor-pointer transition overflow-hidden
    ${
      answer
        ? isSelected
          ? isCorrect
            ? "border-gray-400"
            : "border-gray-400"
          : "border-gray-300"
        : "border-gray-300 hover:bg-gray-50"
    }`}
>
  {/* Background fill bar */}
  {answer && results && (
    <div
      className={`absolute left-0 top-0 h-full transition-all duration-500 ${
        isCorrect ? "bg-[#AF8FF1]" : "bg-[#AF8FF1]"
      }`}
      style={{ width: `${percentages[opt]}%` }}
    ></div>
  )}

  {/* Content stays above the fill */}
  <div className="relative z-10 flex items-center gap-3 text-gray-700">
    <span className="w-6 font-medium bg-white pl-2 rounded-4xl">{idx + 1}</span>
    <span>{opt}</span>
  </div>

  {/* Percentage text */}
  {answer && results && (
    <span
      className={`relative z-10 font-medium ${
        isCorrect ? "text-[#7ceb58]" : "text-gray-700"
      }`}
    >
      {percentages[opt]}%
    </span>
  )}
</div>

          );
        })}
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-500 italic">No active poll</div>
  )}
</div>

  );
}
