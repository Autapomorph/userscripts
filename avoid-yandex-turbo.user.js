// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @author Autapomorph
// @version 1.0.9
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/avoid-yandex-turbo.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/avoid-yandex-turbo.user.js
// @run-at document_start
// @match *://yandex.ru/*
// @match *://*.turbopages.org/*
// @supportURL https://github.com/Autapomorph/userscripts/issues
// @license MIT
// ==/UserScript==

(function () {
  function getUrlVar() {
    var urlVar = window.location.search;
    var arrayVar = [];
    var valueAndKey = [];
    var resultArray = [];
    arrayVar = urlVar.substr(1).split('&');

    if (arrayVar[0] === '') {
      return false;
    }

    for (i = 0; i < arrayVar.length; i++) {
      valueAndKey = arrayVar[i].split('=');
      resultArray[valueAndKey[0]] = valueAndKey[1];
    }

    return resultArray;
  }

  var urlLandingPage = getUrlVar();
  var urlHostname = window.location.hostname;
  var urlPathname = window.location.pathname;

  // turbopages.org
  if (/.+.turbopages.org$/.test(urlHostname)) {
    if (/\.*\/s\/.*/.test(urlPathname)) {
      var sIndex = urlPathname.indexOf('/s/');
      var host = urlPathname.substring(0, sIndex);
      var pathName = urlPathname.substring(sIndex + '/s'.length);
      top.location.replace('https://' + host + pathName);
    }

    return;
  }

  // yandex.ru
  if (urlPathname === '/turbo') {
    top.location.replace(decodeURIComponent(urlLandingPage['text']));
  } else if (/\/turbo\/.*\/s\/.*/.test(urlPathname)) {
    var turboIndex = urlPathname.indexOf('/turbo/');
    var sIndex = urlPathname.indexOf('/s/');
    var host = urlPathname.substring(turboIndex + '/turbo/'.length, sIndex);
    var pathName = urlPathname.substring(sIndex + '/s'.length);
    top.location.replace('https://' + host + pathName);
  } else if (urlPathname.indexOf('/turbo/s/') !== -1) {
    top.location.replace('https://' + urlPathname.substr(urlPathname.indexOf('/turbo/s/') + 9));
  } else if (urlPathname === '/search/touch/') {
    $('a[data-sc-host]').each(function () {
      var urlYaTurbo = $(this).attr('href');
      var dataCounter = JSON.parse($(this).attr('data-counter'));
      if (
        urlYaTurbo.indexOf('https://yandex.ru/turbo/s/') !== -1 ||
        urlYaTurbo.indexOf('https://yandex.ru/turbo?text=') !== -1
      ) {
        $(this).attr('data-bem', '{"link":{}}');
        if (dataCounter[0] === 'b') {
          $(this).attr('href', dataCounter[1]);
        } else if (dataCounter[0] === 'w') {
          $(this).attr('href', dataCounter[3]);
        }
      }
    });
  } else if (urlPathname === '/search/') {
    $('a.link').each(function () {
      var dataCounter = JSON.parse($(this).attr('data-counter'));
      if (dataCounter[0] === 'b') {
        $(this).attr('href', dataCounter[1]);
      } else if (dataCounter[0] === 'w') {
        if (typeof dataCounter[3] !== 'undefined') {
          $(this).hide();
        }
      }
    });
  } else if (urlPathname.substr(0, 12) === '/news/story/') {
    var YTsubtitle = document.querySelector('div.news-story__head > a.news-story__subtitle');
    if (
      YTsubtitle.href.substr(0, 26) === 'https://yandex.ru/turbo/s/' ||
      YTsubtitle.href.substr(0, 26) === 'https://yandex.ru/turbo/h/'
    ) {
      YTsubtitle.href =
        'https://' + YTsubtitle.href.substring(26, YTsubtitle.href.length).split('?')[0];
    } else {
      YTsubtitle.href = YTsubtitle.href.split('?')[0];
    }

    var YT = document.querySelectorAll('a.news-snippet__url');
    for (var i = 0; i < YT.length; i++) {
      if (
        YT[i].href.substr(0, 26) === 'https://yandex.ru/turbo/s/' ||
        YT[i].href.substr(0, 26) === 'https://yandex.ru/turbo/h/'
      ) {
        YT[i].href = 'https://' + YT[i].href.substring(26, YT[i].href.length).split('?')[0];
      } else {
        YT[i].href = YT[i].href.split('?')[0];
      }
    }

    var YTicon = document.querySelectorAll('svg.news-snippet__turbo-icon');
    for (var i = 0; i < YTicon.length; i++) {
      YTicon[i].style.display = 'none';
    }
  }
})();
