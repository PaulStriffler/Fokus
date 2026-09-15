"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Bar } from "@/components/ui/Bar";
import { useStore, type Course } from "@/lib/store";
import { spring } from "@/lib/motion";

function courseProgress(c: Course) {
  const lessons = c.modules.flatMap((m) => m.lessons);
  const done = lessons.filter((l) => l.done).length;
  return { done, total: lessons.length, ratio: lessons.length ? done / lessons.length : 0 };
}

export function Academy() {
  const courses = useStore((s) => s.courses);
  const toggleLesson = useStore((s) => s.toggleLesson);

  return (
    <div className="flex flex-col gap-4">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} onToggle={toggleLesson} />
      ))}
    </div>
  );
}

function CourseCard({
  course,
  onToggle,
}: {
  course: Course;
  onToggle: (c: string, m: string, l: string) => void;
}) {
  const [openModule, setOpenModule] = useState<string | null>(course.modules[0]?.id ?? null);
  const p = courseProgress(course);

  return (
    <Card>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="t-title3">{course.title}</span>
        <span className="t-callout font-[650] tabular" style={{ color: course.color }}>
          {p.done}/{p.total}
        </span>
      </div>
      <div className="t-foot text-[var(--text-3)] mb-3">{course.subtitle}</div>
      <Bar progress={p.ratio} color={course.color} className="mb-4" />

      <div className="flex flex-col gap-1">
        {course.modules.map((m) => {
          const isOpen = openModule === m.id;
          const mDone = m.lessons.filter((l) => l.done).length;
          return (
            <div key={m.id} className="rounded-[var(--r-sm)] overflow-hidden">
              <button
                onClick={() => setOpenModule(isOpen ? null : m.id)}
                className="flex w-full items-center gap-2 py-2.5 text-left"
              >
                <ChevronDown
                  size={16}
                  className="shrink-0 text-[var(--text-3)] transition-transform"
                  style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                />
                <span className="flex-1 t-callout font-[560]">{m.title}</span>
                <span className="t-foot text-[var(--text-3)] tabular">
                  {mDone}/{m.lessons.length}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={spring}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pb-2 pl-6">
                      {m.lessons.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => onToggle(course.id, m.id, l.id)}
                          className="flex items-center gap-2.5 py-2 text-left"
                        >
                          <span
                            className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors"
                            style={{
                              borderColor: l.done ? course.color : "var(--border-strong)",
                              background: l.done ? course.color : "transparent",
                            }}
                          >
                            {l.done && <Check size={11} strokeWidth={3} className="text-white" />}
                          </span>
                          <span
                            className="t-callout transition-colors"
                            style={{
                              color: l.done ? "var(--text-3)" : "var(--text-2)",
                              textDecoration: l.done ? "line-through" : "none",
                            }}
                          >
                            {l.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
