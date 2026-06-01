import { useState } from "react";
import invitationImg from "@/assets/invitation.jpg";
import waxSeal from "@/assets/wax-seal.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [opening, setOpening] = useState(false);

  const trigger = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 2100);
  };

  return (
    <div
      className="fixed inset-0 z-40 cursor-pointer overflow-hidden"
      style={{ background: "hsl(30 35% 18%)", perspective: "2000px" }}
      onClick={trigger}
    >
      {/* Revealed invitation underneath */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={invitationImg} alt="" className="max-h-[90vh] w-auto opacity-60" />
      </div>

      {/* Two envelope halves */}
      <div className="absolute inset-0 flex">
        <div
          className="absolute top-0 right-0 h-full w-1/2"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1) 0.08s, box-shadow 2s ease-out 0.08s",
            transform: opening ? "translateX(110%)" : "translateX(0)",
            boxShadow: opening
              ? "-30px 0 60px hsla(0,0%,0%,0.55), inset 8px 0 14px hsla(0,0%,0%,0.35)"
              : "inset 6px 0 18px hsla(0,0%,0%,0.25)",
          }}
        >
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: `url(${invitationImg})`,
              backgroundSize: "200% 100%",
              backgroundPosition: "right center",
              filter: "blur(18px) brightness(0.85)",
            }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, hsla(35,40%,18%,0.55), hsla(35,40%,18%,0.35))" }} />
          </div>
        </div>

        <div
          className="absolute top-0 left-0 h-full w-1/2"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 2s ease-out",
            transform: opening ? "translateX(-110%)" : "translateX(0)",
            boxShadow: opening
              ? "30px 0 60px hsla(0,0%,0%,0.55), inset -8px 0 14px hsla(0,0%,0%,0.35)"
              : "inset -6px 0 18px hsla(0,0%,0%,0.25)",
          }}
        >
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: `url(${invitationImg})`,
              backgroundSize: "200% 100%",
              backgroundPosition: "left center",
              filter: "blur(18px) brightness(0.85)",
            }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(-90deg, hsla(35,40%,18%,0.55), hsla(35,40%,18%,0.35))" }} />
          </div>
        </div>

        {/* Center vertical line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none"
          style={{
            background: "hsla(45, 80%, 70%, 0.55)",
            opacity: opening ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
        />

        {/* Wax seal image - dead center on the envelope fold */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center"
          style={{
            opacity: opening ? 0 : 1,
            transition: "opacity 0.5s ease-out",
          }}
        >
          <div className="animate-float-slow">
            <img
              src={waxSeal}
              alt="ختم الدعوة"
              className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
              style={{
                filter: "drop-shadow(0 14px 40px hsla(35, 60%, 10%, 0.65)) drop-shadow(0 0 25px hsla(45, 90%, 60%, 0.3))",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-arabic animate-pulse z-10"
        style={{ color: "hsla(45, 80%, 80%, 0.9)" }}
      >
        اضغط لفتح الدعوة
      </div>
    </div>
  );
};

export default Envelope;
