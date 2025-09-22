import React from "react";

export default function PollCard({ poll, answer, setAnswer }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
              answer === opt ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={answer === opt}
              onChange={() => setAnswer(opt)}
              className="form-radio h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
