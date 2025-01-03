"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  resetPasswordSchema,
  signUpSchema,
  verifyOTPSchema,
} from "@/lib/validations/auth";
import { z } from "zod";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  try {
    // Validate form data
    signUpSchema.parse({
      fullName,
      email,
      password,
      confirmPassword: formData.get("confirmPassword"),
    });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: fullName,
          email: formData.get("email") as string,
        },
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return { error: error.message };
    }

    return { success: true, email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    console.error("Sign up error:", error);
    return { error: "An error occurred during sign up. Please try again." };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    throw new Error("Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    console.error("Reset password error:", error);
    throw new Error("Could not reset password");
  }

  // Don't redirect, just return success
  return { success: true };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const code = formData.get("code") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  try {
    // Validate using shared schema
    resetPasswordSchema.parse({ password, confirmPassword });

    // First exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      return {
        error:
          "Invalid or expired reset code. Please request a new reset link.",
      };
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      // Handle same password error specifically
      if (updateError.message.includes("different from the old password")) {
        return {
          error: "New password must be different from your current password",
        };
      }

      // Handle other specific Supabase errors
      if (updateError.status === 422) {
        return {
          error: "Invalid password format. Please try a different password.",
        };
      }

      // Generic error fallback
      return { error: "Failed to reset password. Please try again." };
    }

    // Sign out from all sessions for security
    await supabase.auth.signOut();

    return {
      success: true,
      message:
        "Password updated successfully. Please sign in with your new password.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      scopes: "email profile",
      skipBrowserRedirect: false,
    },
  });

  if (error) {
    console.error("Supabase OAuth error:", error);
    return redirect("/sign-in?error=" + encodeURIComponent(error.message));
  }

  return redirect(data.url);
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const verifyOTPAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const supabase = await createClient();

  try {
    // Validate the input
    verifyOTPSchema.parse({ email, otp });

    // Verify the OTP code with Supabase
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (error) {
      console.error("OTP verification error:", error);
      return { error: error.message };
    }

    // If verification is successful
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    console.error("Verification error:", error);
    return { error: "Failed to verify code. Please try again." };
  }
};

// Resend OTP action in case user needs a new code
export const resendOTPAction = async (email: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { error: "Failed to resend verification code. Please try again." };
  }
};
