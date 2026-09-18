# PWA Notes

NextMarga includes Progressive Web App support through its web manifest and service worker.

When changing installability or caching behavior, verify:

- The manifest remains valid and describes the application correctly.
- App icons resolve successfully.
- The service worker does not cache sensitive authenticated responses.
- A newly deployed version can update without leaving users on stale application code indefinitely.
- Offline behavior is explicit: cached UI should not imply that time-sensitive opportunity data is current.