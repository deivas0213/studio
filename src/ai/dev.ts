
import { config } from 'dotenv';
config(); // Ensures .env variables are loaded for the standalone Genkit process if used.

// The primary way flows are used in this Next.js application is by direct
// import into Server Components or Server Actions. Genkit initializes within
// the Next.js process in that case.
//
// Running `genkit start --watch src/ai/dev.ts` (or a similar command by the dev environment)
// alongside `next dev` can sometimes lead to conflicts if both processes are watching
// and reacting to changes in flow files.
// To potentially mitigate such issues, the direct import of flows here is commented out.
// The Next.js application itself will still load and use the flows as intended.
// If you are using the Genkit Developer UI (via `genkit start`) and need flows to
// appear there explicitly through this file, you might need to uncomment these lines,
// but be aware of potential HMR (Hot Module Replacement) conflicts with Next.js.

// import '@/ai/flows/get-usage-insights.ts';
// import '@/ai/flows/analyze-image.ts';

console.log('[Unmask AI - src/ai/dev.ts] Genkit dev helper script initialized. Flows are primarily loaded via Next.js direct imports.');
