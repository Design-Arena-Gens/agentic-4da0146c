export type VoiceProfile = {
  gender: "male" | "female" | "neutral";
  tone: "friendly" | "authoritative" | "calm" | "energetic";
  speedWpm: number; // 100-220
  accent?: string;
};

export type Wardrobe = {
  outfit: "lab_coat" | "scrubs" | "business_casual" | "other";
  accessories?: string[]; // e.g., stethoscope, badge
  colorTheme?: string; // hex or name
};

export type SceneSettings = {
  background: "clinic" | "office" | "blue_screen" | "white" | "custom";
  backgroundUrl?: string;
  framing: "talking_head" | "medium_shot" | "wide" | "top_down";
  lighting: "soft" | "high_key" | "dramatic" | "natural";
  captions: boolean;
};

export type Shot = {
  id: string;
  title: string;
  objective: string;
  durationSeconds: number;
  script: string;
  brollCue?: string;
  onScreenText?: string;
};

export type Branding = {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
};

export type DoctorModel = {
  id: string;
  name: string;
  credentials: string; // e.g., MD, DO, MBBS
  specialty: string; // e.g., cardiology
  bio: string;
  wardrobe: Wardrobe;
  voice: VoiceProfile;
  scene: SceneSettings;
  shots: Shot[];
  branding?: Branding;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export function createEmptyModel(): DoctorModel {
  const now = new Date().toISOString();
  return {
    id: `doc_${Math.random().toString(36).slice(2, 8)}`,
    name: "Dr. Alex Morgan",
    credentials: "MD",
    specialty: "Primary Care",
    bio: "Board-certified physician focused on clear, compassionate patient education.",
    wardrobe: { outfit: "lab_coat", accessories: ["stethoscope", "name_badge"], colorTheme: "#1f6feb" },
    voice: { gender: "neutral", tone: "friendly", speedWpm: 150, accent: "General American" },
    scene: { background: "clinic", framing: "talking_head", lighting: "soft", captions: true },
    shots: [
      {
        id: "intro",
        title: "Intro Greeting",
        objective: "Establish credibility and topic",
        durationSeconds: 8,
        script: "Hello, I?m Dr. Alex Morgan. Today we?ll cover the basics you need to know.",
        onScreenText: "Welcome",
      },
      {
        id: "education",
        title: "Key Education Points",
        objective: "Explain 2?3 concise takeaways",
        durationSeconds: 20,
        script: "First, keep it simple. Second, follow the plan. Finally, ask questions.",
        brollCue: "Cut to relevant diagrams or animations",
      },
      {
        id: "cta",
        title: "Call to Action",
        objective: "Encourage follow-up",
        durationSeconds: 6,
        script: "If you have concerns, reach out to your healthcare provider.",
        onScreenText: "Consult your doctor",
      },
    ],
    branding: { primaryColor: "#1f6feb", secondaryColor: "#8b5cf6" },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function validateModel(model: DoctorModel): string[] {
  const errors: string[] = [];
  if (!model.name.trim()) errors.push("Name is required");
  if (!model.credentials.trim()) errors.push("Credentials are required");
  if (!model.specialty.trim()) errors.push("Specialty is required");
  if (model.voice.speedWpm < 90 || model.voice.speedWpm > 240) errors.push("Voice speed must be 90?240 WPM");
  model.shots.forEach((s, i) => {
    if (!s.title.trim()) errors.push(`Shot ${i + 1} title is required`);
    if (s.durationSeconds <= 0) errors.push(`Shot ${i + 1} duration must be > 0`);
    if (!s.script.trim()) errors.push(`Shot ${i + 1} script is required`);
  });
  if (model.scene.background === "custom" && !model.scene.backgroundUrl) errors.push("Custom background URL required");
  return errors;
}
