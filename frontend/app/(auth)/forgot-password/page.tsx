"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { forgotPasswordAction } from "@/services/actions";
import { toast } from "sonner";

// Loading state component
function ForgotPasswordLoading() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="space-y-1">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

// Main form component
function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        setSuccess(true);
        setError(null);
        toast.success("Check your email for a password reset link");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMsg);
      setSuccess(false);
      toast.error(errorMsg);
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
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert variant="default" className="border-green-500">
              <AlertDescription>
                Check your email for a link to reset your password. If you
                don&apos;t receive it within a few minutes, check your spam
                folder.
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
        {error && !success && (
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

// Main component wrapped in Suspense
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordLoading />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
