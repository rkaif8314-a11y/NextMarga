# Project Structure Guide

The repository is organized around the student experience and shared application utilities.

- `src/components/` — reusable UI building blocks.
- `src/screens/` — larger user-facing flows and pages.
- `src/lib/` — shared application logic and integrations.
- `public/` — static assets and PWA resources.
- `supabase/` — database and Supabase-related project configuration.
- `server.ts` — server-side API boundary for backend functionality.

Keep reusable logic out of individual screens when it is genuinely shared, while avoiding abstractions that make a one-off feature harder to understand.