(() => {
  const script = document.currentScript;
  const measurementId = script?.dataset.googleAnalyticsId;
  const posthogProjectToken = script?.dataset.posthogProjectToken;
  const posthogHost = script?.dataset.posthogHost || "https://us.i.posthog.com";
  const ahrefsKey = script?.dataset.ahrefsKey;
  const designPreview =
    window.location?.pathname?.startsWith("/design-preview") ||
    new URLSearchParams(window.location?.search ?? "").has("design");

  const analyticsPermitted = () =>
    !["1", "yes"].includes(navigator.doNotTrack ?? "") && !navigator.globalPrivacyControl;

  const posthogHosts = {
    "https://us.i.posthog.com": {
      assetHost: "https://us-assets.i.posthog.com",
      uiHost: "https://us.posthog.com",
    },
    "https://eu.i.posthog.com": {
      assetHost: "https://eu-assets.i.posthog.com",
      uiHost: "https://eu.posthog.com",
    },
  };

  // The SDK adds URL, referrer, campaign, and stored person properties even to
  // manual captures. Keep only our bounded action fields, SDK routing IDs, and
  // the standard page/device properties PostHog Web Analytics reads. URLs are
  // reduced to origin + path below so query strings and fragments never leave.
  const posthogPropertyNames = new Set([
    "token", "distinct_id", "$device_id", "$session_id", "$window_id",
    "$lib", "$lib_version", "$insert_id", "$time", "$is_identified",
    "$current_url", "$host", "$pathname", "$referrer", "$referring_domain",
    "$browser", "$browser_version", "$os", "$os_version", "$device_type",
    "$screen_height", "$screen_width", "$viewport_height", "$viewport_width",
    "$browser_language", "$timezone", "$pageview_id",
    "product", "event", "occurred_at", "path", "surface", "$process_person_profile",
    "route", "assistant", "location", "destination", "demo", "workflow",
    "prompt_kind", "template_kind", "workflow_type", "action",
    ...["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .flatMap((name) => [name, `latest_${name}`]),
  ]);
  // Origin + path only: drops credentials, query strings, and fragments.
  const urlWithoutQuery = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? `${url.origin}${url.pathname}` : undefined;
    } catch {
      return undefined;
    }
  };
  // Referrers keep only their origin; "$direct" passes through unchanged.
  const referrerOrigin = (value) => {
    if (value === "$direct") return value;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? url.origin : undefined;
    } catch {
      return undefined;
    }
  };
  const beforeSend = (event) => {
    if (!analyticsPermitted() || !event || event.properties?.surface !== "website") return null;
    event.properties = Object.fromEntries(
      Object.entries(event.properties).filter(([key, value]) =>
        posthogPropertyNames.has(key) &&
        (!/^(latest_)?utm_/.test(key) ||
          (typeof value === "string" && value.length <= 80 && /^[a-z0-9._~-]+$/i.test(value))),
      ),
    );
    if ("$current_url" in event.properties) {
      const currentUrl = urlWithoutQuery(event.properties.$current_url);
      if (currentUrl) event.properties.$current_url = currentUrl;
      else delete event.properties.$current_url;
    }
    if ("$referrer" in event.properties) {
      const referrer = referrerOrigin(event.properties.$referrer);
      if (referrer) event.properties.$referrer = referrer;
      else delete event.properties.$referrer;
    }
    event.properties.$process_person_profile = false;
    return event;
  };

  if (designPreview || !analyticsPermitted()) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const loadGoogleAnalytics = () => {
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    if (!analyticsPermitted()) return;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(tag);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: true });
  };

  // Ahrefs Web Analytics is cookieless; it loads behind the same DNT/GPC gate.
  const loadAhrefs = () => {
    if (!ahrefsKey || !/^[A-Za-z0-9+/=]+$/.test(ahrefsKey)) return;
    if (!analyticsPermitted()) return;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://analytics.ahrefs.com/analytics.js";
    tag.setAttribute("data-key", ahrefsKey);
    document.head.appendChild(tag);
  };

  const flushPosthogQueue = (posthog) => {
    const pending = window.__premierePosthogQueue || [];
    window.__premierePosthogQueue = [];
    window.__premierePosthogReady = true;
    for (const item of pending) {
      if (item && typeof item.eventName === "string") {
        posthog.capture(item.eventName, item.properties || {});
      }
    }
  };

  const loadPosthog = () => {
    const hosts = posthogHosts[posthogHost];
    if (!posthogProjectToken || !/^phc_[A-Za-z0-9]+$/.test(posthogProjectToken)) return;
    if (!hosts) return;
    if (!analyticsPermitted()) return;

    const tag = document.createElement("script");
    tag.async = true;
    tag.crossOrigin = "anonymous";
    tag.src = `${hosts.assetHost}/static/array.js`;
    tag.onload = () => {
      if (!analyticsPermitted()) return;
      if (!window.posthog || typeof window.posthog.init !== "function") return;
      window.posthog.init(posthogProjectToken, {
        api_host: posthogHost,
        ui_host: hosts.uiHost,
        defaults: "2026-05-30",
        person_profiles: "never",
        autocapture: false,
        capture_exceptions: false,
        capture_dead_clicks: false,
        capture_performance: false,
        capture_heatmaps: false,
        save_campaign_params: false,
        save_referrer: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        advanced_disable_flags: true,
        before_send: beforeSend,
        loaded: flushPosthogQueue,
      });
    };
    document.head.appendChild(tag);
  };

  const loadAnalytics = () => {
    loadGoogleAnalytics();
    loadAhrefs();
    loadPosthog();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadAnalytics, { timeout: 3_000 });
  } else {
    window.setTimeout(loadAnalytics, 1_500);
  }
})();
