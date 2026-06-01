import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, X, Send, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Reveal from "./Reveal";

// 👈 عدّل رقم الواتساب هنا (بصيغة دولية بدون + أو 00). مثال السعودية: 9665XXXXXXXX
const HOST_WHATSAPP = "966554129943";

type State =
  | { kind: "form" }
  | { kind: "loading" }
  | { kind: "attending"; name: string; token: string }
  | { kind: "declined"; name: string }
  | { kind: "error"; msg: string };

const RSVP = () => {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState<"attending" | "declined" | null>(null);
  const [state, setState] = useState<State>({ kind: "form" });

  const submit = async () => {
    if (!name.trim() || !choice) return;
    setState({ kind: "loading" });
    // Generate a fresh device id for every submission so the same phone can register multiple times
    const deviceId = crypto.randomUUID();
    const token = choice === "attending" ? crypto.randomUUID() : null;

    const { data, error } = await supabase
  .from("invites")
  .insert({
    name: name.trim(),
    status: "attending", // نخليه ثابت للتجربة
    device_id: deviceId,
    qr_token: token ?? null,
    used: false
  });

console.log("SUPABASE ERROR:", error);
console.log("SUPABASE DATA:", data);

    if (error) {
      setState({ kind: "error", msg: "حدث خطأ، حاول مرة أخرى" });
      return;
    }

    if (choice === "attending" && token) {
      setState({ kind: "attending", name: name.trim(), token });
      // Delay so user sees the QR before being redirected to WhatsApp
      setTimeout(() => sendWhatsApp("attending", name.trim()), 8000);
    } else {
      setState({ kind: "declined", name: name.trim() });
      setTimeout(() => sendWhatsApp("declined", name.trim()), 4000);
    }
  };

  const sendWhatsApp = (status: "attending" | "declined", guestName: string) => {
    const text =
      status === "attending"
        ? `🌸 تأكيد حضور حفل زفاف راشد و سارة\nالاسم: ${guestName}\nالحالة: سأحضر بإذن الله`
        : `🌸 رد على دعوة حفل زفاف راشد و سارة\nالاسم: ${guestName}\nالحالة: للأسف لن أتمكن من الحضور`;
    const url = `https://wa.me/${HOST_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  // ===== Render states =====

  if (state.kind === "attending") {
    return (
      <Reveal>
        <div
          className="mx-auto max-w-md rounded-2xl p-8 text-center backdrop-blur-md"
          style={{
            background: "hsla(40, 50%, 95%, 0.7)",
            border: "2px solid hsl(42 75% 55%)",
            boxShadow: "var(--shadow-elegant), 0 0 40px hsl(42 80% 60% / 0.3)",
          }}
        >
          <div className="font-arabic text-2xl text-primary mb-2" style={{ fontWeight: 700 }}>
            تم تأكيد حضورك بنجاح 🌸
          </div>
          <div className="font-arabic text-base text-primary mb-2">
            أهلاً وسهلاً، {state.name}
          </div>
          <p className="font-arabic text-sm text-muted-foreground mb-6">
            هذا الباركود الخاص بك — يُمسح مرة واحدة عند الدخول
          </p>
          <div
            className="inline-block p-5 rounded-xl"
            style={{
              background: "white",
              border: "2px solid hsl(42 75% 55%)",
              boxShadow: "0 0 30px hsl(42 80% 60% / 0.4)",
            }}
          >
            <QRCodeSVG
              value={`${window.location.origin}/scan/${state.token}`}
              size={200}
              level="H"
              fgColor="hsl(38, 65%, 30%)"
              bgColor="white"
            />
          </div>
          <div
            className="mt-5 rounded-xl px-4 py-3 font-arabic text-sm"
            style={{
              background: "hsla(0, 70%, 55%, 0.1)",
              border: "1.5px solid hsl(0 70% 55% / 0.6)",
              color: "hsl(0 70% 35%)",
              fontWeight: 600,
            }}
          >
            ⚠️ يرجى حفظ الباركود لأنه مطلوب عند الدخول
          </div>
          <p className="font-arabic text-xs text-muted-foreground mt-3">
            سيتم تحويلك إلى الواتساب خلال لحظات لإرسال التأكيد...
          </p>
        </div>
      </Reveal>
    );
  }

  if (state.kind === "declined") {
    return (
      <Reveal>
        <div
          className="mx-auto max-w-md rounded-2xl p-8 text-center backdrop-blur-md"
          style={{
            background: "hsla(40, 50%, 95%, 0.7)",
            border: "1.5px solid hsl(42 75% 55% / 0.5)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <Heart className="mx-auto w-10 h-10 mb-3" style={{ color: "hsl(0 70% 55%)", fill: "hsl(0 70% 55%)" }} />
          <p className="font-arabic text-xl text-primary leading-loose">
            نقدّر اعتذارك يا {state.name} ❤️
            <br />
            ونراك في مناسبة أخرى بإذن الله
          </p>
          <button
            onClick={() => sendWhatsApp("declined", state.name)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-arabic text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(142 70% 45%), hsl(142 65% 35%))",
              color: "white",
              boxShadow: "0 4px 14px hsl(142 60% 30% / 0.4)",
            }}
          >
            <Send className="w-4 h-4" />
            أرسل الاعتذار عبر واتساب
          </button>
        </div>
      </Reveal>
    );
  }

  // Form
  return (
    <Reveal>
      <div
        className="mx-auto max-w-md rounded-2xl p-8 backdrop-blur-md"
        style={{
          background: "hsla(40, 50%, 95%, 0.6)",
          border: "1.5px solid hsl(42 75% 55% / 0.5)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <label className="block font-arabic text-sm text-primary mb-2 text-right">
          الاسم الكريم
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="اكتب اسمك هنا"
          className="w-full px-4 py-3 rounded-xl font-arabic text-right outline-none transition-colors"
          style={{
            background: "hsla(40, 50%, 98%, 0.8)",
            border: "1.5px solid hsl(42 60% 60% / 0.6)",
            color: "hsl(30 35% 22%)",
          }}
          dir="rtl"
        />

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={() => setChoice("attending")}
            className="py-3 rounded-xl font-arabic text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background:
                choice === "attending"
                  ? "linear-gradient(135deg, hsl(45 80% 65%), hsl(38 70% 45%))"
                  : "hsla(40, 50%, 98%, 0.6)",
              color: choice === "attending" ? "hsl(30 40% 18%)" : "hsl(38 65% 38%)",
              border: "1.5px solid hsl(42 75% 55%)",
              boxShadow: choice === "attending" ? "0 0 20px hsl(42 80% 60% / 0.5)" : "none",
            }}
          >
            <Check className="w-4 h-4" />
            تأكيد الحضور
          </button>
          <button
            onClick={() => setChoice("declined")}
            className="py-3 rounded-xl font-arabic text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background:
                choice === "declined"
                  ? "hsl(30 30% 35%)"
                  : "hsla(40, 50%, 98%, 0.6)",
              color: choice === "declined" ? "hsl(40 50% 95%)" : "hsl(30 25% 35%)",
              border: "1.5px solid hsl(30 30% 50%)",
            }}
          >
            <X className="w-4 h-4" />
            الاعتذار
          </button>
        </div>

        <button
          onClick={submit}
          disabled={!name.trim() || !choice || state.kind === "loading"}
          className="w-full mt-5 py-3 rounded-xl font-arabic text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, hsl(45 80% 65%), hsl(38 70% 42%))",
            color: "hsl(30 40% 18%)",
            boxShadow: "0 4px 20px hsl(42 80% 50% / 0.45)",
            fontWeight: 700,
          }}
        >
          <Send className="w-4 h-4" />
          {state.kind === "loading" ? "جارٍ الإرسال..." : "إرسال"}
        </button>

        {state.kind === "error" && (
          <p className="font-arabic text-sm text-center mt-3" style={{ color: "hsl(0 70% 45%)" }}>
            {state.msg}
          </p>
        )}
      </div>
    </Reveal>
  );
};

export default RSVP;
