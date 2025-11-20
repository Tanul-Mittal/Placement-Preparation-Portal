import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../../data/questions.json";

export default function AptitudeTestPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedCompany = state?.company || "All Companies";
  const selectedTopic = state?.topic || "All Topics";

  // filter aptitude + company + topic
  const filtered = useMemo(
    () =>
      data.questions.filter((q) => {
        if (q.category !== "Aptitude") return false;

        const byCompany =
          selectedCompany === "All Companies" ||
          q.company.includes(selectedCompany);

        const byTopic =
          selectedTopic === "All Topics" || q.subcategory === selectedTopic;

        return byCompany && byTopic;
      }),
    [selectedCompany, selectedTopic]
  );

  // 10 random questions
  const [questions] = useState(() =>
    [...filtered].sort(() => Math.random() - 0.5).slice(0, 10)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [result, setResult] = useState(null);

  const totalQuestions = questions.length;
  const [timeLeft, setTimeLeft] = useState(600);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const attempted = Object.keys(answers).length;
    const wrong = attempted - correct;
    setResult({ correct, attempted, wrong, total: totalQuestions });
  };

  useEffect(() => {
    if (result || totalQuestions === 0) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, result, totalQuestions]);

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
      t % 60
    ).padStart(2, "0")}`;

  // no questions case
  if (totalQuestions === 0 && !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-slate-700">
          No aptitude questions found for this company/topic.
        </p>
        <button
          onClick={() => navigate("/aptitude")}
          className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold"
        >
          Back to Aptitude
        </button>
      </div>
    );
  }

  // result view
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border p-8 w-full max-w-lg text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">Test Summary</h2>
          <p>Total Questions: {result.total}</p>
          <p>Attempted: {result.attempted}</p>
          <p className="text-green-600 font-semibold">
            Correct: {result.correct}
          </p>
          <p className="text-red-600 font-semibold">Wrong: {result.wrong}</p>

          <button
            onClick={() => navigate("/aptitude")}
            className="mt-4 px-6 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold"
          >
            Back to Aptitude
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const userAns = answers[currentIndex];

  const handleOptionClick = (opt) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  const handleSkip = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* header */}
      <header className="border-b bg-white px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Aptitude Test</h1>
          <p className="text-xs text-slate-500">
            Company:{" "}
            <span className="font-semibold">{selectedCompany}</span> • Topic:{" "}
            <span className="font-semibold">{selectedTopic}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Time Left</p>
          <p className="text-xl font-bold text-purple-600">
            {formatTime(timeLeft)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Question {currentIndex + 1} / {totalQuestions}
          </p>
        </div>
      </header>

      {/* content */}
      <main className="max-w-3xl mx-auto w-full p-8 space-y-5">
        <p className="text-lg font-semibold text-slate-900">
          Q{currentIndex + 1}. {currentQ.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const isCorrect = opt === currentQ.correctAnswer;
            const isSelected = userAns === opt;

            return (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className={`border rounded-xl px-4 py-3 text-left text-sm font-medium
                  ${
                    userAns
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : isSelected
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-300 text-slate-700"
                      : "border-slate-300 hover:border-purple-500 text-slate-700"
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation[currentIndex] && (
          <div className="bg-slate-100 p-4 rounded-xl text-sm">
            <strong className="text-purple-600">Explanation:</strong>{" "}
            {currentQ.explanation}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-full border text-sm"
          >
            Skip
          </button>

          <button
            onClick={
              currentIndex === totalQuestions - 1 ? handleSubmit : handleNext
            }
            className="px-6 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold"
          >
            {currentIndex === totalQuestions - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </main>
    </div>
  );
}
