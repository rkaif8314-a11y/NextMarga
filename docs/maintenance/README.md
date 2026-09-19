# NextMarga Maintenance

Use this guide before changing production-facing code. Review API validation, Supabase access, authentication boundaries, environment variables, and Vercel deployment behavior before merging changes.

## Routine checks
- Run the production build.
- Exercise changed API validation paths with valid and invalid payloads.
- Confirm secrets remain environment-only.
- Review changed database access against Row Level Security.
- Verify the deployed route after release.
