"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const supabase = await createClient();

    // Insert the contact form submission into Supabase
    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: "new", // You can use this to track submission status
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    // Optionally send an email notification
    // You could integrate with services like Resend, SendGrid, etc.

    revalidatePath("/contact");
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Failed to submit the form. Please try again.",
    };
  }
}
