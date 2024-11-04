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
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import { signInAction, signInWithGoogleAction } from "@/services/actions";
import { toast } from "sonner";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle URL parameters for status messages and errors
  useEffect(() => {
    // Check for status/message parameters
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    // Check for direct error parameter
    const errorParam = searchParams.get("error");

    if (errorParam) {
      // Handle direct error parameter
      toast.error(decodeURIComponent(errorParam));
      router.replace("/sign-in");
    } else if (status && message) {
      // Handle status/message combination
      const decodedMessage = decodeURIComponent(message);
      if (status === "error") {
        toast.error(decodedMessage);
      } else if (status === "success") {
        toast.success(decodedMessage);
      }
      router.replace("/sign-in");
    }
  }, [searchParams, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await signInAction(formData);
    } catch (error) {
      if (error instanceof Error) {
        try {
          // Extract error message from the URL in the error
          const errorUrl = new URL(error.message, window.location.origin);
          const errorMessage = errorUrl.searchParams.get("error");
          if (errorMessage) {
            toast.error(decodeURIComponent(errorMessage));
          } else {
            toast.error("An unexpected error occurred");
          }
        } catch {
          toast.error("An unexpected error occurred");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
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
                disabled={isLoading}
                name="password"
                required
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
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
          onClick={handleGoogleSignIn}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

// Loading component using Skeleton from shadcn/ui
function SignInLoading() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[40px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[70px]" />
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
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[180px]" />
      </CardFooter>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
