import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0f1117",
  surface: "#1a1d27",
  card: "#21253a",
  accent: "#4f8ef7",
  accentSoft: "#1e3a6e",
  green: "#22c55e",
  greenSoft: "#14532d",
  amber: "#f59e0b",
  amberSoft: "#451a03",
  red: "#ef4444",
  redSoft: "#450a0a",
  text: "#e2e8f0",
  muted: "#64748b",
  border: "#2d3148",
};

const initialProjects = [];

const statusColor = (status) => {
  if (status === "Done" || status === "Submitted") return { bg: COLORS.greenSoft, text: COLORS.green };
  if (status === "In Progress" || status === "Planning") return { bg: COLORS.accentSoft, text: COLORS.accent };
  if (status === "Todo") return { bg: "#1e1b2e", text: COLORS.muted };
  return { bg: COLORS.amberSoft, text: COLORS.amber };
};

const priorityColor = (p) => {
  if (p === "High") return COLORS.red;
  if (p === "Medium") return COLORS.amber;
  return COLORS.muted;
};

const Badge = ({ label, color }) => (
  <span style={{
    background: color.bg, color: color.text,
    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
    display: "inline-block",
  }}>{label}</span>
);

const Progress = ({ value }) => (
  <div style={{ background: COLORS.border, borderRadius: 8, height: 7, width: "100%", overflow: "hidden" }}>
    <div style={{
      width: `${value}%`, height: "100%",
      background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.green})`,
      borderRadius: 8, transition: "width 0.5s ease",
    }} />
  </div>
);

const milestoneProgress = (milestones) => {
  const done = milestones.filter(m => m.done).length;
  return Math.round((done / milestones.length) * 100);
};

// ===== MODALS =====
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  }}>
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
      width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto",
      padding: 32, position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ color: COLORS.text, fontSize: 20, fontFamily: "'Sora', sans-serif", margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 22,
        }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const inputStyle = {
  width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
  borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14,
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const btnStyle = (variant = "primary") => ({
  background: variant === "primary" ? COLORS.accent : "transparent",
  color: variant === "primary" ? "#fff" : COLORS.muted,
  border: variant === "primary" ? "none" : `1px solid ${COLORS.border}`,
  borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14,
  fontWeight: 600, fontFamily: "inherit", transition: "opacity 0.2s",
});

// ===== PROJECT DETAIL VIEW =====
function ProjectDetail({ project, role, onBack, onUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newTask, setNewTask] = useState({ title: "", assignee: "", priority: "Medium" });
  const [submissionNote, setSubmissionNote] = useState("");
  const [grade, setGrade] = useState("");
  const [showGradeModal, setShowGradeModal] = useState(false);

  const progress = milestoneProgress(project.milestones);

  const toggleMilestone = (mid) => {
    const updated = {
      ...project,
      milestones: project.milestones.map(m => m.id === mid ? { ...m, done: !m.done } : m),
    };
    onUpdate(updated);
  };

  const updateTaskStatus = (tid, status) => {
    const updated = {
      ...project,
      tasks: project.tasks.map(t => t.id === tid ? { ...t, status } : t),
    };
    onUpdate(updated);
  };

  const addTask = () => {
    if (!newTask.title) return;
    const updated = {
      ...project,
      tasks: [...project.tasks, { id: Date.now(), ...newTask, status: "Todo" }],
    };
    onUpdate(updated);
    setNewTask({ title: "", assignee: "", priority: "Medium" });
  };

  const submitProject = () => {
    const updated = {
      ...project,
      submitted: true,
      status: "Submitted",
      submission: { file: "submission.zip", note: submissionNote, grade: null },
    };
    onUpdate(updated);
    setSubmissionNote("");
  };

  const giveGrade = () => {
    const updated = {
      ...project,
      submission: { ...project.submission, grade },
    };
    onUpdate(updated);
    setShowGradeModal(false);
    setGrade("");
  };

  const tabs = ["overview", "tasks", "milestones", role === "teacher" ? "review" : "submit"].filter(Boolean);

  return (
    <div>
      <button onClick={onBack} style={{ ...btnStyle("secondary"), marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back to Projects
      </button>

      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ color: COLORS.text, fontSize: 24, fontFamily: "'Sora', sans-serif", margin: "0 0 8px" }}>{project.title}</h1>
            <p style={{ color: COLORS.muted, margin: "0 0 12px", fontSize: 14 }}>{project.description}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge label={project.status} color={statusColor(project.status)} />
              <Badge label={`📅 Due ${project.deadline}`} color={{ bg: COLORS.amberSoft, text: COLORS.amber }} />
              <Badge label={`👥 ${project.members.join(", ")}`} color={{ bg: "#1e2535", text: COLORS.muted }} />
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 120 }}>
            <div style={{ color: COLORS.accent, fontSize: 32, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{progress}%</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Milestone Progress</div>
            <Progress value={progress} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, borderRadius: 10, padding: 4, width: "fit-content", border: `1px solid ${COLORS.border}` }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: activeTab === tab ? COLORS.accent : "transparent",
            color: activeTab === tab ? "#fff" : COLORS.muted,
            border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", textTransform: "capitalize",
          }}>{tab}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ color: COLORS.text, marginTop: 0, fontSize: 15 }}>📋 Task Summary</h3>
            {["Done", "In Progress", "Todo"].map(s => {
              const count = project.tasks.filter(t => t.status === s).length;
              return (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: COLORS.muted, fontSize: 14 }}>{s}</span>
                  <Badge label={count} color={statusColor(s)} />
                </div>
              );
            })}
          </div>
          <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ color: COLORS.text, marginTop: 0, fontSize: 15 }}>🏁 Milestones</h3>
            {project.milestones.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{m.done ? "✅" : "⭕"}</span>
                <span style={{ color: m.done ? COLORS.green : COLORS.muted, fontSize: 14, textDecoration: m.done ? "line-through" : "none" }}>{m.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === "tasks" && (
        <div>
          {role === "teacher" && (
            <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 20 }}>
              <h3 style={{ color: COLORS.text, marginTop: 0, fontSize: 15 }}>➕ Add Task</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 10, alignItems: "end" }}>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Task Title</div>
                  <input style={inputStyle} placeholder="Task name..." value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                </div>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Assignee</div>
                  <input style={inputStyle} placeholder="Student name..." value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
                </div>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Priority</div>
                  <select style={inputStyle} value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                    {["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <button onClick={addTask} style={btnStyle()}>Add</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {project.tasks.map(task => (
              <div key={task.id} style={{
                background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`,
                padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                  <span style={{ width: 4, height: 36, borderRadius: 4, background: priorityColor(task.priority), flexShrink: 0 }} />
                  <div>
                    <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>👤 {task.assignee} · Priority: <span style={{ color: priorityColor(task.priority) }}>{task.priority}</span></div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Badge label={task.status} color={statusColor(task.status)} />
                  <select
                    style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "5px 10px" }}
                    value={task.status}
                    onChange={e => updateTaskStatus(task.id, e.target.value)}
                  >
                    {["Todo", "In Progress", "Done"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MILESTONES TAB */}
      {activeTab === "milestones" && (
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: COLORS.muted, fontSize: 14 }}>Overall Progress</span>
              <span style={{ color: COLORS.accent, fontWeight: 700 }}>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {project.milestones.map((m, i) => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                background: COLORS.surface, borderRadius: 10, border: `1px solid ${m.done ? COLORS.greenSoft : COLORS.border}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: m.done ? COLORS.greenSoft : COLORS.bg,
                  border: `2px solid ${m.done ? COLORS.green : COLORS.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: m.done ? COLORS.green : COLORS.muted, fontWeight: 700, fontSize: 14,
                }}>
                  {m.done ? "✓" : i + 1}
                </div>
                <span style={{ flex: 1, color: m.done ? COLORS.green : COLORS.text, fontWeight: 500, textDecoration: m.done ? "line-through" : "none" }}>{m.title}</span>
                {(role === "teacher" || role === "student") && (
                  <button onClick={() => toggleMilestone(m.id)} style={{
                    ...btnStyle(m.done ? "secondary" : "primary"),
                    fontSize: 12, padding: "6px 14px",
                  }}>
                    {m.done ? "Undo" : "Mark Done"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT TAB (Student) */}
      {activeTab === "submit" && role === "student" && (
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 28 }}>
          {project.submitted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: COLORS.green, marginTop: 0 }}>Project Submitted!</h3>
              <p style={{ color: COLORS.muted }}>Your submission note: <em>"{project.submission?.note}"</em></p>
              {project.submission?.grade ? (
                <div style={{ marginTop: 20, padding: 20, background: COLORS.greenSoft, borderRadius: 12 }}>
                  <div style={{ color: COLORS.muted, fontSize: 14 }}>Your Grade</div>
                  <div style={{ color: COLORS.green, fontSize: 36, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{project.submission.grade}</div>
                </div>
              ) : (
                <Badge label="Awaiting Grade" color={{ bg: COLORS.amberSoft, text: COLORS.amber }} />
              )}
            </div>
          ) : (
            <div>
              <h3 style={{ color: COLORS.text, marginTop: 0 }}>📤 Submit Group Project</h3>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>
                Make sure all milestones are complete before submitting. Ensure all team members have reviewed the final work.
              </p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>Submission Note</div>
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                  placeholder="Describe your project, key features, and anything the teacher should know..."
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: COLORS.surface, borderRadius: 8, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 24 }}>📁</span>
                <div>
                  <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>Upload Files</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>submission.zip (simulated)</div>
                </div>
              </div>
              <button onClick={submitProject} style={{ ...btnStyle(), width: "100%" }}>Submit Project →</button>
            </div>
          )}
        </div>
      )}

      {/* REVIEW TAB (Teacher) */}
      {activeTab === "review" && role === "teacher" && (
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 28 }}>
          {project.submitted ? (
            <div>
              <h3 style={{ color: COLORS.text, marginTop: 0 }}>📋 Submission Review</h3>
              <div style={{ padding: 16, background: COLORS.surface, borderRadius: 10, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>Student Note</div>
                <p style={{ color: COLORS.text, margin: 0, fontSize: 14 }}>{project.submission?.note}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: COLORS.surface, borderRadius: 10, marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 24 }}>📁</span>
                <div>
                  <div style={{ color: COLORS.text, fontSize: 14 }}>{project.submission?.file}</div>
                  <div style={{ color: COLORS.accent, fontSize: 12, cursor: "pointer" }}>Download ↓</div>
                </div>
              </div>
              {project.submission?.grade ? (
                <div style={{ textAlign: "center", padding: 20, background: COLORS.greenSoft, borderRadius: 12 }}>
                  <div style={{ color: COLORS.muted, fontSize: 13 }}>Grade Assigned</div>
                  <div style={{ color: COLORS.green, fontSize: 40, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{project.submission.grade}</div>
                  <button onClick={() => setShowGradeModal(true)} style={{ ...btnStyle("secondary"), marginTop: 10, fontSize: 12 }}>Edit Grade</button>
                </div>
              ) : (
                <button onClick={() => setShowGradeModal(true)} style={btnStyle()}>Assign Grade</button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <h3 style={{ color: COLORS.muted }}>No submission yet</h3>
              <p style={{ color: COLORS.muted, fontSize: 14 }}>Students haven't submitted this project.</p>
            </div>
          )}
        </div>
      )}

      {showGradeModal && (
        <Modal title="Assign Grade" onClose={() => setShowGradeModal(false)}>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 12 }}>Enter a grade (e.g., A+, 95, B)</div>
          <input style={{ ...inputStyle, marginBottom: 16 }} placeholder="Grade..." value={grade} onChange={e => setGrade(e.target.value)} />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={giveGrade} style={btnStyle()}>Submit Grade</button>
            <button onClick={() => setShowGradeModal(false)} style={btnStyle("secondary")}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===== DEMO CREDENTIALS =====
const USERS = [
  { email: "teacher@school.edu", password: "teacher123", role: "teacher", name: "Ms. Johnson" },
  { email: "alice@school.edu",   password: "student123", role: "student", name: "Alice" },
  { email: "bob@school.edu",     password: "student123", role: "student", name: "Bob" },
  { email: "carol@school.edu",   password: "student123", role: "student", name: "Carol" },
];

// ===== LOGIN PAGE =====
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login"); // login | register
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "student" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState([...USERS]);
  const [shake, setShake] = useState(false);

  const field = (key, label, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", color: COLORS.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={key === "password" ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setError(""); }}
          style={{
            ...inputStyle,
            paddingRight: key === "password" ? 44 : 14,
            border: `1.5px solid ${error ? COLORS.red : COLORS.border}`,
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.accent}
          onBlur={e => e.target.style.borderColor = error ? COLORS.red : COLORS.border}
        />
        {key === "password" && (
          <button onClick={() => setShowPass(p => !p)} type="button" style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 16,
          }}>{showPass ? "🙈" : "👁"}</button>
        )}
      </div>
    </div>
  );

  const handleLogin = () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); triggerShake(); return; }
    setLoading(true);
    setTimeout(() => {
      const user = registered.find(u => u.email === form.email && u.password === form.password);
      if (user) { onLogin(user.role); }
      else { setError("Invalid email or password."); triggerShake(); }
      setLoading(false);
    }, 800);
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); triggerShake(); return; }
    if (!form.email.includes("@")) { setError("Enter a valid email address."); triggerShake(); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); triggerShake(); return; }
    if (registered.find(u => u.email === form.email)) { setError("Email already registered."); triggerShake(); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = { email: form.email, password: form.password, role: form.role, name: form.name };
      setRegistered(prev => [...prev, newUser]);
      setLoading(false);
      setTab("login");
      setForm({ ...form, password: "" });
      setError("");
    }, 700);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const quickLogin = (u) => {
    setForm({ ...form, email: u.email, password: u.password });
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* LEFT PANEL */}
      <div style={{
        flex: 1, background: `linear-gradient(135deg, #0d1b3e 0%, #0f1117 50%, #0d2e1e 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: 48, position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        {[
          { size: 300, top: -80, left: -80, opacity: 0.07 },
          { size: 200, bottom: 40, right: -60, opacity: 0.06 },
          { size: 120, top: "40%", right: 60, opacity: 0.08 },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
            border: `2px solid ${COLORS.accent}`, opacity: c.opacity,
            top: c.top, left: c.left, bottom: c.bottom, right: c.right,
          }} />
        ))}

        <div style={{ textAlign: "center", maxWidth: 380, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎓</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 800, color: COLORS.text, margin: "0 0 16px", lineHeight: 1.2 }}>
            GroupSync
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            The collaborative platform for student group projects — assign tasks, track milestones, and submit work together.
          </p>

          {/* Feature list */}
          {[
            { icon: "📋", text: "Task assignment & progress tracking" },
            { icon: "🏁", text: "Project milestones & deadlines" },
            { icon: "👩‍🏫", text: "Teacher review & grading" },
            { icon: "🤝", text: "Real-time team collaboration" },
          ].map(f => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, textAlign: "left" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: COLORS.accentSoft,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>{f.icon}</div>
              <span style={{ color: COLORS.muted, fontSize: 14 }}>{f.text}</span>
            </div>
          ))}

          {/* Demo credentials hint */}
          <div style={{
            marginTop: 40, padding: 18, background: "rgba(79,142,247,0.07)",
            borderRadius: 12, border: `1px solid ${COLORS.accentSoft}`, textAlign: "left",
          }}>
            <div style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Demo Accounts</div>
            {[
              { label: "👩‍🏫 Teacher", email: "teacher@school.edu", pass: "teacher123" },
              { label: "🎒 Student", email: "alice@school.edu", pass: "student123" },
            ].map(u => (
              <div key={u.email} style={{ marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>{u.label}: </span>
                <code style={{ color: COLORS.text, fontSize: 11, background: COLORS.surface, padding: "2px 6px", borderRadius: 4 }}>{u.email}</code>
                <span style={{ color: COLORS.muted, fontSize: 12 }}> / </span>
                <code style={{ color: COLORS.text, fontSize: 11, background: COLORS.surface, padding: "2px 6px", borderRadius: 4 }}>{u.pass}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div style={{
        width: "min(480px, 100%)", background: COLORS.surface,
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px",
        borderLeft: `1px solid ${COLORS.border}`,
      }}>
        {/* Tab switcher */}
        <div style={{ display: "flex", background: COLORS.bg, borderRadius: 10, padding: 4, marginBottom: 36, border: `1px solid ${COLORS.border}` }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setForm({ email: "", password: "", name: "", role: "student" }); }} style={{
              flex: 1, background: tab === t ? COLORS.accent : "transparent",
              color: tab === t ? "#fff" : COLORS.muted,
              border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: "inherit", textTransform: "capitalize", transition: "all 0.2s",
            }}>{t === "login" ? "Sign In" : "Register"}</button>
          ))}
        </div>

        <div style={{
          animation: shake ? "shake 0.4s ease" : "none",
        }}>
          <style>{`
            @keyframes shake {
              0%,100%{transform:translateX(0)}
              20%{transform:translateX(-8px)}
              40%{transform:translateX(8px)}
              60%{transform:translateX(-5px)}
              80%{transform:translateX(5px)}
            }
          `}</style>

          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.text, margin: "0 0 6px" }}>
            {tab === "login" ? "Welcome back 👋" : "Create account"}
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28, margin: "0 0 28px" }}>
            {tab === "login" ? "Sign in to access your projects." : "Join GroupSync as a teacher or student."}
          </p>

          {tab === "register" && field("name", "Full Name", "text", "Your full name")}
          {field("email", "Email Address", "email", "you@school.edu")}
          {field("password", "Password", "password", "••••••••")}

          {tab === "register" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", color: COLORS.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Role</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ val: "student", label: "🎒 Student" }, { val: "teacher", label: "👩‍🏫 Teacher" }].map(r => (
                  <button key={r.val} onClick={() => setForm({ ...form, role: r.val })} style={{
                    flex: 1, padding: "11px 0",
                    background: form.role === r.val ? COLORS.accentSoft : COLORS.bg,
                    color: form.role === r.val ? COLORS.accent : COLORS.muted,
                    border: `2px solid ${form.role === r.val ? COLORS.accent : COLORS.border}`,
                    borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 600,
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}>{r.label}</button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: COLORS.redSoft, border: `1px solid ${COLORS.red}`,
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              color: COLORS.red, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
            }}>⚠️ {error}</div>
          )}

          <button
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading}
            style={{
              ...btnStyle(), width: "100%", padding: "14px 0", fontSize: 15,
              opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 4,
            }}
          >
            {loading ? "⏳ Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>

          {/* Quick login buttons */}
          {tab === "login" && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: COLORS.border }} />
                <span style={{ color: COLORS.muted, fontSize: 12 }}>Quick Demo Login</span>
                <div style={{ flex: 1, height: 1, background: COLORS.border }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "👩‍🏫 Login as Teacher", email: "teacher@school.edu", password: "teacher123" },
                  { label: "🎒 Login as Student (Alice)", email: "alice@school.edu", password: "student123" },
                ].map(u => (
                  <button key={u.email} onClick={() => quickLogin(u)} style={{
                    ...btnStyle("secondary"), width: "100%", padding: "10px 0", fontSize: 13,
                    textAlign: "center",
                  }}>{u.label}</button>
                ))}
              </div>
            </div>
          )}

          {tab === "register" && (
            <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginTop: 20 }}>
              Already have an account?{" "}
              <span onClick={() => { setTab("login"); setError(""); }} style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </p>
          )}
          {tab === "login" && (
            <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginTop: 16 }}>
              Don't have an account?{" "}
              <span onClick={() => { setTab("register"); setError(""); }} style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}>Register here</span>
            </p>
          )}
        </div>

        <p style={{ color: COLORS.border, fontSize: 11, textAlign: "center", marginTop: 40 }}>
          FSAD-PS35 · GroupSync Platform Demo
        </p>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [role, setRole] = useState(null);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", deadline: "", members: "" });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  };

  useEffect(() => {
    if (role) fetchProjects();
  }, [role]);

  const updateProject = async (updated) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => prev.map(p => p.id === updated.id ? data : p));
        setSelectedProject(data);
      }
    } catch (e) {
      console.error("Failed to update project", e);
    }
  };

  const createProject = async () => {
    if (!newProject.title) return;
    const p = {
      ...newProject,
      members: newProject.members.split(",").map(s => s.trim()).filter(Boolean),
      status: "Planning",
      milestones: [
        { title: "Project Kickoff", done: false },
        { title: "Mid-Point Review", done: false },
        { title: "Final Submission", done: false },
      ],
      tasks: [], submitted: false, submission: null,
    };
    
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [...prev, data]);
        setShowNewProject(false);
        setNewProject({ title: "", description: "", deadline: "", members: "" });
      }
    } catch (e) {
      console.error("Failed to create project", e);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Login page
  if (!role) return <LoginPage onLogin={setRole} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20, color: COLORS.text }}>GroupSync</span>
          {selectedProject && (
            <>
              <span style={{ color: COLORS.border }}>›</span>
              <span style={{ color: COLORS.muted, fontSize: 14 }}>{selectedProject.title}</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Badge
            label={role === "teacher" ? "👩‍🏫 Teacher" : "🎒 Student"}
            color={{ bg: COLORS.accentSoft, text: COLORS.accent }}
          />
          <button onClick={() => { setRole(null); setSelectedProject(null); }} style={btnStyle("secondary")}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            role={role}
            onBack={() => setSelectedProject(null)}
            onUpdate={updateProject}
          />
        ) : (
          <>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
              <div>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>
                  {role === "teacher" ? "All Projects" : "My Projects"}
                </h1>
                <p style={{ color: COLORS.muted, margin: 0, fontSize: 14 }}>
                  {role === "teacher" ? "Monitor and manage student group projects" : "Track your tasks and project milestones"}
                </p>
              </div>
              {role === "teacher" && (
                <button onClick={() => setShowNewProject(true)} style={btnStyle()}>+ New Project</button>
              )}
            </div>

            {/* STATS ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Projects", value: projects.length, icon: "📁", color: COLORS.accent },
                { label: "In Progress", value: projects.filter(p => p.status === "In Progress").length, icon: "⚡", color: COLORS.amber },
                { label: "Submitted", value: projects.filter(p => p.submitted).length, icon: "✅", color: COLORS.green },
                { label: "Planning", value: projects.filter(p => p.status === "Planning").length, icon: "📌", color: COLORS.muted },
              ].map(s => (
                <div key={s.label} style={{
                  background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`,
                  padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FILTERS */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <input
                style={{ ...inputStyle, maxWidth: 260 }}
                placeholder="🔍 Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "Planning", "In Progress", "Submitted"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{
                    background: filterStatus === s ? COLORS.accent : COLORS.surface,
                    color: filterStatus === s ? "#fff" : COLORS.muted,
                    border: `1px solid ${filterStatus === s ? COLORS.accent : COLORS.border}`,
                    borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* PROJECT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
              {filtered.map(project => {
                const prog = milestoneProgress(project.milestones);
                const tasksDone = project.tasks.filter(t => t.status === "Done").length;
                return (
                  <div key={project.id} onClick={() => setSelectedProject(project)} style={{
                    background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`,
                    padding: 22, cursor: "pointer", transition: "all 0.2s",
                    "&:hover": { borderColor: COLORS.accent },
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <Badge label={project.status} color={statusColor(project.status)} />
                      {project.submitted && project.submission?.grade && (
                        <Badge label={`Grade: ${project.submission.grade}`} color={{ bg: COLORS.greenSoft, text: COLORS.green }} />
                      )}
                    </div>
                    <h3 style={{ color: COLORS.text, margin: "0 0 8px", fontSize: 16, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>{project.title}</h3>
                    <p style={{ color: COLORS.muted, fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>{project.description}</p>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: COLORS.muted, fontSize: 12 }}>Milestones</span>
                        <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700 }}>{prog}%</span>
                      </div>
                      <Progress value={prog} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <span style={{ color: COLORS.muted, fontSize: 12 }}>📋 {tasksDone}/{project.tasks.length} tasks</span>
                        <span style={{ color: COLORS.muted, fontSize: 12 }}>👥 {project.members.length}</span>
                      </div>
                      <span style={{ color: COLORS.muted, fontSize: 12 }}>📅 {project.deadline}</span>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: COLORS.muted }}>
                  <div style={{ fontSize: 48 }}>🔍</div>
                  <p>No projects found.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProject && (
        <Modal title="Create New Project" onClose={() => setShowNewProject(false)}>
          {[
            { label: "Project Title", key: "title", placeholder: "e.g., Climate Research App" },
            { label: "Description", key: "description", placeholder: "Brief project description..." },
            { label: "Deadline", key: "deadline", placeholder: "", type: "date" },
            { label: "Team Members (comma-separated)", key: "members", placeholder: "Alice, Bob, Carol" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>{f.label}</div>
              <input
                style={inputStyle} type={f.type || "text"} placeholder={f.placeholder}
                value={newProject[f.key]}
                onChange={e => setNewProject({ ...newProject, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={createProject} style={btnStyle()}>Create Project</button>
            <button onClick={() => setShowNewProject(false)} style={btnStyle("secondary")}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
