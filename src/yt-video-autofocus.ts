// ==UserScript==
// @name YouTube Video Autofocus
// @name:ru YouTube автофокус видео
// @description Auto focus Youtube player to enable hotkeys
// @description:ru Ставит фокус на плеер YouTube для активации хоткеев
// @version 1.0.1
// @run-at document_end
// @match *://youtube.com/*
// @match *://*.youtube.com/*
// @match *://youtu.be/*
// ==/UserScript==

const checkIntervalMs = 50;
const maxRetryDurationMs = 3000;

function isVideoPage(searchString: string = top?.location.search ?? '') {
  const currentPathname = top?.location.pathname ?? '';
  const videoSearchParamKey = 'v';

  return (
    currentPathname.startsWith('/watch') ||
    currentPathname.startsWith('/shorts/') ||
    currentPathname.startsWith('/live/') ||
    new URLSearchParams(searchString).has(videoSearchParamKey)
  );
}

function isEditableElement(element: Element | null) {
  if (!element) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea') {
    return true;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }

  if (element.getAttribute('role') === 'textbox') {
    return true;
  }

  return false;
}

function tryFocusPlayer() {
  if (!isVideoPage()) {
    return false;
  }

  if (isEditableElement(document.activeElement)) {
    return true;
  }

  const playerSelectors = ['#movie_player', '.html5-main-video', 'ytd-player', 'video'];

  for (const selector of playerSelectors) {
    const el = document.querySelector<HTMLElement>(selector);

    if (el) {
      if (document.activeElement && el.contains(document.activeElement)) {
        return true;
      }

      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }

      el.focus({ preventScroll: true });

      if (document.activeElement && el.contains(document.activeElement)) {
        return true;
      }
    }
  }

  return false;
}

let activeRetryTimer: ReturnType<typeof setInterval> | null = null;

function scheduleAutoFocus() {
  if (activeRetryTimer !== null) {
    clearInterval(activeRetryTimer);
    activeRetryTimer = null;
  }

  if (!isVideoPage()) {
    return;
  }

  if (tryFocusPlayer()) {
    return;
  }

  const startTime = Date.now();
  activeRetryTimer = setInterval(() => {
    const success = tryFocusPlayer();
    const elapsedTime = Date.now() - startTime;

    if (success || elapsedTime >= maxRetryDurationMs) {
      if (activeRetryTimer !== null) {
        clearInterval(activeRetryTimer);
        activeRetryTimer = null;
      }
    }
  }, checkIntervalMs);
}

function init() {
  scheduleAutoFocus();

  window.addEventListener('yt-navigate-finish', scheduleAutoFocus);
  window.addEventListener('yt-page-data-updated', scheduleAutoFocus);
  window.addEventListener('popstate', scheduleAutoFocus);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
