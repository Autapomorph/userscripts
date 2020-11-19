// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @author Autapomorph
// @version 2.0.1
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/avoid-yandex-turbo.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/avoid-yandex-turbo.user.js
// @run-at document_start
// @match *://yandex.ru/*
// @match *://*.turbopages.org/*
// @supportURL https://github.com/Autapomorph/userscripts/issues
// @license MIT
// ==/UserScript==

(function () {
  function redirectWithTurboOverlay() {
    var titleHostActive = document.querySelector('.turbo-overlay__title-host_active');
    if (!titleHostActive) {
      return;
    }

    var titleHostActiveText = titleHostActive.textContent;
    var hostLinks = document.querySelectorAll('a[data-sc-host]');
    for (var i = 0; i < hostLinks.length; i += 1) {
      var hostLink = hostLinks[i];
      var dataCounter;
      try {
        dataCounter = JSON.parse(hostLink.getAttribute('data-counter'));
      } catch (error) {
        return;
      }
      
      if (dataCounter.find(e => e.indexOf(titleHostActiveText) > -1)) {
        var redirect;
        if (dataCounter[0] === 'b') {
          redirect = dataCounter[1];
        } else if (dataCounter[0] === 'w') {
          redirect = dataCounter[3];
        } else {
          return;
        }
        
        top.location.replace(redirect);
      }
    }
  }

  function redirectWithURL() {
    var urlPathname = top.location.pathname;
    var turboIndex = urlPathname.indexOf('/turbo/');
    var delimeterIndex = urlPathname.search(/\/(s|h)/);
    var delimeterLength = 2;

    if (delimeterIndex < 0) {
      return;
    }
    
    var host =
      turboIndex === -1
        ? urlPathname.substring(1, delimeterIndex)
        : urlPathname.substring(turboIndex + '/turbo/'.length, delimeterIndex);
    var pathName = urlPathname.substring(delimeterIndex + delimeterLength);
    top.location.replace('//' + host + pathName);
  }

  var urlPathname = top.location.pathname;
  if (/\.*\/(s|h)\/.*/.test(urlPathname)) {
    redirectWithTurboOverlay();
    redirectWithURL();
  }
})();
