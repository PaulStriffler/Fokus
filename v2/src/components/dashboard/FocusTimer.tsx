"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { spring } from "@/lib/motion";

const PRESETS = [25, 45, 60];

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

export function FocusTimer() {
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(ref.current!);
          setRunning(false);
          setFinished(true);
          beep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const setPreset = (min: number) => {
    if (running) return;
    setDuration(min * 60);
    setRemaining(min * 60);
    setFinished(false);
  };
  const toggle = () => {
    if (remaining === 0) return;
    setFinished(false);
    setRunning((r) => !r);
  };
  const reset = () => {
    setRunning(false);
    setRemaining(duration);
    setFinished(false);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = duration ? remaining / duration : 0;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Timer size={17} style={{ color: "var(--teal)" }} />
        <span className="t-headline">Fokus-Timer</span>
        {finished && <span className="ml-auto t-foot font-[650]" style={{ color: "var(--green)" }}>Session geschafft ✓</span>}
      </div>

      <div className="flex items-center gap-5">
        <Ring progress={progress} size={104} stroke={9} color={finished ? "var(--green)" : "var(--teal)"}>
          <div className="t-title2 tabular leading-none">
            {mm}:{ss}
          </div>
        </Ring>

        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => setPreset(m)}
                disabled={running}
                className="flex-1 h-9 rounded-[var(--r-sm)] border t-foot font-[650] transition-colors disabled:opacity-40"
                style={{
                  borderColor: duration === m * 60 ? "var(--teal)" : "var(--border)",
                  background: duration === m * 60 ? "color-mix(in srgb, var(--teal) 14%, transparent)" : "var(--surface-2)",
                  color: duration === m * 60 ? "var(--teal)" : "var(--text-2)",
                }}
              >
                {m}m
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={spring}
              onClick={toggle}
              className="flex flex-1 items-center justify-center gap-2 h-11 rounded-[var(--r-sm)] font-[650] text-white"
              style={{ background: "var(--teal)" }}
            >
              {running ? <><Pause size={17} /> Pause</> : <><Play size={17} /> Start</>}
            </motion.button>
            <button onClick={reset} aria-label="Zurücksetzen" className="grid h-11 w-11 place-items-center rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)]">
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
