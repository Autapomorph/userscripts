// ==UserScript==
// @name Yandex to DuckDuckGo
// @name:ru Поиск DuckDuckGo на Яндексе
// @description Places a button to search with DuckDuckGo on Yandex search page
// @description:ru Добавляет кнопку поиска на DuckDuckGo к выдаче Яндекса
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 2.1.1
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/yandex-ddg.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/yandex-ddg.user.js
// @run-at document_end
// @match https://yandex.tld/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// ==/UserScript==

(function yandexDDG() {
  const urlPathname = top.location.pathname;
  if (urlPathname.indexOf('/search') === -1) {
    return;
  }

  const input = document.querySelector('input');
  if (!input) {
    return;
  }

  const searchEngineList = document.querySelector('.SerpFooter-LinksGroup_type_searchengines');

  if (!searchEngineList) {
    return;
  }

  const googleLink = searchEngineList.querySelector('a[href*="google"]');
  if (!googleLink) {
    return;
  }

  const searchTerm = input.value;
  const ddgLink = googleLink.cloneNode(true);
  ddgLink.textContent = 'DuckDuckGo';
  ddgLink.setAttribute('href', `//duckduckgo.com/?q=${searchTerm}`);
  searchEngineList.appendChild(ddgLink);
})();
