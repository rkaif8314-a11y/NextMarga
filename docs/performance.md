# Performance Notes

Keep the main student journey fast by limiting unnecessary work during initial render.

- Prefer lazy loading for secondary screens when the current app structure supports it.
- Avoid repeated network requests when existing state is sufficient.
- Keep API payloads bounded and send only fields needed by an endpoint.
- Optimize images and avoid shipping large assets to screens that do not use them.
- Measure before and after significant performance changes instead of optimizing by guesswork.