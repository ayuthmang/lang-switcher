import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";

const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
  throw new Error(
    "SESSION_SECRET must be set in production. See .env.example.",
  );
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [sessionSecret ?? "insecure-development-secret"],
    // The domain is left unset so the cookie binds to whichever host is
    // serving the app, which is what we want on every environment.
    ...(isProduction ? { secure: true } : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
