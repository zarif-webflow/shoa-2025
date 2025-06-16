/**
 * Determines how the current page was loaded
 * @returns Object containing load type information
 */
export const getPageLoadType = () => {
  const currentDomain = window.location.hostname;
  const referrerUrl = document.referrer;
  const navigationEntries = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];
  const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : null;

  // Check if there's a referrer
  if (!referrerUrl) {
    return {
      loadType: "hard-load",
      reason: "no-referrer",
      isFromSameWebsite: false,
      referrerDomain: null,
      navigationType,
    };
  }

  // Parse referrer domain
  let referrerDomain: string | null = null;
  try {
    referrerDomain = new URL(referrerUrl).hostname;
  } catch {
    return {
      loadType: "hard-load",
      reason: "invalid-referrer",
      isFromSameWebsite: false,
      referrerDomain: null,
      navigationType,
    };
  }

  // Check if referrer is from the same website
  const isFromSameWebsite = referrerDomain === currentDomain;

  // Additional checks for hard loads
  if (navigationType === "reload") {
    return {
      loadType: "hard-load",
      reason: "page-reload",
      isFromSameWebsite,
      referrerDomain,
      navigationType,
    };
  }

  if (navigationType === "navigate" && isFromSameWebsite) {
    return {
      loadType: "anchor-navigation",
      reason: "same-site-navigation",
      isFromSameWebsite: true,
      referrerDomain,
      navigationType,
    };
  }

  if (navigationType === "navigate" && !isFromSameWebsite) {
    return {
      loadType: "external-navigation",
      reason: "external-site-navigation",
      isFromSameWebsite: false,
      referrerDomain,
      navigationType,
    };
  }

  // Fallback based on referrer only
  if (isFromSameWebsite) {
    return {
      loadType: "anchor-navigation",
      reason: "same-site-referrer",
      isFromSameWebsite: true,
      referrerDomain,
      navigationType,
    };
  }

  return {
    loadType: "external-navigation",
    reason: "external-referrer",
    isFromSameWebsite: false,
    referrerDomain,
    navigationType,
  };
};

/**
 * Simple helper to check if page was loaded via anchor from same website
 * @returns boolean indicating if page was loaded via same-site anchor
 */
export const isAnchorLoadFromSameWebsite = (): boolean => {
  const loadInfo = getPageLoadType();
  return loadInfo.loadType === "anchor-navigation" && loadInfo.isFromSameWebsite;
};

/**
 * Simple helper to check if page was hard loaded
 * @returns boolean indicating if page was hard loaded
 */
export const isHardLoad = (): boolean => {
  const loadInfo = getPageLoadType();
  return loadInfo.loadType === "hard-load";
};
