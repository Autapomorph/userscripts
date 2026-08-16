// ==UserScript==
// @name YouTube Video Autofocus
// @name:ru YouTube автофокус видео
// @description Auto focus Youtube player to enable hotkeys
// @description:ru Ставит фокус на плеер YouTube для активации хоткеев
// @version 1.0.0
// @run-at document_end
// @match *://youtube.com/*
// @match *://www.youtube.com/*
// ==/UserScript==

const checkIntervalMs = 1000;

function main(): void {
  const videoElSelector = '.html5-main-video';
  const videoEl = document.querySelector<HTMLElement>(videoElSelector);

  if (videoEl) {
    videoEl.focus({
      preventScroll: true,
    });
  }
}

function isVideoPage(searchString: string = top?.location.search ?? ''): boolean {
  const videoSearchParamKey = 'v';
  return new URLSearchParams(searchString).has(videoSearchParamKey);
}

function getVideoSearchParamValue(
  searchString: string = top?.location.search ?? '',
): string | null {
  const videoSearchParamKey = 'v';
  return new URLSearchParams(searchString).get(videoSearchParamKey);
}

let currentVideoSearchParamValue = getVideoSearchParamValue();
setInterval(() => {
  if (!isVideoPage()) {
    return;
  }

  const newVideoSearchParamValue = getVideoSearchParamValue();
  if (currentVideoSearchParamValue !== newVideoSearchParamValue) {
    currentVideoSearchParamValue = newVideoSearchParamValue;
    main();
  }
}, checkIntervalMs);

if (isVideoPage()) {
  main();
}
