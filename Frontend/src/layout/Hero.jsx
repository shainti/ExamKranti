import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "ssc",     label: "SSC",         icon: "ti-building-bank" },
  { id: "defence", label: "Defence",     icon: "ti-shield-star" },
  { id: "state",   label: "State Exams", icon: "ti-map-pin" },
  { id: "police",  label: "Police",      icon: "ti-shield" },
];

const EXAMS = {
  ssc: [
    // ✅ RENAMED
    { id: "ssc-gd",    name: "SSC All in One Test",   tests: 320, free: 8,  tag: "Hot",  color: "red",    icon: "ti-shield-half-filled" },
  ],
  defence: [
    { id: "bsf-hcf",   name: "BSF HCF",           tests: 195, free: 7,  tag: "New",  color: "green",  icon: "ti-shield-star", comingSoon: true },
    { id: "crpf",      name: "CRPF Constable",     tests: 175, free: 6,  tag: null,   color: "blue",   icon: "ti-shield-half-filled", comingSoon: true },
  ],
  state: [
    { id: "joait",     name: "JOAIT",               tests: 140, free: 5,  tag: "Hot",  color: "orange", icon: "ti-map-pin", comingSoon: true },
  ],
  police: [
    { id: "hp-police", name: "Himachal Police",    tests: 110, free: 4,  tag: "New",  color: "purple", icon: "ti-shield-check", comingSoon: true },
  ],
};

const TAG_STYLES = {
  Hot: "bg-red-100 text-red-600",
  New: "bg-emerald-100 text-emerald-600",
};

const COLOR_MAP = {
  red:    { bg: "bg-red-50",     icon: "text-red-500",     border: "border-red-100" },
  orange: { bg: "bg-orange-50",  icon: "text-orange-500",  border: "border-orange-100" },
  blue:   { bg: "bg-blue-50",    icon: "text-blue-500",    border: "border-blue-100" },
  green:  { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  purple: { bg: "bg-purple-50",  icon: "text-purple-500",  border: "border-purple-100" },
};

const STATS = [
  { target: 240000, suffix: "L+",  display: (n) => (n / 100000).toFixed(1),  label: "Students",         icon: "ti-users" },
  { target: 800,    suffix: "+",   display: (n) => Math.round(n),              label: "Mock Tests",      icon: "ti-clipboard-list" },
  { target: 4,      suffix: "+",   display: (n) => Math.round(n),              label: "Exam Categories", icon: "ti-certificate" },
  { target: 99,     suffix: "%",   display: (n) => Math.round(n),              label: "Accuracy",        icon: "ti-target" },
];

// ─── useCountUp hook ──────────────────────────────────────────────────────────

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, duration]);

  return count;
}

// ─── AnimatedStat card ────────────────────────────────────────────────────────

function AnimatedStat({ stat, started, delay }) {
  const raw = useCountUp(stat.target, 1800, started);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);

  const displayed = stat.display(raw);

  return (
    <div
      className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white text-center transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <i className={`ti ${stat.icon} text-2xl text-blue-200 mb-1 block`} />
      <p className="font-sora text-2xl font-bold tabular-nums">
        {displayed}{stat.suffix}
      </p>
      <p className="font-grotesk text-xs text-blue-200 mt-0.5">{stat.label}</p>
    </div>
  );
}

// ─── Exam Card ────────────────────────────────────────────────────────────────

