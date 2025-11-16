"use client";

import { useEffect, useMemo, useState } from "react";
import type { DoctorModel } from "@/types/doctor";
import { createEmptyModel, validateModel } from "@/types/doctor";
import { saveModel, loadModel, clearModel } from "@/lib/storage";
import { downloadJson } from "@/lib/download";
import { Preview } from "@/components/Preview";

export default function Page() {
  const [model, setModel] = useState<DoctorModel>(() => loadModel() ?? createEmptyModel());
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setErrors(validateModel(model));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(model)]);

  useEffect(() => { saveModel(model); }, [model]);

  const totalDuration = useMemo(() => model.shots.reduce((a, s) => a + (s.durationSeconds || 0), 0), [model.shots]);

  function handleExport() {
    downloadJson(`${model.name.replace(/\s+/g, "_")}_doctor_model.json`, model);
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setModel({ ...parsed, updatedAt: new Date().toISOString() });
      } catch {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(file);
  }

  function resetModel() {
    const fresh = createEmptyModel();
    setModel(fresh);
    clearModel();
  }

  return (
    <div className="grid">
      <div className="panel">
        <h2>Doctor Model</h2>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <span className="badge">Total Duration: {totalDuration}s</span>
          <div className="row">
            <label className="btn ghost" htmlFor="import-json">Import JSON</label>
            <input id="import-json" type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
            }} />
            <button className="btn" onClick={handleExport}>Export JSON</button>
            <button className="btn danger" onClick={resetModel}>Reset</button>
          </div>
        </div>

        <div className="section">
          <div className="form-grid">
            <div>
              <div className="label">Name</div>
              <input className="input" value={model.name} onChange={(e) => setModel({ ...model, name: e.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <div className="label">Credentials</div>
              <input className="input" value={model.credentials} onChange={(e) => setModel({ ...model, credentials: e.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <div className="label">Specialty</div>
              <input className="input" value={model.specialty} onChange={(e) => setModel({ ...model, specialty: e.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <div className="label">Branding Colors</div>
              <div className="row">
                <input type="color" className="input" style={{ width: 60, padding: 4 }} value={model.branding?.primaryColor || "#1f6feb"} onChange={(e) => setModel({ ...model, branding: { ...model.branding, primaryColor: e.target.value } })} />
                <input type="color" className="input" style={{ width: 60, padding: 4 }} value={model.branding?.secondaryColor || "#8b5cf6"} onChange={(e) => setModel({ ...model, branding: { ...model.branding, secondaryColor: e.target.value } })} />
                <input className="input" placeholder="Logo URL" value={model.branding?.logoUrl || ""} onChange={(e) => setModel({ ...model, branding: { ...model.branding, logoUrl: e.target.value } })} />
              </div>
            </div>
          </div>
          <div className="label">Bio</div>
          <textarea className="textarea" value={model.bio} onChange={(e) => setModel({ ...model, bio: e.target.value, updatedAt: new Date().toISOString() })} />
        </div>

        <div className="section">
          <h3 style={{ margin: 0, fontSize: 16 }}>Voice & Wardrobe</h3>
          <div className="form-grid">
            <div>
              <div className="label">Voice Gender</div>
              <select className="select" value={model.voice.gender} onChange={(e) => setModel({ ...model, voice: { ...model.voice, gender: e.target.value as any } })}>
                <option value="neutral">Neutral</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <div className="label">Voice Tone</div>
              <select className="select" value={model.voice.tone} onChange={(e) => setModel({ ...model, voice: { ...model.voice, tone: e.target.value as any } })}>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
              </select>
            </div>
            <div>
              <div className="label">Voice Speed (WPM)</div>
              <input type="number" className="input" value={model.voice.speedWpm} min={90} max={240} onChange={(e) => setModel({ ...model, voice: { ...model.voice, speedWpm: Number(e.target.value) } })} />
            </div>
            <div>
              <div className="label">Accent</div>
              <input className="input" value={model.voice.accent || ""} onChange={(e) => setModel({ ...model, voice: { ...model.voice, accent: e.target.value } })} />
            </div>
            <div>
              <div className="label">Wardrobe</div>
              <select className="select" value={model.wardrobe.outfit} onChange={(e) => setModel({ ...model, wardrobe: { ...model.wardrobe, outfit: e.target.value as any } })}>
                <option value="lab_coat">Lab Coat</option>
                <option value="scrubs">Scrubs</option>
                <option value="business_casual">Business Casual</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <div className="label">Accessories (comma-separated)</div>
              <input className="input" value={(model.wardrobe.accessories || []).join(", ")} onChange={(e) => setModel({ ...model, wardrobe: { ...model.wardrobe, accessories: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })} />
            </div>
            <div>
              <div className="label">Wardrobe Color</div>
              <input type="color" className="input" style={{ width: 60, padding: 4 }} value={model.wardrobe.colorTheme || "#1f6feb"} onChange={(e) => setModel({ ...model, wardrobe: { ...model.wardrobe, colorTheme: e.target.value } })} />
            </div>
          </div>
        </div>

        <div className="section">
          <h3 style={{ margin: 0, fontSize: 16 }}>Scene</h3>
          <div className="form-grid">
            <div>
              <div className="label">Background</div>
              <select className="select" value={model.scene.background} onChange={(e) => setModel({ ...model, scene: { ...model.scene, background: e.target.value as any } })}>
                <option value="clinic">Clinic</option>
                <option value="office">Office</option>
                <option value="blue_screen">Blue Screen</option>
                <option value="white">White</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>
            {model.scene.background === "custom" && (
              <div>
                <div className="label">Background URL</div>
                <input className="input" value={model.scene.backgroundUrl || ""} onChange={(e) => setModel({ ...model, scene: { ...model.scene, backgroundUrl: e.target.value } })} />
              </div>
            )}
            <div>
              <div className="label">Framing</div>
              <select className="select" value={model.scene.framing} onChange={(e) => setModel({ ...model, scene: { ...model.scene, framing: e.target.value as any } })}>
                <option value="talking_head">Talking Head</option>
                <option value="medium_shot">Medium Shot</option>
                <option value="wide">Wide</option>
                <option value="top_down">Top Down</option>
              </select>
            </div>
            <div>
              <div className="label">Lighting</div>
              <select className="select" value={model.scene.lighting} onChange={(e) => setModel({ ...model, scene: { ...model.scene, lighting: e.target.value as any } })}>
                <option value="soft">Soft</option>
                <option value="high_key">High?key</option>
                <option value="dramatic">Dramatic</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            <div className="row" style={{ alignItems: "center", gap: 8 }}>
              <input id="captions" type="checkbox" checked={model.scene.captions} onChange={(e) => setModel({ ...model, scene: { ...model.scene, captions: e.target.checked } })} />
              <label htmlFor="captions" className="label">Enable Captions</label>
            </div>
          </div>
        </div>

        <div className="section">
          <h3 style={{ margin: 0, fontSize: 16 }}>Shots</h3>
          <div className="form-grid-1">
            {model.shots.map((shot, idx) => (
              <div key={shot.id} className="panel" style={{ background: "#0e1218" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700 }}>Shot {idx + 1}</div>
                  <div className="row">
                    <button className="btn ghost" onClick={() => {
                      const copy = [...model.shots];
                      copy.splice(idx + 1, 0, { ...shot, id: shot.id + "_copy" });
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }}>Duplicate</button>
                    <button className="btn danger" onClick={() => {
                      const copy = model.shots.filter((_, i) => i !== idx);
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }}>Delete</button>
                  </div>
                </div>
                <div className="form-grid">
                  <div>
                    <div className="label">Title</div>
                    <input className="input" value={shot.title} onChange={(e) => {
                      const copy = [...model.shots];
                      copy[idx] = { ...shot, title: e.target.value };
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }} />
                  </div>
                  <div>
                    <div className="label">Duration (s)</div>
                    <input type="number" className="input" min={1} value={shot.durationSeconds} onChange={(e) => {
                      const copy = [...model.shots];
                      copy[idx] = { ...shot, durationSeconds: Number(e.target.value) };
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }} />
                  </div>
                </div>
                <div>
                  <div className="label">Objective</div>
                  <input className="input" value={shot.objective} onChange={(e) => {
                    const copy = [...model.shots];
                    copy[idx] = { ...shot, objective: e.target.value };
                    setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                  }} />
                </div>
                <div>
                  <div className="label">Script</div>
                  <textarea className="textarea" value={shot.script} onChange={(e) => {
                    const copy = [...model.shots];
                    copy[idx] = { ...shot, script: e.target.value };
                    setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                  }} />
                </div>
                <div className="form-grid">
                  <div>
                    <div className="label">B?roll Cue</div>
                    <input className="input" value={shot.brollCue || ""} onChange={(e) => {
                      const copy = [...model.shots];
                      copy[idx] = { ...shot, brollCue: e.target.value };
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }} />
                  </div>
                  <div>
                    <div className="label">On?screen Text</div>
                    <input className="input" value={shot.onScreenText || ""} onChange={(e) => {
                      const copy = [...model.shots];
                      copy[idx] = { ...shot, onScreenText: e.target.value };
                      setModel({ ...model, shots: copy, updatedAt: new Date().toISOString() });
                    }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn" onClick={() => {
                const n = model.shots.length + 1;
                setModel({
                  ...model,
                  shots: [
                    ...model.shots,
                    { id: `shot_${n}`, title: `Shot ${n}`, objective: "", durationSeconds: 6, script: "" },
                  ],
                  updatedAt: new Date().toISOString(),
                });
              }}>Add Shot</button>
              <button className="btn success" onClick={() => {
                const defaults = [
                  { id: "intro", title: "Intro Greeting", objective: "Establish credibility", durationSeconds: 8, script: "Hi, I?m Dr. ..." },
                  { id: "education", title: "Education", objective: "Explain 2?3 points", durationSeconds: 20, script: "First, ..." },
                  { id: "cta", title: "CTA", objective: "Encourage follow-up", durationSeconds: 6, script: "Consult your provider." },
                ];
                setModel({ ...model, shots: defaults, updatedAt: new Date().toISOString() });
              }}>Generate Template</button>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="section">
            <div className="panel" style={{ borderColor: "#3b1d1d", background: "#180f0f" }}>
              <div style={{ color: "#ffb4b4", fontWeight: 700, marginBottom: 6 }}>Validation</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((e, i) => (<li key={i} style={{ color: "#ffb4b4" }}>{e}</li>))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <Preview model={model} />
    </div>
  );
}
