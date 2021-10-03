// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 3.2.4
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-yandex-turbo.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-yandex-turbo.user.js
// @run-at document_start
// @match *://yandex.ru/*
// @match *://*.turbopages.org/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// ==/UserScript==

(function avoidYandexTurbo() {
  function redirectWithTurboOverlay() {
    const titleHostActive = document.querySelector('.turbo-overlay__title-host_active');
    if (!titleHostActive) return;

    const titleHostActiveText = titleHostActive.textContent;
    const hostLinks = document.querySelectorAll('a[data-sc-host]');
    for (let i = 0; i < hostLinks.length; i += 1) {
      const hostLink = hostLinks[i];
      let dataCounter;
      try {
        dataCounter = JSON.parse(hostLink.getAttribute('data-counter'));
      } catch (error) {
        return;
      }

      if (dataCounter.find(e => e.indexOf(titleHostActiveText) > -1)) {
        let redirect;
        if (dataCounter[0] === 'b') {
          redirect = dataCounter[1];
        } else if (dataCounter[0] === 'w') {
          redirect = dataCounter[3];
        } else return;

        top.location.replace(redirect);
      }
    }
  }

  function redirectWithURLPathname(urlPathname) {
    const turboIndex = urlPathname.indexOf('/turbo/');
    const delimeterIndex = urlPathname.search(/\/(s|h)\//);
    const delimeterLength = 2;

    if (delimeterIndex < 0) return;

    const host =
      turboIndex === -1
        ? urlPathname.substring(1, delimeterIndex)
        : urlPathname.substring(turboIndex + '/turbo/'.length, delimeterIndex);
    const pathName = urlPathname.substring(delimeterIndex + delimeterLength);
    top.location.replace(`//${host}${pathName}`);
  }

  function redirectWithURLSearchParam(urlSearchParams) {
    const textQuery = urlSearchParams.get('text');
    if (textQuery) {
      top.location.replace(textQuery);
    }
  }

  function isTurboPage(urlHostname, urlPathname, urlSearchParams) {
    // turbopages.org
    if (/\.turbopages.org/.test(urlHostname)) return true;

    // yandex.ru
    if (/yandex.ru/.test(urlHostname) && urlPathname.includes('/turbo')) {
      if (/\.*\/(s|h)\/.*/.test(urlPathname)) {
        return true;
      }

      if (urlSearchParams.has('text')) {
        // Do not redirect Yandex Health Turbo inline
        if (urlSearchParams.get('text').includes('health.yandex.ru')) {
          return false;
        }

        return true;
      }
    }

    return false;
  }

  function main() {
    const urlHostname = top.location.hostname;
    const urlPathname = top.location.pathname;
    const urlSearchParams = new URLSearchParams(top.location.search);

    if (!isTurboPage(urlHostname, urlPathname, urlSearchParams)) return;
    redirectWithTurboOverlay();
    redirectWithURLPathname(urlPathname);
    redirectWithURLSearchParam(urlSearchParams);
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = {
      avoidYandexTurbo,
      main,
      isTurboPage,
      redirectWithTurboOverlay,
      redirectWithURLPathname,
      redirectWithURLSearchParam,
    };
    return;
  }

  let currentURLPathname = top.location.pathname;
  setInterval(() => {
    if (currentURLPathname !== top.location.pathname) {
      currentURLPathname = top.location.pathname;
      main();
    }
  }, 1000);

  main();
})();
