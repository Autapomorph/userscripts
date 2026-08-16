// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @version 3.5.0
// @run-at document_start
// @match *://yandex.tld/*
// @match *://*.turbopages.org/*
// ==/UserScript==

const checkIntervalMs = 1000;

const domainRegex = {
  turbopages: /\.turbopages\.org/,
  yandex: /yandex\..+/,
};

export function redirectWithTurboScript(): void {
  const turboScriptSelector = 'script[data-name="post-message"][data-message]';
  const turboScript = document.querySelector(turboScriptSelector);
  if (!turboScript) {
    return;
  }

  const dataMessage = turboScript.getAttribute('data-message');
  if (typeof dataMessage !== 'string') {
    return;
  }

  let redirectTo: string | undefined;
  try {
    const dataMessageJson = JSON.parse(dataMessage) as { originalUrl?: string } | null;
    if (dataMessageJson && typeof dataMessageJson.originalUrl === 'string') {
      redirectTo = dataMessageJson.originalUrl;
    }
  } catch {
    return;
  }

  if (redirectTo) {
    top?.location.replace(redirectTo);
  }
}

export function redirectWithTurboOverlay(): void {
  const titleHostActive = document.querySelector('.turbo-overlay__title-host_active');
  if (!titleHostActive) return;

  const titleHostActiveText = titleHostActive.textContent;
  if (!titleHostActiveText) return;

  const hostLinks = document.querySelectorAll<HTMLAnchorElement>('a[data-sc-host]');
  for (const hostLink of hostLinks) {
    let dataCounter: unknown;
    try {
      const dataCounterAttr = hostLink.getAttribute('data-counter');
      if (!dataCounterAttr) return;
      dataCounter = JSON.parse(dataCounterAttr);
    } catch {
      return;
    }

    if (
      Array.isArray(dataCounter) &&
      dataCounter.some((e: unknown) => typeof e === 'string' && e.includes(titleHostActiveText))
    ) {
      let redirectTo: string | undefined;
      const [first, bTarget, , wTarget] = dataCounter as unknown[];
      if (first === 'b' && typeof bTarget === 'string') {
        redirectTo = bTarget;
      } else if (first === 'w' && typeof wTarget === 'string') {
        redirectTo = wTarget;
      } else return;

      if (redirectTo) {
        top?.location.replace(redirectTo);
      }
    }
  }
}

export function redirectWithURLPathname(urlPathname: string): void {
  const turboIndex = urlPathname.indexOf('/turbo/');
  const delimeterIndex = urlPathname.search(/\/(s|h)\//);
  const delimeterLength = 2;

  if (delimeterIndex < 0) return;

  const host =
    turboIndex === -1
      ? urlPathname.substring(1, delimeterIndex)
      : urlPathname.substring(turboIndex + '/turbo/'.length, delimeterIndex);
  const pathName = urlPathname.substring(delimeterIndex + delimeterLength);
  top?.location.replace(`//${host}${pathName}`);
}

export function redirectWithURLSearchParam(urlSearchParams: URLSearchParams): void {
  const textQuery = urlSearchParams.get('text');
  if (textQuery) {
    top?.location.replace(textQuery);
  }
}

export function isTurboPage(
  urlHostname: string,
  urlPathname: string,
  urlSearchParams: URLSearchParams,
): boolean {
  // Turbopages domain
  if (urlHostname.includes('.turbopages.org')) {
    return true;
  }

  // Yandex domains
  if (domainRegex.yandex.test(urlHostname) && urlPathname.includes('/turbo')) {
    if (/\.*\/(s|h)\/.*/.test(urlPathname)) {
      return true;
    }

    if (urlSearchParams.has('text')) {
      const textParam = urlSearchParams.get('text');
      // Do not redirect Yandex Health Turbo inline
      if (textParam && domainRegex.yandex.test(textParam)) {
        return false;
      }

      return true;
    }
  }

  return false;
}

export function main(): void {
  if (!top) return;
  const urlHostname = top.location.hostname;
  const urlPathname = top.location.pathname;
  const urlSearchParams = new URLSearchParams(top.location.search);

  if (!isTurboPage(urlHostname, urlPathname, urlSearchParams)) {
    return;
  }

  redirectWithTurboScript();
  redirectWithTurboOverlay();
  redirectWithURLPathname(urlPathname);
  redirectWithURLSearchParam(urlSearchParams);
}

export function avoidYandexTurbo(): void {
  if (typeof window === 'undefined' || !top) return;

  let currentURLPathname = top.location.pathname;
  setInterval(() => {
    if (top && currentURLPathname !== top.location.pathname) {
      currentURLPathname = top.location.pathname;
      main();
    }
  }, checkIntervalMs);

  main();
}

// Auto-run if running in browser environment (not imported as a module in Jest)
if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
  avoidYandexTurbo();
}
