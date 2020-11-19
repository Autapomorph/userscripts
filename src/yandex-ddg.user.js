// ==UserScript==
// @name Yandex to DuckDuckGo
// @name:ru Поиск DuckDuckGo на Яндексе
// @description Places a button to search with DuckDuckGo on Yandex search page
// @description:ru Добавляет кнопку поиска на DuckDuckGo к выдаче Яндекса
// @author Autapomorph
// @version 2.0.0
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/yandex-ddg.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/yandex-ddg.user.js
// @run-at document_end
// @match https://yandex.ru/*
// @supportURL https://github.com/Autapomorph/userscripts/issues
// @license MIT
// ==/UserScript==

(function yandexDDG() {
  const urlPathname = top.location.pathname;
  if (urlPathname.indexOf('/search') === -1) return;

  const input = document.querySelector('.input__control');
  if (!input) return;

  const competitorsList = document.querySelector('.competitors__list');
  if (!competitorsList) return;

  const googleLink = competitorsList.querySelector('a[href*="google"]');
  if (!googleLink) return;

  const searchTerm = input.value;
  const ddgLink = googleLink.cloneNode(true);
  ddgLink.textContent = 'DuckDuckGo';
  ddgLink.setAttribute('href', `//duckduckgo.com/?q=${searchTerm}`);
  competitorsList.appendChild(ddgLink);
})();
