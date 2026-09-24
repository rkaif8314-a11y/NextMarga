# Security notes

## Deployment

- Keep `GEMINI_API_KEY` in Vercel environment variables only; never commit it.
- Keep Supabase service-role credentials server-side. Browser code must use only the publishable/anon key.
- Treat profile, application, and assessment data as private student data.

## API safety

The deployed `/api/*` functions validate request methods, authenticate users, and bound user-controlled text before sending it to an AI provider. Rate limits and request timeouts should remain enabled for AI endpoints. AI responses must be treated as untrusted output and validated before being used as structured data.

## Reporting

For a suspected security issue, do not publish credentials or private student data in an issue. Rotate exposed credentials first and report the issue privately to the repository owner.
