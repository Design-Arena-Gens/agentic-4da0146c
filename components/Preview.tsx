"use client";

import type { DoctorModel } from "@/types/doctor";

export function Preview({ model }: { model: DoctorModel }) {
  const initials = model.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="panel">
      <h2>Preview</h2>
      <div className="preview-card section">
        <div className="avatar" style={{ borderColor: model.branding?.primaryColor }}>
          {initials || "DR"}
        </div>
        <div className="meta">
          <div className="name">
            {model.name} <span style={{ color: "var(--muted)" }}> {model.credentials}</span>
          </div>
          <div className="sub">{model.specialty}</div>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <span className="badge">Voice: {model.voice.gender} ? {model.voice.tone} ? {model.voice.speedWpm} WPM</span>
            <span className="badge">Wardrobe: {model.wardrobe.outfit}</span>
            <span className="badge">Scene: {model.scene.framing} ? {model.scene.lighting}</span>
            {model.scene.captions ? <span className="badge">Captions</span> : null}
          </div>
        </div>
      </div>

      <div className="section">
        <h3 style={{ margin: 0, fontSize: 16 }}>Shot List</h3>
        <div className="form-grid-1" style={{ marginTop: 8 }}>
          {model.shots.map((s) => (
            <div key={s.id} className="panel" style={{ background: "#0e1218" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>{s.title}</div>
                <span className="badge">{s.durationSeconds}s</span>
              </div>
              <div className="kv" style={{ marginTop: 8 }}>
                <div className="k">Objective</div>
                <div>{s.objective}</div>
                <div className="k">Script</div>
                <div>{s.script}</div>
                {s.brollCue ? (<><div className="k">B-roll</div><div>{s.brollCue}</div></>) : null}
                {s.onScreenText ? (<><div className="k">On-screen</div><div>{s.onScreenText}</div></>) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
