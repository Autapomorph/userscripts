// ==UserScript==
// @name Yandex to DuckDuckGo
// @name:ru Поиск DuckDuckGo на Яндексе
// @description Places a button to search with DuckDuckGo on Yandex search page
// @description:ru Добавляет кнопку поиска на DuckDuckGo к выдаче Яндекса
// @version 2.1.3
// @run-at document_end
// @match https://yandex.tld/*
// @match https://yandex.ru/*
// @match https://yandex.com/*
// @match https://yandex.by/*
// @match https://yandex.kz/*
// @match https://yandex.uz/*
// @match https://yandex.fr/*
// @match https://yandex.az/*
// @match https://yandex.co.il/*
// @match https://yandex.com.tr/*
// @match https://yandex.com.ge/*
// @match https://yandex.eu/*
// @match https://yandex.ee/*
// @match https://yandex.lt/*
// @match https://yandex.lv/*
// @match https://yandex.md/*
// @match https://yandex.tj/*
// @match https://yandex.tm/*
// @match https://yandex.ua/*
// @match https://ya.tld/*
// @match https://ya.ru/*
// @match https://ya.com/*
// @match https://ya.by/*
// @match https://ya.kz/*
// @match https://ya.uz/*
// @match https://ya.ua/*
// @match https://ya.az/*
// @match https://ya.co/*
// @match https://ya.cl/*
// @match https://ya.eu/*
// @match https://ya.ee/*
// @match https://ya.lt/*
// @match https://ya.lv/*
// @match https://ya.md/*
// @match https://ya.tj/*
// @match https://ya.tm/*
// ==/UserScript==

function getSearchTerm(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const queryFromUrl = urlParams.get('text') ?? urlParams.get('q');
  const input = document.querySelector<HTMLInputElement>(
    'input[name="text"], input[type="search"], input',
  );
  const queryFromInput = input?.value;
  return (queryFromUrl ?? queryFromInput ?? '').trim();
}

function findSearchEngineContainer(): HTMLElement | null {
  const containerSelectors = [
    '.SerpFooter-LinksGroup_type_searchengines',
    '[class*="SerpFooter-LinksGroup_type_searchengines"]',
    '[class*="searchengines"]',
    '[class*="Searchengines"]',
    '[class*="searchengine"]',
    '[class*="Searchengine"]',
    '[class*="search-engine"]',
    '[class*="Search-Engine"]',
    '.SerpFooter-LinksGroup',
    '[class*="SerpFooter-LinksGroup"]',
    '.SerpFooter',
    '[class*="SerpFooter"]',
    '.serp-footer',
    '[class*="serp-footer"]',
    'footer',
  ];

  for (const selector of containerSelectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      if (element.className.includes('SerpFooter-Item')) {
        return element.parentElement;
      }
      return element;
    }
  }

  const itemElement = document.querySelector<HTMLElement>(
    '.SerpFooter-Item, [class*="SerpFooter-Item"]',
  );

  if (itemElement) {
    return itemElement.parentElement;
  }

  return null;
}

function addDdgLink(): void {
  const urlPathname = window.location.pathname;
  if (!urlPathname.includes('/search')) {
    return;
  }

  const searchTerm = getSearchTerm();
  if (!searchTerm) {
    return;
  }

  const container = findSearchEngineContainer();
  if (!container) {
    return;
  }

  const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}`;

  let ddgLink = container.querySelector<HTMLAnchorElement>(
    'a[href*="duckduckgo.com"], .ddg-search-link',
  );

  if (ddgLink) {
    if (ddgLink.getAttribute('href') !== ddgUrl) {
      ddgLink.setAttribute('href', ddgUrl);
    }

    return;
  }

  const refLink = container.querySelector<HTMLAnchorElement>('a');

  if (refLink) {
    ddgLink = refLink.cloneNode(true) as HTMLAnchorElement;
    ddgLink.classList.add('ddg-search-link');
    ddgLink.setAttribute('href', ddgUrl);

    let textReplaced = false;
    const childNodes = Array.from(ddgLink.querySelectorAll('*'));
    for (const child of childNodes) {
      if (
        child.children.length === 0 &&
        child.textContent &&
        /google|bing|яндекс|yandex/i.test(child.textContent)
      ) {
        child.textContent = child.textContent.replace(/google|bing|яндекс|yandex/gi, 'DuckDuckGo');
        textReplaced = true;
      }
    }

    if (!textReplaced) {
      ddgLink.textContent = 'DuckDuckGo';
    }

    container.appendChild(ddgLink);
  } else {
    ddgLink = document.createElement('a');
    ddgLink.classList.add('ddg-search-link');
    ddgLink.setAttribute('href', ddgUrl);
    ddgLink.textContent = 'DuckDuckGo';
    container.appendChild(ddgLink);
  }
}

if (window.top === window.self || window.top) {
  addDdgLink();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDdgLink);
  }

  const observer = new MutationObserver(() => {
    addDdgLink();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}