const ExamCard = ({ exam }) => {
  const navigate = useNavigate(); // ✅ SAME AS YOUR CODE
  const c = COLOR_MAP[exam.color] || COLOR_MAP.blue;

  return (
    <div className={`group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col transition-all duration-200 ${exam.comingSoon ? 'opacity-60' : 'hover:border-blue-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5'}`}>
      {exam.tag && (
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full font-grotesk ${TAG_STYLES[exam.tag]}`}>
          {exam.tag}
        </span>
      )}
      <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center mb-4 shrink-0`}>
        <i className={`ti ${exam.icon} text-2xl ${c.icon}`} />
      </div>
      <h3 className="font-grotesk font-semibold text-sm text-gray-900 leading-snug mb-2 pr-6 flex-1">
        {exam.name}
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-grotesk text-xs text-gray-400 flex items-center gap-1">
          <i className="ti ti-clipboard-list text-xs" />
          {exam.tests} Tests
        </span>
        <span className="text-gray-200 text-xs">|</span>
        <span className="font-grotesk text-xs text-emerald-600 font-semibold">
          {exam.free} Free
        </span>
      </div>

      <button
        onClick={() => !exam.comingSoon && navigate(`/test/${exam.id}`)}
        className={`w-full text-xs font-semibold font-grotesk py-2 rounded-xl transition-all duration-150 border ${
          exam.comingSoon 
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none" 
          : "text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border-blue-100 hover:border-blue-600"
        }`}
      >
        {exam.comingSoon ? "Coming Soon" : "Start Test →"}
      </button>
    </div>
  );
};

// ─── Hero Section (Default Export) ───────────────────────────────────────────

export default function HeroSection() {
  const [activeCategory, setActiveCategory] = useState("ssc");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [animStarted,    setAnimStarted]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimStarted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const currentExams  = EXAMS[activeCategory] || [];
  const filteredExams = currentExams.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        .font-sora     { font-family: 'Sora', sans-serif; }
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .tabular-nums  { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* ── Banner ── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Left */}
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-semibold font-grotesk px-3 py-1.5 rounded-full mb-5">
                <i className="ti ti-flame text-sm text-orange-300" />
                India's #1 Government Exam Platform
              </div>
              <h1 className="font-sora text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Practice Smart.<br />
                <span className="text-blue-200">Crack Any Exam.</span>
              </h1>
              <p className="font-grotesk text-blue-100 text-sm md:text-base leading-relaxed mb-7 max-w-lg">
                Full-length mock tests for SSC All in One Test &amp; more —
                with instant All India Rank &amp; deep performance analysis.
              </p>

              {/* Search */}
              <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 max-w-md shadow-lg mb-6">
                <i className="ti ti-search text-gray-400 text-lg ml-3" />
                <input
                  type="text"
                  placeholder="Search for an exam eg. SSC GD, BSF HCF…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 py-2 text-sm font-grotesk text-gray-700 outline-none bg-transparent placeholder-gray-400"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold font-grotesk px-4 py-2 rounded-xl transition-colors shrink-0">
                  Search
                </button>
              </div>

              {/* Quick pills */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-grotesk text-xs text-blue-200 self-center">Popular:</span>
                {["SSC All in One"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs font-grotesk font-medium bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — animated stat cards */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {STATS.map((stat, i) => (
                <AnimatedStat
                  key={stat.label}
                  stat={stat}
                  started={animStarted}
                  delay={i * 120}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mock Test Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-sora text-2xl font-bold text-gray-900">Mock Test Series</h2>
            <p className="font-grotesk text-sm text-gray-500 mt-1">
              Choose your exam category and start practising today
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold font-grotesk text-blue-600 hover:text-blue-700 transition-colors">
            View all exams <i className="ti ti-arrow-right text-sm" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-7 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-grotesk whitespace-nowrap transition-all duration-200 border shrink-0
                ${activeCategory === cat.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              <i className={`ti ${cat.icon} text-base`} />
              {cat.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <p className="font-grotesk text-sm text-gray-500 mb-4">
            Showing <span className="font-semibold text-gray-800">{filteredExams.length}</span> result{filteredExams.length !== 1 ? "s" : ""} for{" "}
            "<span className="font-semibold text-blue-600">{searchQuery}</span>"
          </p>
        )}

        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredExams.map(exam => (
              <ExamCard key={exam.name} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="ti ti-search-off text-5xl text-gray-300 block mb-3" />
            <p className="font-grotesk text-gray-500 text-sm">
              No exams found for "<span className="font-semibold">{searchQuery}</span>"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-xs font-medium font-grotesk text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ── Feature Strip ── */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "ti-chart-bar", color: "text-blue-500",    bg: "bg-blue-50",    title: "All India Rank",       desc: "Compare with lakhs of students" },
              { icon: "ti-clock",     color: "text-orange-500",  bg: "bg-orange-50",  title: "Real Exam Interface",  desc: "Timer, pattern & marking scheme" },
              { icon: "ti-language",  color: "text-emerald-600", bg: "bg-emerald-50", title: "Bilingual Tests",      desc: "Hindi & English both available" },
              { icon: "ti-refresh",   color: "text-purple-500",  bg: "bg-purple-50",  title: "Unlimited Reattempts", desc: "Practice until you're perfect" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <i className={`ti ${f.icon} text-xl ${f.color}`} />
                </div>
                <div>
                  <p className="font-grotesk font-semibold text-sm text-gray-900">{f.title}</p>
                  <p className="font-grotesk text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}