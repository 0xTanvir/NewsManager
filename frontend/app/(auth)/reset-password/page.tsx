"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordAction } from "@/services/actions";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { Skeleton } from "@/components/ui/skeleton";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  // Get reset code from URL
  const code = searchParams.get("code");
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  // Handle status messages
  useEffect(() => {
    if (status && message) {
      const decodedMessage = decodeURIComponent(message);
      if (status === "error") {
        toast.error(decodedMessage);
      } else if (status === "success") {
        setSuccess(true);
        toast.success(decodedMessage);
        if (decodedMessage.includes("Password updated")) {
          setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        }
      }
      // Clean up URL params
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("status");
      newUrl.searchParams.delete("message");
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [status, message, router]);

  // Redirect if no reset code is present
  useEffect(() => {
    if (!code) {
      toast.error("Invalid or missing reset code");
      router.push("/forgot-password");
    }
  }, [code, router]);

  // Handle the "Request new reset link" click
  const handleRequestNewLink = async () => {
    // Sign out first to clear any existing session
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/forgot-password");
  };

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

      if ("error" in result && result.error) {
        setValidationErrors([result.error]);
        toast.error(result.error);
      } else if ("success" in result && result.success) {
        setSuccess(true);
        toast.success(result.message);
        // Redirect to sign-in after successful password reset
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setValidationErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!code) {
    return null; // Don't render the form if there's no reset code
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been updated successfully. You will be redirected
            to the sign in page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-500">
            <AlertDescription>
              Password updated successfully. Redirecting to sign in page...
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" onClick={() => router.push("/sign-in")}>
            Go to sign in
          </Button>
        </CardFooter>
      </Card>
    );
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
          onClick={handleRequestNewLink}
          disabled={isLoading}
        >
          Request new reset link
        </Button>
      </CardFooter>
    </Card>
  );
}

// Loading component using Skeleton
function ResetPasswordLoading() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[150px]" />
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
