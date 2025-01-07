// For Tracking Custom Pixel Events (Mock SetUp)
export const trackPageView = () => {
  console.log(
    `%c PageView event triggered.`,
    "background: #222; color: #bada55; font-size: 16px; font-weight: bold;"
  ); // Log for verification
  if (typeof window !== "undefined" && window.fbq) {
    fbq("track", "PageView");
  }
};

// For Tracking Custom Pixel Events (Mock SetUp)
export const trackCustomEvent = (eventName, params) => {
  console.log(
    `%c Custom Event: ${eventName}.`,
    "background: #222; color: #bada55; font-size: 16px; font-weight: bold;"
  );
  console.log(`%c Details:`, "color: #3498db; font-weight: bold;", params);

  if (typeof window !== "undefined" && window.fbq) {
    fbq("trackCustom", eventName, params);
  }
};
