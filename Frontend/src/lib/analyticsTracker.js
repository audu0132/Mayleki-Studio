/**
 * Privacy-Friendly Analytics Event Tracker
 * Tracks user interactions without third-party tracking cookies.
 */

export const trackEvent = (eventName, properties = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event]: ${eventName}`, properties);
    return;
  }

  // Production dispatcher (sendBeacon or internal endpoint)
  try {
    const payload = JSON.stringify({
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/collect', payload);
    }
  } catch (err) {
    // Fail silently
  }
};
