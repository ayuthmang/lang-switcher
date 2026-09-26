import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

// The preset rewrites the server build into Vercel's Build Output API layout
// (build/server/<runtime>_<hash>/), which `@react-router/serve` cannot run.
// Applying it only on Vercel keeps `pnpm build && pnpm start` working locally.
// CI exercises this branch with `VERCEL=1 pnpm build`.
const isVercel = Boolean(process.env.VERCEL);

export default {
  ssr: true,
  // Build-time only: the preset's runtime entry server is injected solely for
  // `edge` routes, and this app has none. Add an edge route and
  // @vercel/react-router must move to dependencies.
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config;
