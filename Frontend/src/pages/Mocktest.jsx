import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
const API = import.meta.env.VITE_API;

async function fetchQuestions(examSlug, count = 20) {
  const params = new URLSearchParams();
  if (examSlug) params.set("examSlug", examSlug);
  params.set("limit", count);
  const url = `${API}/exams/questions/all?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  const result = await res.json();
  if (!result.success || !Array.isArray(result.data))
    throw new Error(result.message || "No questions found");
  return result.data;
}

const STATUS = {
  NOT_VISITED: "not_visited",
  VISITED:     "visited",
  ANSWERED:    "answered",
  MARKED:      "marked",
  MARKED_ANS:  "marked_answered",
};

const STATUS_STYLE = {
  [STATUS.NOT_VISITED]: { bg: "#f1f5f9", color: "#94a3b8", border: "#e2e8f0" },
  [STATUS.VISITED]:     { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  [STATUS.ANSWERED]:    { bg: "#22c55e", color: "white",   border: "#16a34a" },
  [STATUS.MARKED]:      { bg: "#a855f7", color: "white",   border: "#9333ea" },
  [STATUS.MARKED_ANS]:  { bg: "#8b5cf6", color: "white",   border: "#7c3aed" },
};

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ── Mobile drawer + textbook-style side tab ───────────────────────────────────
function MobilePanel({ open, onClose, onOpen, questions, qStatus, current, goTo, statusCounts, answeredCount, accentColor }) {
  return (
    <>
      {/* Textbook-thumb tab — always visible on mobile */}
      {!open && (
        <button
          onClick={onOpen}
          style={{
            position: "fixed", right: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 150, background: accentColor, color: "white", border: "none",
            borderRadius: "12px 0 0 12px", padding: "16px 7px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            boxShadow: "-3px 0 16px rgba(0,0,0,0.18)",
          }}
        >
          <i className="ti ti-list-numbers" style={{ fontSize: 18 }} />
          <span style={{
            writingMode: "vertical-rl", textOrientation: "mixed",
            fontSize: 11, fontWeight: 800, fontFamily: "'Cabinet Grotesk', sans-serif",
            letterSpacing: "0.5px", lineHeight: 1,
          }}>
            {answeredCount}/{questions.length}
          </span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, transition: "opacity .25s" }}
        />
      )}

      {/* Drawer slides in from right */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 268,
        background: "white", zIndex: 201, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .28s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Question Panel</span>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        </div>

        {/* Legend */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          {[
            { st: STATUS.ANSWERED,    label: `Answered (${statusCounts[STATUS.ANSWERED] || 0})` },
            { st: STATUS.MARKED_ANS,  label: `Marked + Answered (${statusCounts[STATUS.MARKED_ANS] || 0})` },
            { st: STATUS.MARKED,      label: `Marked for Review (${statusCounts[STATUS.MARKED] || 0})` },
            { st: STATUS.VISITED,     label: `Not Answered (${statusCounts[STATUS.VISITED] || 0})` },
            { st: STATUS.NOT_VISITED, label: `Not Visited (${statusCounts[STATUS.NOT_VISITED] || 0})` },
          ].map(({ st, label }) => (
            <div key={st} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 5 }}>
              <div style={{ width: 13, height: 13, borderRadius: 3, flexShrink: 0, background: STATUS_STYLE[st].bg, border: `1.5px solid ${STATUS_STYLE[st].border}` }} />
              {label}
            </div>
          ))}
        </div>

        {/* Question grid — scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {questions.map((_, i) => {
              const st = qStatus[i] || STATUS.NOT_VISITED;
              const s = STATUS_STYLE[st];
              const isCur = i === current;
              return (
                <button
                  key={i}
                  onClick={() => { goTo(i); onClose(); }}
                  style={{
                    width: 38, height: 38, borderRadius: 9, cursor: "pointer",
                    fontSize: 12, fontWeight: 800, fontFamily: "'Cabinet Grotesk', sans-serif",
                    background: s.bg, color: s.color,
                    border: `${isCur ? "2.5px" : "1.5px"} solid ${isCur ? "#0f172a" : s.border}`,
                    transform: isCur ? "scale(1.1)" : "scale(1)",
                    transition: "transform .15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MockTest() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { examId } = useParams();
  const { exam, test } = location.state || {};

  const accentColor = exam?.color || "#2563eb";
  const lightBg     = exam?.colorLight || "#eff6ff";

  const [phase, setPhase]           = useState("loading");
  const [error, setError]           = useState(null);
  const [questions, setQuestions]   = useState([]);
  const [current, setCurrent]       = useState(0);
  const [answers, setAnswers]       = useState({});
  const [qStatus, setQStatus]       = useState({});
  const [timeLeft, setTimeLeft]     = useState((exam?.duration || 60) * 60);
  const [panelOpen, setPanelOpen]   = useState(true);   // desktop sidebar
  const [drawerOpen, setDrawerOpen] = useState(false);  // mobile drawer
  const [isMobile, setIsMobile]     = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadQuestions = useCallback(async () => {
    setPhase("loading"); setError(null);
    try {
      const qs = await fetchQuestions(examId || exam?.id, test?.questions || 20);
      setQuestions(qs);
      const init = {};
      qs.forEach((_, i) => { init[i] = STATUS.NOT_VISITED; });
      setQStatus(init); setAnswers({}); setCurrent(0);
      setTimeLeft((exam?.duration || 60) * 60);
      setPhase("test");
    } catch (err) {
      setError(err.message || "Failed to load questions.");
      setPhase("error");
    }
  }, [examId, exam?.id, exam?.duration, test?.questions]);

  useEffect(() => { loadQuestions(); }, []);

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "test") return;
    setQStatus((prev) =>
      prev[current] === STATUS.NOT_VISITED ? { ...prev, [current]: STATUS.VISITED } : prev
    );
  }, [current, phase]);

  const selectAnswer = (optIdx) => {
    setAnswers((prev) => ({ ...prev, [current]: optIdx }));
    setQStatus((prev) => {
      const cur = prev[current];
      return { ...prev, [current]: (cur === STATUS.MARKED || cur === STATUS.MARKED_ANS) ? STATUS.MARKED_ANS : STATUS.ANSWERED };
    });
  };

  const clearResponse = () => {
    setAnswers((prev) => { const n = { ...prev }; delete n[current]; return n; });
    setQStatus((prev) => ({ ...prev, [current]: prev[current] === STATUS.MARKED_ANS ? STATUS.MARKED : STATUS.VISITED }));
  };

  const toggleMark = () => {
    setQStatus((prev) => {
      const cur = prev[current];
      if (cur === STATUS.MARKED)     return { ...prev, [current]: STATUS.VISITED };
      if (cur === STATUS.MARKED_ANS) return { ...prev, [current]: STATUS.ANSWERED };
      if (cur === STATUS.ANSWERED)   return { ...prev, [current]: STATUS.MARKED_ANS };
      return { ...prev, [current]: STATUS.MARKED };
    });
  };

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("result");
    window.scrollTo(0, 0);
  }, []);

  const goTo = (idx) => setCurrent(idx);
  const next = () => { if (current < questions.length - 1) setCurrent((c) => c + 1); };
  const prev = () => { if (current > 0) setCurrent((c) => c - 1); };

  const statusCounts = Object.values(qStatus).reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const answeredCount = Object.values(qStatus).filter((s) => s === STATUS.ANSWERED || s === STATUS.MARKED_ANS).length;

  const getScore = () => {
    let correct = 0, wrong = 0;
    questions.forEach((q, i) => {
      const a = answers[i];
      if (a === undefined) return;
      if (a === q.correctIndex) correct++; else wrong++;
    });
    const unattempted = questions.length - correct - wrong;
    const neg = parseFloat(exam?.negativeMarking || "-0.5");
    const score = correct * 2 + wrong * neg;
    const max = questions.length * 2;
    return { correct, wrong, unattempted, score, max, pct: Math.round((score / max) * 100) };
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
      <div style={{ width: 48, height: 48, border: `4px solid ${accentColor}30`, borderTop: `4px solid ${accentColor}`, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Fetching Questions…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (phase === "error") {
    const errUrl = `${API}/exams/questions?${new URLSearchParams({ ...(examId || exam?.id ? { examId: examId || exam?.id } : {}), limit: test?.questions || 20 }).toString()}`;
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "20px 16px" }}>
        <div style={{ fontSize: 44 }}>⚠️</div>
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", textAlign: "center" }}>Failed to Load Questions</div>
        <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "10px 18px", maxWidth: 420, textAlign: "center", wordBreak: "break-word" }}>{error}</div>
        <div style={{ fontSize: 12, color: "#64748b", textAlign: "center", maxWidth: 420 }}>
          Request attempted:
          <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 11, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", color: "#0f172a", wordBreak: "break-all" }}>GET {errUrl}</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", borderRadius: 10, background: "#f1f5f9", color: "#334155", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← Go Back</button>
          <button onClick={loadQuestions} style={{ padding: "10px 20px", borderRadius: 10, background: accentColor, color: "white", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Retry</button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const { correct, wrong, unattempted, score, max, pct } = getScore();
    const grade = pct >= 85 ? { label: "Excellent! 🏆" } : pct >= 65 ? { label: "Good Job! 👍" } : pct >= 40 ? { label: "Keep Going 💪" } : { label: "Needs Work 📖" };
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 40 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}>
            <i className="ti ti-chevron-left" /> Back
          </button>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Result — {exam?.name || "Mock Test"}</span>
        </nav>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 14px" }}>
          <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}aa 100%)`, borderRadius: 20, padding: "28px 20px", textAlign: "center", color: "white", marginBottom: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 600 }}>YOUR SCORE</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(48px, 12vw, 72px)", fontWeight: 900, lineHeight: 1 }}>{score.toFixed(1)}</div>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 16 }}>out of {max} marks</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", borderRadius: 50, padding: "7px 20px", fontSize: 14, fontWeight: 800 }}>{grade.label}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Correct", value: correct, color: "#059669", bg: "#ecfdf5", icon: "ti-circle-check" },
              { label: "Wrong", value: wrong, color: "#dc2626", bg: "#fef2f2", icon: "ti-circle-x" },
              { label: "Skipped", value: unattempted, color: "#94a3b8", bg: "#f8fafc", icon: "ti-circle-minus" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "14px 8px", textAlign: "center", border: `1.5px solid ${s.color}20` }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color, display: "block", marginBottom: 4 }} />
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "clamp(22px, 7vw, 36px)", fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: 18, padding: "18px 14px", border: "1.5px solid #e2e8f0", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 16 }}>📋 Answer Review</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => {
                const ua = answers[i]; const attempted = ua !== undefined; const isCorrect = ua === q.correctIndex;
                return (
                  <div key={q.id ?? i} style={{ borderRadius: 12, padding: "12px 14px", background: !attempted ? "#f8fafc" : isCorrect ? "#ecfdf5" : "#fef2f2", border: `1.5px solid ${!attempted ? "#e2e8f0" : isCorrect ? "#bbf7d0" : "#fecaca"}` }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: !attempted ? "#e2e8f0" : isCorrect ? "#10b981" : "#ef4444", color: !attempted ? "#94a3b8" : "white" }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 8, lineHeight: 1.5 }}>{q.question}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {q.options.map((opt, j) => (
                            <span key={j} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, fontWeight: 600, ...(j === q.correctIndex ? { background: "#d1fae5", color: "#065f46" } : j === ua && !isCorrect ? { background: "#fee2e2", color: "#991b1b" } : { background: "#f1f5f9", color: "#64748b" }) }}>
                              {String.fromCharCode(65 + j)}. {opt}
                            </span>
                          ))}
                        </div>
                        {q.explanation && <div style={{ marginTop: 8, fontSize: 11, color: "#0369a1", background: "#eff6ff", borderRadius: 7, padding: "6px 10px" }}><i className="ti ti-info-circle" style={{ marginRight: 5 }} />{q.explanation}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate(-1)} style={{ padding: "11px 22px", borderRadius: 12, background: "#f1f5f9", color: "#334155", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
              <i className="ti ti-arrow-left" /> Back to Tests
            </button>
            <button onClick={loadQuestions} style={{ padding: "11px 22px", borderRadius: 12, background: accentColor, color: "white", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
              <i className="ti ti-refresh" /> Reattempt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active Test ───────────────────────────────────────────────────────────
  const q = questions[current];
  if (!q) return null;

  const userAns   = answers[current];
  const isMarked  = qStatus[current] === STATUS.MARKED || qStatus[current] === STATUS.MARKED_ANS;
  const answered  = userAns !== undefined;
  const progress  = ((current + 1) / questions.length) * 100;
  const isLowTime = timeLeft < 300;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <button onClick={() => { if (window.confirm("Exit test? Progress will be lost.")) navigate(-1); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: "#dc2626", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            <i className="ti ti-x" style={{ fontSize: 12 }} /> Exit
          </button>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {exam?.shortName || exam?.name || "Mock Test"}
          </span>
          {!isMobile && (
            <>
              <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>—</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{test?.name || "Full Mock Test"}</span>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, borderRadius: 8, padding: "6px 10px", background: isLowTime ? "#fef2f2" : "#f0fdf4", border: `1.5px solid ${isLowTime ? "#fca5a5" : "#86efac"}` }}>
            <i className="ti ti-clock" style={{ color: isLowTime ? "#dc2626" : "#16a34a", fontSize: 13 }} />
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 900, color: isLowTime ? "#dc2626" : "#0f172a", animation: timeLeft < 60 ? "blink 1s infinite" : "none" }}>{fmt(timeLeft)}</span>
          </div>

          {/* Desktop: answered chip + panel toggle */}
          {!isMobile && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: lightBg, border: `1.5px solid ${accentColor}30`, borderRadius: 8, padding: "6px 10px" }}>
                <i className="ti ti-check" style={{ color: accentColor, fontSize: 12 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>{answeredCount}/{questions.length}</span>
              </div>
              <button onClick={() => setPanelOpen((o) => !o)} style={{ background: "#f1f5f9", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <i className={`ti ${panelOpen ? "ti-layout-sidebar-right-collapse" : "ti-layout-sidebar-right"}`} />
              </button>
            </>
          )}

          <button onClick={handleSubmit} style={{ background: accentColor, color: "white", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
            <i className="ti ti-send" style={{ fontSize: 12 }} /> Submit
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#e2e8f0" }}>
        <div style={{ height: "100%", background: accentColor, transition: "width .3s", width: `${progress}%` }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", maxWidth: 1160, margin: "0 auto", width: "100%", padding: isMobile ? "12px 12px 20px" : "16px 14px", gap: 16, alignItems: "flex-start", boxSizing: "border-box" }}>

        {/* Question area */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: isMobile ? 44 : 0 }}>

          {/* Subject + number strip */}
          <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 10, border: "1.5px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, background: lightBg, padding: "3px 8px", borderRadius: 5 }}>{q.subject || "General"}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Q{current + 1} <span style={{ color: "#94a3b8", fontWeight: 500 }}>/ {questions.length}</span></span>
          </div>

          {/* Question card */}
          <div key={current} style={{ background: "white", borderRadius: 18, padding: isMobile ? "18px 14px" : "22px 20px", border: "1.5px solid #e2e8f0", marginBottom: 12, animation: "slideIn .2s ease" }}>
            <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.7, marginBottom: 18 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: accentColor + "18", borderRadius: 7, fontSize: 11, fontWeight: 900, color: accentColor, marginRight: 10, flexShrink: 0, verticalAlign: "middle" }}>Q{current + 1}</span>
              {q.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 8 }}>
              {q.options.map((opt, j) => {
                const isSelected = userAns === j;
                return (
                  <button key={j} onClick={() => selectAnswer(j)}
                    style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: isMobile ? "13px 14px" : "11px 14px", borderRadius: 12, cursor: "pointer", transition: "all .15s", fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 14 : 13, fontWeight: 500, border: `2px solid ${isSelected ? accentColor : "#e2e8f0"}`, background: isSelected ? lightBg : "white", color: isSelected ? accentColor : "#334155" }}
                    onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = accentColor + "60"; e.currentTarget.style.background = lightBg + "80"; } }}
                    onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; } }}
                  >
                    <span style={{ width: 30, height: 30, minWidth: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, border: `2px solid ${isSelected ? accentColor : "#e2e8f0"}`, background: isSelected ? accentColor : "white", color: isSelected ? "white" : "#64748b" }}>{String.fromCharCode(65 + j)}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isSelected && <i className="ti ti-check" style={{ marginLeft: "auto", color: accentColor, fontSize: 15, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav bar */}
          <div style={{ background: "white", borderRadius: 14, padding: "10px 12px", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={prev} disabled={current === 0} style={{ padding: "9px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: current === 0 ? "#f8fafc" : "white", fontSize: 12, fontWeight: 700, color: current === 0 ? "#94a3b8" : "#334155", cursor: current === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <i className="ti ti-chevron-left" /> Prev
              </button>
              <button onClick={next} disabled={current === questions.length - 1} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${current === questions.length - 1 ? "#e2e8f0" : accentColor}`, background: current === questions.length - 1 ? "#f8fafc" : accentColor, fontSize: 12, fontWeight: 700, color: current === questions.length - 1 ? "#94a3b8" : "white", cursor: current === questions.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                Next <i className="ti ti-chevron-right" />
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {answered && (
                <button onClick={clearResponse} style={{ padding: "9px 12px", borderRadius: 9, border: "1.5px solid #fecaca", background: "#fef2f2", fontSize: 11, fontWeight: 700, color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="ti ti-eraser" /> {!isMobile && "Clear"}
                </button>
              )}
              <button onClick={toggleMark} style={{ padding: "9px 12px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, ...(isMarked ? { background: "#faf5ff", border: "1.5px solid #d8b4fe", color: "#7c3aed" } : { background: "white", border: "1.5px solid #e2e8f0", color: "#64748b" }) }}>
                <i className="ti ti-bookmark" />
                {!isMobile && (isMarked ? " Marked" : " Mark")}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        {!isMobile && panelOpen && (
          <aside style={{ width: 216, flexShrink: 0, background: "white", borderRadius: 16, padding: 14, border: "1.5px solid #e2e8f0", position: "sticky", top: 64, maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 13, color: "#0f172a", marginBottom: 12 }}>Question Panel</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
              {[
                { st: STATUS.ANSWERED,    label: `Answered (${statusCounts[STATUS.ANSWERED] || 0})` },
                { st: STATUS.MARKED_ANS,  label: `Marked + Ans (${statusCounts[STATUS.MARKED_ANS] || 0})` },
                { st: STATUS.MARKED,      label: `Marked (${statusCounts[STATUS.MARKED] || 0})` },
                { st: STATUS.VISITED,     label: `Not Answered (${statusCounts[STATUS.VISITED] || 0})` },
                { st: STATUS.NOT_VISITED, label: `Not Visited (${statusCounts[STATUS.NOT_VISITED] || 0})` },
              ].map(({ st, label }) => (
                <div key={st} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "#64748b", fontWeight: 500 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0, background: STATUS_STYLE[st].bg, border: `1.5px solid ${STATUS_STYLE[st].border}` }} />
                  {label}
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 12 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {questions.map((_, i) => {
                const st = qStatus[i] || STATUS.NOT_VISITED;
                const s = STATUS_STYLE[st];
                const isCur = i === current;
                return (
                  <button key={i} onClick={() => goTo(i)} style={{ width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 800, fontFamily: "'Cabinet Grotesk', sans-serif", background: s.bg, color: s.color, border: `${isCur ? "2.5px" : "1.5px"} solid ${isCur ? "#0f172a" : s.border}`, transform: isCur ? "scale(1.12)" : "scale(1)", transition: "transform .15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile panel (tab + drawer) */}
      {isMobile && (
        <MobilePanel
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          questions={questions}
          qStatus={qStatus}
          current={current}
          goTo={goTo}
          statusCounts={statusCounts}
          answeredCount={answeredCount}
          accentColor={accentColor}
        />
      )}

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  );
}