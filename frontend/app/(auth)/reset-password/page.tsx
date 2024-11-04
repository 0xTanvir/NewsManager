"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordAction } from "@/services/actions";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get reset code, status and message from URL
  const code = searchParams.get("code");
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  // Handle status messages
  useEffect(() => {
    if (status && message) {
      if (status === "error") {
        toast.error(decodeURIComponent(message));
      } else if (status === "success") {
        toast.success(decodeURIComponent(message));
        if (message.includes("Password updated")) {
          setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        }
      }
    }
  }, [status, message, router]);

  // Redirect if no reset code is present
  useEffect(() => {
    if (!code) {
      toast.error("Invalid or missing reset code");
      router.push("/forgot-password");
    }
  }, [code, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setValidationErrors([]);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      // Validate the input
      resetPasswordSchema.parse({ password, confirmPassword });

      // Add the reset code to the form data
      if (code) {
        formData.set("code", code);
      }

      // Submit the form
      const result = await resetPasswordAction(formData);

      // If the action returns a response (it might redirect instead)
      if (result) {
        const url = new URL(result);
        const status = url.searchParams.get("status");
        const message = url.searchParams.get("message");

        if (status === "error" && message) {
          toast.error(decodeURIComponent(message));
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map((err) => err.message));
      } else {
        toast.error("An error occurred while resetting your password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!code) {
    return null; // Don't render the form if there's no reset code
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              name="password"
              required
              className={validationErrors.length > 0 ? "border-red-500" : ""}
              autoComplete="new-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isLoading}
              name="confirmPassword"
              required
              className={validationErrors.length > 0 ? "border-red-500" : ""}
              autoComplete="new-password"
            />
          </div>
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/sign-in")}
          disabled={isLoading}
        >
          Back to sign in
        </Button>
        <Button
          variant="link"
          onClick={() => router.push("/forgot-password")}
          disabled={isLoading}
        >
          Request new reset link
        </Button>
      </CardFooter>
    </Card>
  );
}
