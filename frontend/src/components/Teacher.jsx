import React, { useState, useEffect } from "react";
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { setResults, setHistory } from "../features/pollSlice";
import { BsStars } from "react-icons/bs";

export default function Teacher() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(""); // ✅ new state

  const results = useSelector((state) => state.poll.results);
  const history = useSelector((state) => state.poll.history);
  const dispatch = useDispatch();

  const createPoll = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) return;
    if (!correctAnswer.trim()) {
      alert("Please select the correct answer before creating poll.");
      return;
    }

    socket.emit("createPoll", {
      question,
      options,
      timeLimit: 60,
      correctAnswer, // ✅ send correct answer to backend
    });

    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");
  };

  useEffect(() => {
    socket.on("pollResults", (data) => {
      dispatch(setResults(data.answers));
    });
  }, [dispatch]);

  useEffect(() => {
    fetch("https://live-polling-system-2-4qph.onrender.com/api/polls")
      .then((res) => res.json())
      .then((data) => dispatch(setHistory(data)));
  }, [results, dispatch]);

  return (
    <div className="p-6 w-full space-y-6 max-w-2xl mx-auto">
        <span className="flex w-[21vh] items-center gap-2 px-4 py-1 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full font-medium">
                <BsStars /> <span>Intervue Poll</span>
              </span>
      <h2 className="text-[40px] w-[737px] h-[30px] pt-0">
        Let’s <span className="text-brandPurple font-bold">Get Started</span>
      </h2>
      <p className="text-gray-500 mt-[5px]">
        you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>

      {/* Question Input */}
      <div>
        <label className="font-medium block mb-2">Enter your question</label>
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brandPurple"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {/* Options with Correct Answer radio */}
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-3 mt-2">
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const newOpts = [...options];
              newOpts[idx] = e.target.value;
              setOptions(newOpts);
            }}
            className="flex-1 border rounded-lg p-2"
          />
          <label className="flex items-center gap-1 text-sm text-gray-600">
            <input
              type="radio"
              name="correctAnswer"
              value={opt}
              checked={correctAnswer === opt}
              onChange={() => setCorrectAnswer(opt)} // ✅ set correct answer
            />
            Correct
          </label>
        </div>
      ))}

      {/* Add Option Button */}
      <button
        onClick={() => setOptions([...options, ""])}
        className="mt-4 px-4 py-2 border border-brandPurple rounded-lg text-brandPurple hover:bg-purple-50 transition"
      >
        + Add More Option
      </button>

      {/* Ask Question Button */}
      <div className="flex justify-end">
        <button
          onClick={createPoll}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white font-medium hover:opacity-90 transition"
        >
          Ask Question
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
  <h3 className="text-[40px]">View <span className="font-semibold">Poll History</span></h3>
  <div className="space-y-6 mt-4">
    {history.map((poll) => {
      const total = poll.answers ? Object.keys(poll.answers).length : 0;

      // Count responses
      const counts = {};
      poll.options.forEach((opt) => (counts[opt] = 0));
      if (poll.answers) {
        Object.values(poll.answers).forEach((res) => {
          counts[res.option] = (counts[res.option] || 0) + 1;
        });
      }

      // Percentages
      const percentages = {};
      poll.options.forEach((opt) => {
        percentages[opt] =
          total > 0 ? ((counts[opt] / total) * 100).toFixed(1) : 0;
      });

      return (
        <div
          key={poll._id}
          className="w-full max-w-3xl rounded-2xl shadow-lg"
        >
          {/* Question */}
          <h3 className="text-lg font-semibold text-white bg-gradient-to-l from-[#6E6E6E] to-[#343434] p-4 rounded-t-2xl">
            {poll.question}
          </h3>

          {/* Options with progress bar */}
          <div className="space-y-2 mt-4 p-4">
            {poll.options.map((opt, idx) => {
              const isCorrect = poll.correctAnswer === opt;

              return (
                <div
                  key={idx}
                  className="relative flex justify-between items-center p-4 border rounded-md overflow-hidden"
                >
                  {/* Background progress bar */}
                  <div
                    className={`absolute top-0 left-0 h-full ${
                      isCorrect ? "bg-[#AF8FF1]" : "bg-[#AF8FF1]"
                    }`}
                    style={{ width: `${percentages[opt]}%` }}
                  ></div>

                  {/* Content above progress bar */}
                  <div className="relative z-10 flex items-center gap-3 text-gray-700">
    <span className="w-6 font-medium bg-white pl-2 rounded-4xl">{idx + 1}</span>
    <span>{opt}</span>
  </div>

                  <span
                    className={`font-medium relative z-10 ${
                      isCorrect ? "text-[#7ceb58]" : "text-gray-700"
                    }`}
                  >
                    {percentages[opt]}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Responses count */}
          <p className="text-sm text-gray-500 px-4 pb-4">
            ({total} responses)
          </p>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
}
