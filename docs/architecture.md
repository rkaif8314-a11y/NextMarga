# Architecture Notes

NextMarga is a Vite + React + TypeScript application with a small Express server for AI-backed endpoints. Supabase provides authentication and persistent application data.

## Request flow

1. React screens collect user input.
2. Shared client utilities validate and normalize data before requests.
3. Supabase handles authenticated data access.
4. The Express API handles server-side AI requests and input limits.
5. UI components render loading, success, and fallback states.

## Design principle

Keep provider-specific code behind small modules so UI components remain focused on user experience and can be tested without network access.