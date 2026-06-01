import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import scanSuccess from "@/assets/scan-success.jpeg";

type State =
  | { kind: "loading" }
  | { kind: "ok"; name: string }
  | { kind: "already"; name: string }
  | { kind: "not_found" }
  | { kind: "error" };

const Scan = () => {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "not_found" });
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("scan_rsvp", { _token: token });
      if (error || !data || data.length === 0) {
        setState({ kind: "error" });
        return;
      }
      const row = data[0] as { result: string; guest_name: string };
      if (row.result === "ok") setState({ kind: "ok", name: row.guest_name });
      else if (row.result === "already") setState({ kind: "already", name: row.guest_name });
      else setState({ kind: "not_found" });
    })();
  }, [token]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(40 50% 92%)" }}>
        <p className="font-arabic text-lg" style={{ color: "hsl(38 65% 30%)" }}>جارٍ التحقق...</p>
      </div>
    );
  }

  if (state.kind === "ok") {
    return (
      <div className="min-h-screen w-full">
        <img src={scanSuccess} alt="تم تأكيد حضورك" className="w-full h-auto block" />
      </div>
    );
  }

  if (state.kind === "already") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(40 50% 92%)" }}>
        <div
          className="max-w-md w-full text-center rounded-2xl p-8"
          style={{
            background: "white",
            border: "2px solid hsl(0 70% 55%)",
            boxShadow: "0 10px 40px hsla(0,0%,0%,0.15)",
          }}
        >
          <div
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: "hsl(0 70% 55%)", color: "white", fontSize: 42 }}
          >
            ✕
          </div>
          <p className="font-arabic text-2xl mb-2" style={{ color: "hsl(0 70% 40%)", fontWeight: 700 }}>
            تم مسح الباركود مسبقاً
          </p>
          {state.name && (
            <p className="font-arabic text-base" style={{ color: "hsl(30 30% 30%)" }}>
              الاسم: {state.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(40 50% 92%)" }}>
      <p className="font-arabic text-lg" style={{ color: "hsl(0 70% 40%)" }}>
        الباركود غير صالح
      </p>
    </div>
  );
};

export default Scan;
