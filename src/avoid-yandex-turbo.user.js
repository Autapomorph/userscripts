// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @author Autapomorph
// @version 3.0.0
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-yandex-turbo.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-yandex-turbo.user.js
// @run-at document_start
// @match *://yandex.ru/*
// @match *://*.turbopages.org/*
// @supportURL https://github.com/Autapomorph/userscripts/issues
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

  function redirectWithURL() {
    const urlPathname = top.location.pathname;
    const turboIndex = urlPathname.indexOf('/turbo/');
    const delimeterIndex = urlPathname.search(/\/(s|h)/);
    const delimeterLength = 2;

    if (delimeterIndex < 0) return;

    const host =
      turboIndex === -1
        ? urlPathname.substring(1, delimeterIndex)
        : urlPathname.substring(turboIndex + '/turbo/'.length, delimeterIndex);
    const pathName = urlPathname.substring(delimeterIndex + delimeterLength);
    top.location.replace(`//${host}${pathName}`);
  }

  const urlPathname = top.location.pathname;
  if (/\.*\/(s|h)\/.*/.test(urlPathname)) {
    redirectWithTurboOverlay();
    redirectWithURL();
  }
})();
