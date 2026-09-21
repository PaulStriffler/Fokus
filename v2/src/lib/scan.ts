export type ScanResult = { todos: string[]; done: string[]; thoughts: string[] };

const SYSTEM_PROMPT = `Du bist ein präziser Assistent, der Fotos von handgeschriebenen Whiteboards / Planungs-Boards ausliest.
Auf dem Board gibt es typischerweise Bereiche wie "To-Do", "Aufgaben", "Gedanken" oder "Notizen".
Lies alles sorgfältig und ordne es zu:
- "todos": offene Aufgaben, die NICHT durchgestrichen oder abgehakt sind
- "done": Aufgaben, die durchgestrichen, abgehakt oder als erledigt markiert sind
- "thoughts": Gedanken, Notizen, Journal-Einträge (z. B. aus einer "Gedanken"-Sektion) — jeweils als ein Eintrag pro Zeile/Gedanke
Antworte AUSSCHLIESSLICH mit gültigem JSON in genau diesem Format, ohne Erklärung, ohne Markdown:
{"todos": ["..."], "done": ["..."], "thoughts": ["..."]}
Wenn ein Bereich leer ist, gib ein leeres Array zurück.`;

function extractJson(text: string): Partial<ScanResult> {
  let t = text.trim();
  // Markdown-Fences entfernen
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return {};
  }
}

/** Ruft Claude Vision direkt aus dem Browser auf. apiKey liegt nur lokal. */
export async function scanBoard(
  imageBase64: string,
  mediaType: string,
  apiKey: string
): Promise<ScanResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-5",
      max_tokens: 2048,
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "Lies dieses Board aus und gib das JSON zurück." },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message || "";
    } catch {}
    if (res.status === 401) throw new Error("API-Key ungültig. Bitte in den Einstellungen prüfen.");
    if (res.status === 400 && /credit|balance/i.test(detail))
      throw new Error("Kein Guthaben auf deinem Anthropic-Konto. Bitte auflösen/aufladen.");
    throw new Error(`Fehler ${res.status}${detail ? ": " + detail : ""}`);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");
  const json = extractJson(text);
  return {
    todos: Array.isArray(json.todos) ? json.todos : [],
    done: Array.isArray(json.done) ? json.done : [],
    thoughts: Array.isArray(json.thoughts) ? json.thoughts : [],
  };
}

/** Datei -> {base64, mediaType} (ohne data:-Präfix). */
export function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      const base64 = result.slice(comma + 1);
      const mediaType = result.slice(5, result.indexOf(";"));
      resolve({ base64, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
