import Reveal from "./Reveal";

const events = [
  { time: "7:30 PM", label: "الاستقبال" },
  { time: "10:00 PM", label: "الزفة" },
  { time: "1:30 AM", label: "العشاء" },
];

const Timeline = () => {
  return (
    <div className="relative max-w-2xl mx-auto py-8">
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
        style={{ background: "hsl(80 25% 45% / 0.4)" }}
      />
      <div className="space-y-16">
        {events.map((e, i) => (
          <Reveal key={i} delay={i * 150}>
            <div className="relative flex items-center justify-center">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10"
                style={{
                  background: "hsl(80 25% 95%)",
                  border: "2px solid hsl(80 25% 35%)",
                  boxShadow: "0 0 0 6px hsl(80 25% 95% / 0.4)",
                }}
              />
              <div className="grid grid-cols-2 w-full gap-8">
                {/* RTL: first col on right -> time, second col on left -> label */}
                <div className="text-right pr-10 font-display text-2xl text-primary" dir="ltr" style={{ textAlign: "right" }}>
                  {e.time}
                </div>
                <div className="text-left pl-10 font-arabic text-2xl text-primary">
                  {e.label}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Timeline;