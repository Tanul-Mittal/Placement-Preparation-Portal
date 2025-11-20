import React, { useMemo, useState } from "react";

// dummy DSA data – abhi ke liye
const dsaQuestions = [
  {
    id: 1,
    title: "Two Sum",
    url: "https://leetcode.com/problems/two-sum",
    difficulty: "Easy",
    companies: ["Google", "Amazon"],
    topic: "Array"
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    companies: ["Amazon", "Microsoft"],
    topic: "Array"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    difficulty: "Medium",
    companies: ["Google", "Meta"],
    topic: "String"
  },
  {
    id: 4,
    title: "Merge Two Sorted Lists",
    url: "https://leetcode.com/problems/merge-two-sorted-lists",
    difficulty: "Easy",
    companies: ["Microsoft"],
    topic: "Linked List"
  },
  {
    id: 5,
    title: "Binary Tree Inorder Traversal",
    url: "https://leetcode.com/problems/binary-tree-inorder-traversal",
    difficulty: "Easy",
    companies: ["Amazon"],
    topic: "Tree"
  },
  {
    id: 6,
    title: "Number of Islands",
    url: "https://leetcode.com/problems/number-of-islands",
    difficulty: "Medium",
    companies: ["Google", "Netflix"],
    topic: "Graph"
  },
  {
    id: 7,
    title: "LRU Cache",
    url: "https://leetcode.com/problems/lru-cache",
    difficulty: "Medium",
    companies: ["Amazon", "Google"],
    topic: "Design"
  },
  {
    id: 8,
    title: "Median of Two Sorted Arrays",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays",
    difficulty: "Hard",
    companies: ["Google"],
    topic: "Array"
  }
];

function difficultyBadge(level) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
  if (level === "Easy")
    return base + " bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (level === "Medium")
    return base + " bg-amber-50 text-amber-700 border border-amber-200";
  return base + " bg-rose-50 text-rose-700 border border-rose-200"; // hard
}

export default function DsaPage() {
  const companies = useMemo(() => {
    const set = new Set();
    dsaQuestions.forEach((q) => q.companies.forEach((c) => set.add(c)));
    return ["All Companies", ...Array.from(set)];
  }, []);

  const topics = useMemo(() => {
    const set = new Set();
    dsaQuestions.forEach((q) => set.add(q.topic));
    return ["All Topics", ...Array.from(set)];
  }, []);

  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const filtered = useMemo(() => {
    return dsaQuestions.filter((q) => {
      const byCompany =
        selectedCompany === "All Companies" ||
        q.companies.includes(selectedCompany);

      const byTopic =
        selectedTopic === "All Topics" || q.topic === selectedTopic;

      return byCompany && byTopic;
    });
  }, [selectedCompany, selectedTopic]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* top bar (simple, like other pages) */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="text-2xl font-bold text-slate-800">
            DSA Question Bank
          </h1>
          <span className="text-xs sm:text-sm text-slate-500">
            Filter by company & topic • LeetCode style list
          </span>
        </div>
      </header>

      {/* main layout */}
      <main className="flex-1 px-8 py-6">
        {/* filters row */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            >
              {companies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Topic / Tag
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
            >
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-xs sm:text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            questions
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Q. No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Question Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Question URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Companies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                    Topic
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, idx) => (
                  <tr
                    key={q.id}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }
                  >
                    <td className="px-4 py-3 align-top text-xs text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 align-top text-sm font-medium text-slate-800">
                      {q.title}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-purple-700 underline">
                      <a href={q.url} target="_blank" rel="noreferrer">
                        {q.url}
                      </a>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={difficultyBadge(q.difficulty)}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      {q.companies.join(", ")}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      {q.topic}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No questions match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
