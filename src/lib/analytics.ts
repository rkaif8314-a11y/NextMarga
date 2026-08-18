import { supabase } from './supabase';

const SESSION_KEY = 'nextmarga_analytics_session';

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export async function trackEvent(
  eventName: string,
  options: {
    screen?: string;
    opportunityId?: string;
    applicationId?: string;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<void> {
  try {
    await supabase.rpc('track_analytics_event', {
      p_event_name: eventName,
      p_screen: options.screen ?? null,
      p_opportunity_id: options.opportunityId ?? null,
      p_application_id: options.applicationId ?? null,
      p_session_id: getSessionId(),
      p_metadata: options.metadata ?? {},
    });
  } catch (error) {
    // Analytics must never block the product experience.
    console.warn('Analytics event failed:', error);
  }
}
