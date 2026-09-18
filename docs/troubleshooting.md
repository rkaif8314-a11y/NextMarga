# Troubleshooting

## Build fails

Remove stale dependencies only when the error indicates a dependency mismatch, then reinstall from the lockfile and rerun the production build.

## AI responses are unavailable

Check that the required server-side AI environment variable is configured in the runtime. The application should retain a deterministic fallback path when the provider is unavailable.

## Supabase requests fail

Check the configured project URL and client key, then verify authentication state and database policies. Do not bypass Row Level Security as a debugging shortcut.

## UI behaves differently in production

Compare environment configuration and build output, then reproduce the affected route with browser console and network errors visible.