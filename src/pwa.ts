/**
 * PWA recovery/cleanup.
 *
 * NextMarga previously used a service worker that could retain an older
 * application shell or asset response. That can make one browser profile
 * render the React markup while CSS/JS appears broken after a deployment.
 *
 * Until the asset cache is proven stable, deliberately unregister any old
 * service worker and remove its caches. This is safe for the web app and
 * prevents stale HTML from being returned for CSS/JS requests.
 */
export function registerPWA(): void {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    void navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(
        registrations.map((registration) => registration.unregister()),
      ))
      .catch((error) => {
        console.warn('PWA service worker cleanup failed:', error);
      });

    if ('caches' in window) {
      void caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch((error) => {
          console.warn('PWA cache cleanup failed:', error);
        });
    }
  });
}
