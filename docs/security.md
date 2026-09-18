# Security Practices

NextMarga should keep secrets and privileged credentials on the server or in the deployment environment.

- Never commit API keys, service-role keys, or production credentials.
- Keep Supabase Row Level Security enabled for protected tables.
- Validate and bound untrusted request payloads at API boundaries.
- Return safe error messages instead of exposing stack traces to clients.
- Review authorization whenever a feature introduces a new data access path.
- Treat opportunity data as untrusted input and verify external claims before publishing them.

Security changes should include a focused regression test or a documented manual verification step.