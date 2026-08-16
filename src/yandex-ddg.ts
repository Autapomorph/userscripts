// ==UserScript==
// @name Yandex to DuckDuckGo
// @name:ru Поиск DuckDuckGo на Яндексе
// @description Places a button to search with DuckDuckGo on Yandex search page
// @description:ru Добавляет кнопку поиска на DuckDuckGo к выдаче Яндекса
// @version 2.1.2
// @run-at document_end
// @match https://yandex.tld/*
// ==/UserScript==

if (top) {
  const urlPathname = top.location.pathname;
  if (urlPathname.includes('/search')) {
    const input = document.querySelector<HTMLInputElement>('input');
    const searchEngineList = document.querySelector<HTMLElement>(
      '.SerpFooter-LinksGroup_type_searchengines',
    );
    const googleLink = searchEngineList?.querySelector<HTMLAnchorElement>('a[href*="google"]');

    if (input && searchEngineList && googleLink) {
      const searchTerm = input.value;
      const ddgLink = googleLink.cloneNode(true) as HTMLAnchorElement;
      ddgLink.textContent = 'DuckDuckGo';
      ddgLink.setAttribute('href', `//duckduckgo.com/?q=${encodeURIComponent(searchTerm)}`);
      searchEngineList.appendChild(ddgLink);
    }
  }
}
