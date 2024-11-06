// components/Header.tsx
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./UserNav";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6" />
          <span className="font-bold text-lg">YPigeon</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <ThemeSwitcher />

          {!hasEnvVars ? (
            <div className="flex gap-4 items-center">
              <Badge
                variant="default"
                className="font-normal pointer-events-none"
              >
                Please update your configuration
              </Badge>
              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  disabled
                  className="opacity-75 cursor-none pointer-events-none"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="default"
                  disabled
                  className="opacity-75 cursor-none pointer-events-none"
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </div>
          ) : user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
