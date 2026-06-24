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
  const cleanToken = decodeURIComponent(token || "");

  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const run = async () => {
      if (!cleanToken) {
        setState({ kind: "not_found" });
        return;
      }

      const { data, error } = await supabase
        .from("rsvps")
        .select("name, scanned")
        .eq("qr_token", cleanToken)
        .maybeSingle();

      if (error || !data) {
        setState({ kind: "not_found" });
        return;
      }

      if (data.scanned) {
        setState({ kind: "already", name: data.name });
        return;
      }

      setState({ kind: "ok", name: data.name });
    };

    run();
  }, [cleanToken]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p>جارٍ التحقق...</p>
      </div>
    );
  }

  if (state.kind === "ok") {
    return (
      <div className="min-h-screen w-full">
        <img src={scanSuccess} className="w-full block" />
      </div>
    );
  }

  if (state.kind === "already") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>تم مسحه مسبقًا: {state.name}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>الباركود غير صالح</p>
    </div>
  );
};

export default Scan;