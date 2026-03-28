import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CancelForm from "./cancel-form";

export const dynamic = "force-dynamic";

export default async function CancelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center p-4 sm:p-8 lg:p-10">
      <div className="w-full max-w-lg">
        <CancelForm
          plan={subscription?.plan || "free"}
          status={subscription?.status || "active"}
          currentPeriodEnd={subscription?.current_period_end || null}
        />
      </div>
    </div>
  );
}
