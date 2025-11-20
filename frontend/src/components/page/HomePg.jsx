import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Aptitude",
    desc: "master quantitative aptitude with topic-wise practice and timed assessments."
  },
  {
    title: "AI Interview",
    desc: "experience a real-time AI-powered interview simulation with instant feedback."
  },
  {
    title: "Resume",
    desc: "create, analyze, and improve your resume with ATS-friendly suggestions."
  },
  {
    title: "Reasoning",
    desc: "enhance your logical and analytical reasoning skills with structured practice."
  },
  {
    title: "Data Structures and Algorithms",
    desc: "practice DSA problems, track progress, and prepare for coding interviews."
  },
  {
    title: "Technical",
    desc: "prepare for core CS technical rounds with concept tests and interview questions."
  }
];

export default function HomePg() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-4">
          {/* left: app title */}
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide uppercase text-purple-600">
            hire vision
          </h1>

          {/* right: user icon + name */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-semibold text-white">
              T
            </div>
            <span className="text-sm font-medium capitalize text-slate-700">
              tanul mittal
            </span>
          </div>
        </div>
      </header>

      {/* cards grid */}
      <main className="px-8 py-10">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cards.map(card => (
            <article
              key={card.title}
              onClick={() => {
                if (card.title === "Aptitude") navigate("/aptitude");
                if (card.title === "Data Structures and Algorithms") navigate("/dsa");
                // baad me yaha aur routes add kar sakta hai
              }}
              className="
                group relative bg-white rounded-3xl shadow-xl overflow-hidden
                transition-all duration-300 min-h-[260px] p-6 cursor-pointer
                hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(88,28,135,0.25)]
                hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100
              "
            >
              {/* normal state */}
              <div className="flex flex-col gap-4 h-full transition-opacity duration-300 group-hover:opacity-0">
                <div
                  className="
                    h-40 rounded-2xl border border-gray-200
                    bg-gradient-to-br from-gray-100 to-gray-50
                    flex items-center justify-center text-xs uppercase tracking-widest text-gray-500
                    text-center px-4
                  "
                >
                  {card.title}
                </div>
                <h3 className="text-lg font-medium break-words">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {card.desc}
                </p>
              </div>

              {/* hover state */}
              <div
                className="
                  absolute inset-0 flex flex-col items-center justify-center text-center gap-4 px-8
                  opacity-0 pointer-events-none transition-opacity duration-300
                  group-hover:opacity-100
                "
              >
                <h3 className="text-xl font-semibold break-words">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
