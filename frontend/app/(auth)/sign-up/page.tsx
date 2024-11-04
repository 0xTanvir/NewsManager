"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { signUpSchema } from "@/lib/validations/auth";
import {
  signUpAction,
  signInWithGoogleAction,
  verifyOTPAction,
  resendOTPAction,
} from "@/services/actions";
import { toast } from "sonner";
import { z } from "zod";

// Loading state components
function SignUpLoading() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <Skeleton className="h-[1px] w-full" />
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-[250px]" />
      </CardFooter>
    </Card>
  );
}

// Client Components
function SignUpFormWrapper() {
  const searchParams = useSearchParams();
  return (
    <SignUpFormContent
      verify={searchParams.get("verify")}
      email={searchParams.get("email")}
    />
  );
}

function SignUpFormContent({
  verify,
  email,
}: {
  verify: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [otp, setOtp] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Separate useEffect for resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setValidationErrors([]);

    const formData = new FormData(event.currentTarget);

    try {
      // Validate form data
      signUpSchema.parse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });

      // Submit the form to server action
      const result = await signUpAction(formData);

      if (result.error) {
        setValidationErrors([result.error]);
      } else if (result.success) {
        router.push(
          `/sign-up?verify=true&email=${encodeURIComponent(result.email)}`
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map((err) => err.message));
      } else {
        toast.error("An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || resendDisabled) return;

    setResendDisabled(true);
    setResendCountdown(60);

    const result = await resendOTPAction(email);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("New verification code sent to your email");
    }
  };

  const handleVerifyOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setValidationErrors([]);

    const formData = new FormData(event.currentTarget);
    formData.set("email", email || "");
    formData.set("otp", otp);

    try {
      const result = await verifyOTPAction(formData);

      if (result.error) {
        setValidationErrors([result.error]);
      } else if (result.success) {
        toast.success("Email verified successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      setValidationErrors([
        error instanceof Error
          ? error.message
          : "Failed to verify code. Please try again.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (verify) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={isLoading || otp.length !== 6}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify Email
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={resendDisabled}
                onClick={handleResendOTP}
                className="mt-2"
              >
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : "Resend verification code"}
              </Button>
            </div>
          </form>
        </CardContent>
        {validationErrors.length > 0 && (
          <CardFooter>
            <Alert variant="destructive">
              <AlertDescription>{validationErrors[0]}</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                name="fullName"
                required
              />
            </div>
            <div className="grid gap-1">
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
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                name="password"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                name="confirmPassword"
                required
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
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true);
              await signInWithGoogleAction();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "An error occurred during Google sign in"
              );
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// Main component
export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpLoading />}>
      <SignUpFormWrapper />
    </Suspense>
  );
}
