"use client";

import { useState } from "react";
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
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPasswordAction } from "@/services/actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") || null
  );
  const [success, setSuccess] = useState<boolean>(
    searchParams.get("success") === "true"
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await forgotPasswordAction(formData);

      // Parse the URL to check for success or error messages
      const url = new URL(response);
      const searchParams = new URLSearchParams(url.search);

      if (searchParams.get("error")) {
        setError(decodeURIComponent(searchParams.get("error") || ""));
      } else if (searchParams.get("success")) {
        setSuccess(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert variant="default" className="border-green-500">
              <AlertDescription>
                Check your email for a link to reset your password. If you don't
                receive it within a few minutes, check your spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  name="email"
                  required
                />
              </div>
              <Button disabled={isLoading || success} className="w-full">
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {error && (
          <CardFooter>
            <p className="text-sm text-red-600">{error}</p>
          </CardFooter>
        )}
        {success && (
          <CardFooter className="justify-center">
            <Button
              variant="link"
              onClick={() => router.push("/sign-in")}
              className="text-sm text-muted-foreground"
            >
              Return to sign in
            </Button>
          </CardFooter>
        )}
      </Card>

      {!success && (
        <div className="text-sm text-muted-foreground text-center">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
