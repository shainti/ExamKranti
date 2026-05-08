import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

async function fetchExam(examId) {
  const res = await fetch(`http://localhost:3000/exams/${examId}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = await res.json();

  // Adding the requested subjects and updating the name to SSC All In One Test
  const updatedSubjects = [
    {
      name: "Mathematics",
      questions: 25,
      marks: 50,
      color: "#3b82f6",
      topics: ["Number System", "Percentage", "Profit & Loss", "Algebra", "Geometry", "Trigonometry", "Mensuration"]
    },
    {
      name: "Science",
      questions: 25,
      marks: 50,
      color: "#f59e0b",
      topics: ["Physics", "Chemistry", "Biology", "Scientific Discoveries", "Human Body", "Environment"]
    },
    ...(data.subjects || [])
  ];

  return {
    ...data,
    name: "SSC All In One Test",
    subjects: updatedSubjects,
    totalQuestions: updatedSubjects.reduce((acc, s) => acc + (s.questions || 0), 0),
    totalMarks: updatedSubjects.reduce((acc, s) => acc + (s.marks || 0), 0)
  };
}

export default function TestDetail() {
  const { examId } = useParams();
  const navigate   = useNavigate();

  const [exam, setExam]           = useState(null);
  const [phase, setPhase]         = useState("loading");
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setPhase("loading");
    fetchExam(examId)
      .then((data) => { setExam(data); setPhase("ready"); })
      .catch((err) => { setError(err.message); setPhase("error"); });
  }, [examId]);

  const handleStartTest = (test) => {
    if (test.type === "Premium") return;
    setLoadingId(test.id);
    setTimeout(() => {
      navigate(`/test/${exam.id}/mock`, {
        state: { exam, test, stream: exam.stream },
      });
    }, 700);
  };

  if (phase === "loading") {
    return (
      <div style={centered}>
        <div style={spinner("#2563eb")} />
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading exam details…</p>
        <style>{spinCSS}</style>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={centered}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 18 }}>Failed to load exam</p>
        <p style={{ color: "#dc2626", fontSize: 13, background: "#fef2f2", padding: "8px 16px", borderRadius: 8 }}>{error}</p>
        <p style={{ color: "#94a3b8", fontSize: 12 }}>
          Check: <code>GET http://localhost:3000/exams/{examId}</code>
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={btnGray}>← Back</button>
          <button onClick={() => { setPhase("loading"); fetchExam(examId).then((d) => { setExam(d); setPhase("ready"); }).catch((e) => { setError(e.message); setPhase("error"); }); }} style={btnBlue("#2563eb")}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const ac = exam.color || "#2563eb";
  const tabs = ["overview", "syllabus", "tests"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
      }}>
        <button onClick={() => navigate(-1)} style={btnGray}>
          <i className="ti ti-chevron-left" /> Back
        </button>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
          {exam.name}
        </span>
        {exam.tag && (
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20,
            background: exam.tag === "Hot" ? "#fee2e2" : "#d1fae5",
            color: exam.tag === "Hot" ? "#dc2626" : "#065f46",
          }}>{exam.tag}</span>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={() => handleStartTest(exam.testSeries?.[0])} style={btnBlue(ac)}>
          <i className="ti ti-player-play" /> Start Free Test
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${ac}ee 0%, ${ac}99 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 32px", position: "relative" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            {exam.icon && (
              <div style={{ width: 68, height: 68, background: "rgba(255,255,255,0.18)", borderRadius: 18, border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ti ${exam.icon}`} style={{ fontSize: 32, color: "white" }} />
              </div>
            )}
            <div style={{ flex: 1, color: "white" }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                {exam.conductedBy}
              </div>
              <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>
                {exam.name}
              </h1>
              <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.7, maxWidth: 560, marginBottom: 18 }}>
                {exam.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  `${exam.totalQuestions} Questions`,
                  `${exam.duration} Min`,
                  `${exam.totalMarks} Marks`,
                  `${exam.negativeMarking} Negative`,
                  exam.eligibility,
                ].filter(Boolean).map((label) => (
                  <span key={label} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 600 }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700, textTransform: "capitalize",
              fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
              ...(activeTab === t
                ? { background: "white", color: ac, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }
                : { background: "transparent", color: "#64748b" }),
            }}>
              {t === "overview" ? "📋 Overview" : t === "syllabus" ? "📚 Syllabus" : "🧪 Tests"}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Exam pattern */}
            <Card title="Exam Pattern" icon="ti-layout-grid" color="#3b82f6">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginTop: 14 }}>
                {[
                  { label: "Questions",        value: exam.totalQuestions },
                  { label: "Total Marks",      value: exam.totalMarks },
                  { label: "Duration",         value: `${exam.duration} min` },
                  { label: "Negative Marking", value: exam.negativeMarking },
                ].map((item) => (
                  <div key={item.label} style={{ background: exam.colorLight || "#eff6ff", border: `1.5px solid ${exam.colorMid || "#bfdbfe"}`, borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 3 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

              {/* Selection Process */}
              <Card title="Selection Process" icon="ti-stairs" color="#8b5cf6">
                <div style={{ marginTop: 14 }}>
                  {exam.selectionProcess?.map((step, i) => (
                    <div key={step} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 0",
                      borderBottom: i < exam.selectionProcess.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14,
                        background: "#f1f5f9",
                        color: "#64748b",
                      }}>
                        {step.toLowerCase().includes("written") || step.toLowerCase().includes("exam") || step.toLowerCase().includes("test")
                          ? "✍️"
                          : step.toLowerCase().includes("physical") || step.toLowerCase().includes("pet")
                          ? "🏃"
                          : step.toLowerCase().includes("medical")
                          ? "🩺"
                          : step.toLowerCase().includes("document") || step.toLowerCase().includes("verification")
                          ? "📄"
                          : step.toLowerCase().includes("interview")
                          ? "🎙️"
                          : step.toLowerCase().includes("training")
                          ? "🎓"
                          : "✅"}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Subjects */}
              <Card title="Subjects" icon="ti-books" color="#10b981">
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                  {exam.subjects?.map((sub) => (
                    <div key={sub.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{sub.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: sub.color }}>{sub.questions} Qs</span>
                      </div>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 10, background: sub.color, width: `${Math.round((sub.questions / (exam.totalQuestions || 1)) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Syllabus */}
        {activeTab === "syllabus" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {exam.subjects?.map((sub) => (
              <div key={sub.name} style={{ background: "white", borderRadius: 16, padding: 20, border: `1.5px solid ${sub.color}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: sub.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-books" style={{ fontSize: 18, color: sub.color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{sub.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub.questions} Qs · {sub.marks} Marks</div>
                  </div>
                </div>
                {Array.isArray(sub.topics) && sub.topics.length > 0 ? (
                  <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {sub.topics.map((t) => (
                      <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13, color: "#475569" }}>
                        <i className="ti ti-point-filled" style={{ color: sub.color, fontSize: 11, marginTop: 3, flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>No topics listed.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tests */}
        {activeTab === "tests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {exam.testSeries?.map((test) => (
              <div key={test.id} style={{
                background: "white", borderRadius: 14, padding: "16px 18px",
                border: "1.5px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 12,
                opacity: test.type === "Premium" ? 0.7 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: test.type === "Free" ? (exam.colorLight || "#eff6ff") : "#f8fafc", border: `1.5px solid ${test.type === "Free" ? (exam.colorMid || "#bfdbfe") : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`ti ${test.type === "Free" ? "ti-lock-open" : "ti-lock"}`} style={{ fontSize: 18, color: test.type === "Free" ? ac : "#94a3b8" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>{test.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{test.questions} Qs</span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{test.minutes} min</span>
                      <DiffBadge level={test.difficulty} />
                      {test.attempts != null && (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{Number(test.attempts).toLocaleString()} attempts</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartTest(test)}
                  disabled={loadingId === test.id || test.type === "Premium"}
                  style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: test.type === "Premium" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", minWidth: 120, justifyContent: "center", ...(test.type === "Free" ? { background: ac, color: "white" } : { background: "#f1f5f9", color: "#94a3b8" }) }}
                >
                  {loadingId === test.id ? (
                    <><i className="ti ti-loader-2" style={{ animation: "spin .7s linear infinite" }} /> Loading…</>
                  ) : test.type === "Free" ? (
                    <><i className="ti ti-player-play" /> Start</>
                  ) : (
                    <><i className="ti ti-lock" /> Unlock</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
      <style>{spinCSS}</style>
    </div>
  );
}

function Card({ title, icon, color, children }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1.5px solid #e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: 17, color }} />
        </div>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

const DIFF = {
  Easy:   { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  Medium: { bg: "#fffbeb", color: "#92400e", dot: "#f59e0b" },
  Hard:   { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};
function DiffBadge({ level }) {
  const d = DIFF[level] || DIFF.Medium;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: d.bg, color: d.color, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.dot }} />
      {level}
    </span>
  );
}

const centered = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" };
const btnGray  = { display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" };
const btnBlue  = (color) => ({ background: color, color: "white", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 });
const spinner  = (color) => ({ width: 48, height: 48, border: `4px solid ${color}30`, borderTop: `4px solid ${color}`, borderRadius: "50%", animation: "spin .8s linear infinite" });
const spinCSS  = `@keyframes spin { to { transform: rotate(360deg); } }`;