
import { config } from 'dotenv';
config(); // Ensures .env variables are loaded for a standalone Genkit process if used.

// The primary way flows are used in this Next.js application is by direct
// import into Server Components or Server Actions. Genkit initializes within
// the Next.js process in that case.

// This file is kept minimal to avoid potential conflicts with Next.js HMR
// when the development environment might also be watching Genkit flow files.
// Flows are discovered and used by Next.js through direct imports elsewhere.

console.log('[Unmask AI - src/ai/dev.ts] Genkit dev helper script initialized. Flows are primarily loaded via Next.js direct imports.');
