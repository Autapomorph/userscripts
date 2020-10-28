// ==UserScript==
// @name Yandex to DuckDuckGo
// @name:ru Поиск DuckDuckGo на Яндексе
// @description Places a button to search with DuckDuckGo on Yandex search page
// @description:ru Добавляет кнопку поиска на DuckDuckGo к выдаче Яндекса
// @author Autapomorph
// @version 1.0.3
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/yandex-ddg.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/yandex-ddg.user.js
// @run-at document_start
// @match https://yandex.ru/*
// @supportURL https://github.com/Autapomorph/userscripts/issues
// @license MIT
// ==/UserScript==

(function() {
  var input = document.querySelector('.input__control');
  var competitorsList = document.querySelector('.competitors__list');
  var googleLink = competitorsList.querySelector('a[href*="google"]');

  if (!input || !competitorsList || !googleLink) {
    return;
  }

  var searchTerm = input.value;

  var ddgLink = googleLink.cloneNode(true);
  ddgLink.textContent = 'DuckDuckGo';
  ddgLink.setAttribute('href', '//duckduckgo.com/?q=' + searchTerm);

  competitorsList.appendChild(ddgLink);
})();
