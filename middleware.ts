import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export default clerkMiddleware((auth, request)=>{
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  console.log(pathname)
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  const isPublicRoute = createRouteMatcher([`/${locale}`,"/"]);
  if(!isPublicRoute(request)) auth().protect();

  // const isProtectedRoute = createRouteMatcher([`/${locale}/(.*)`]);
  // if (isProtectedRoute(request)) auth().protect();

    // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // If you have one
  if (
    [
      '/next.svg',
      '/vercel.svg',
      '/favicon.ico',
      // Your other files in `public`
    ].includes(pathname)
  )
    return

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    
    console.log(locale)
  
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

});


// export const config = {
//   // Matcher ignoring `/_next/` and `/api/`
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/(api|trpc)(.*)"], 
// };
export const config = {
  matcher: ["/((?!.*\\..*|_next/static|_next/image|favicon.ico).*)", "/(api|trpc)(.*)"],
};