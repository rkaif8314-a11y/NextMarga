# Release Checklist

Before a production release:

- Confirm the application builds successfully.
- Verify environment variables are configured in the deployment environment.
- Test authentication and the primary opportunity-discovery flow.
- Check AI endpoints with both configured-provider and fallback behavior.
- Review browser console errors and failed network requests.
- Check mobile navigation and the most important forms.
- Review the final diff for accidental debug code or secrets.

After deployment, verify the health endpoint and one representative user journey.