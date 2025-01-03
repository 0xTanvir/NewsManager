import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect authenticated users from auth pages
    // Exclude reset-password page from this check
    if (
      user &&
      (request.nextUrl.pathname === "/sign-in" ||
        request.nextUrl.pathname === "/sign-up" ||
        request.nextUrl.pathname === "/forgot-password") &&
      !request.nextUrl.pathname.startsWith("/reset-password")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow access to reset-password from auth callback or with code
    if (
      request.nextUrl.pathname === "/reset-password" &&
      !request.nextUrl.searchParams.has("code")
    ) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }

    // If user directly hits root, redirect appropriately
    if (request.nextUrl.pathname === "/") {
      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return response;
  } catch (e) {
    // If Supabase client couldn't be created
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
