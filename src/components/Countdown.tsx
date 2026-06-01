import { useEffect, useState } from "react";

const TARGET = new Date("2026-07-07T19:30:00+03:00").getTime();

const Countdown = () => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hours" },
    { v: t.m, l: "Minutes" },
    { v: t.s, l: "Seconds" },
  ];

  return (
    <div dir="ltr" className="flex justify-center gap-3 sm:gap-6">
      {items.map((it) => (
        <div
          key={it.l}
          className="flex flex-col items-center justify-center rounded-xl px-4 sm:px-6 py-4 min-w-[70px] sm:min-w-[90px] backdrop-blur-md"
          style={{
            background: "hsla(60, 25%, 95%, 0.4)",
            border: "1px solid hsl(80 25% 45% / 0.3)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="font-display text-3xl sm:text-4xl font-light text-primary tabular-nums">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="text-xs uppercase tracking-widest mt-1 text-muted-foreground">
            {it.l}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;