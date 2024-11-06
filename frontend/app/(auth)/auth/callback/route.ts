import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw error;
      }

      // If you want to check if the user exists in your database
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      // Optional: Update or create user profile
      const { error: profileError } = await supabase
        .from("profiles") // assuming you have a profiles table
        .upsert(
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }

      // Successful authentication
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(
          "Authentication failed. Please try again."
        )}`
      );
    }
  }

  // No code present, redirect to sign-in
  return NextResponse.redirect(
    `${origin}/sign-in?error=${encodeURIComponent(
      "No authentication code provided"
    )}`
  );
}
