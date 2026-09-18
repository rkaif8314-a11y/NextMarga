# Environment Configuration

Keep local environment configuration separate from committed source code.

## Local setup

Create the environment file expected by the application and provide only the variables required by the current features. Keep production values in the deployment provider's secret store.

When adding a new environment variable:

1. Document its purpose.
2. Add a safe example name to setup documentation if useful.
3. Validate missing configuration with a clear startup or request-time message.
4. Never commit the real value.