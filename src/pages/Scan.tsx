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
  let isMounted = true;

  const run = async () => {
    if (!cleanToken) {
      if (isMounted) setState({ kind: "not_found" });
      return;
    }

    if (isMounted) setState({ kind: "loading" });

    const { data, error } = await supabase
      .from("rsvps")
      .select("name, scanned")
      .eq("qr_token", cleanToken)
      .maybeSingle();
console.log("TOKEN:", cleanToken);
console.log("DATA:", data);
console.log("ERROR:", error);

    if (!isMounted) return;

    if (error || !data) {
      setState({ kind: "not_found" });
      return;
    }

if (data.scanned) {
  setState({ kind: "already", name: data.name });
  return;
}

// تحديث scanned
const { error: updateError } = await supabase
  .from("rsvps")
  .update({ scanned: true })
  .eq("qr_token", cleanToken);

if (updateError) {
  setState({ kind: "error" });
  return;
}

setState({ kind: "ok", name: data.name });
  };

  run();

  return () => {
    isMounted = false;
  };
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

  if (state.kind === "not_found") {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
      <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">⛔</div>

        <p className="text-red-600 text-2xl font-bold mb-2">
          الباركود غير صالح
        </p>
      </div>
    </div>
  );
}
};

export default Scan;