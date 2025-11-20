import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../data/questions.json";

export default function AptitudePage() {
  const navigate = useNavigate();

  const aptitudeQuestions = useMemo(
    () => data.questions.filter((q) => q.category === "Aptitude"),
    []
  );

  const companies = useMemo(() => {
    const set = new Set();
    aptitudeQuestions.forEach((q) => q.company.forEach((c) => set.add(c)));
    return ["All Companies", ...Array.from(set)];
  }, [aptitudeQuestions]);

  const topics = useMemo(() => {
    const set = new Set();
    aptitudeQuestions.forEach((q) => set.add(q.subcategory));
    return ["All Topics", ...Array.from(set)];
  }, [aptitudeQuestions]);

  // 🔹 initial values from localStorage (agar stored hon)
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return localStorage.getItem("apt_selected_company") || "All Companies";
  });

  const [selectedTopic, setSelectedTopic] = useState(() => {
    return localStorage.getItem("apt_selected_topic") || "All Topics";
  });

  const [page, setPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  const pageSize = 3;

  // 🔹 jab bhi filter change ho → localStorage update karo
  useEffect(() => {
    localStorage.setItem("apt_selected_company", selectedCompany);
    localStorage.setItem("apt_selected_topic", selectedTopic);
  }, [selectedCompany, selectedTopic]);

  const filtered = useMemo(() => {
    return aptitudeQuestions.filter((q) => {
      const byCompany =
        selectedCompany === "All Companies" ||
        q.company.includes(selectedCompany);

      const byTopic =
        selectedTopic === "All Topics" || q.subcategory === selectedTopic;

      return byCompany && byTopic;
    });
  }, [aptitudeQuestions, selectedCompany, selectedTopic]);

  useEffect(() => {
    setPage(1);
    setSelectedOptions({});
    setShowExplanation({});
  }, [selectedCompany, selectedTopic]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setSelectedOptions({});
    setShowExplanation({});
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="text-2xl font-bold text-slate-800">
            Aptitude Questions
          </h1>
          <span className="text-sm text-slate-500">
            Filter by company & topic
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 px-8 py-6 gap-8">
        {/* LEFT — QUESTIONS LIST */}
        <section className="flex-1 bg-white rounded-3xl shadow-md border border-slate-200 p-6 space-y-4">
          {paginated.map((q, i) => {
            const qIndex = startIndex + i;
            const userAnswer = selectedOptions[qIndex];

            return (
              <div
                key={qIndex}
                className="border border-slate-200 rounded-2xl p-5 hover:border-purple-400 transition"
              >
                <p className="text-base font-semibold text-slate-900 mb-3 leading-relaxed">
                  Q{qIndex + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isCorrect = opt === q.correctAnswer;
                    const isSelected = userAnswer === opt;

                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (userAnswer) return;
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [qIndex]: opt,
                          }));
                          setShowExplanation((prev) => ({
                            ...prev,
                            [qIndex]: true,
                          }));
                        }}
                        className={`
                          border rounded-xl px-4 py-3 text-sm font-medium text-left transition
                          ${
                            userAnswer
                              ? isCorrect
                                ? "border-green-500 bg-green-50 text-green-700"
                                : isSelected
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-slate-200 text-slate-700"
                              : "border-slate-200 hover:border-purple-500 text-slate-700"
                          }
                        `}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showExplanation[qIndex] && (
                  <div className="mt-4 text-sm bg-slate-100 p-4 rounded-xl leading-relaxed">
                    <strong className="text-purple-600">Explanation:</strong>{" "}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-full disabled:opacity-40"
            >
              ◀ Prev
            </button>

            <span className="font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-full disabled:opacity-40"
            >
              Next ▶
            </button>
          </div>
        </section>

        {/* RIGHT — FILTERS + START TEST */}
        <aside className="w-full max-w-xs space-y-5">
          <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-5 space-y-4">
            {/* Company */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-400"
              >
                {companies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-400"
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 text-sm font-semibold shadow-lg"
            onClick={() =>
              navigate("/aptitude/test", {
                state: {
                  company: selectedCompany,
                  topic: selectedTopic,
                },
              })
            }
          >
            Start Practice / Test
          </button>
        </aside>
      </main>
    </div>
  );
}
