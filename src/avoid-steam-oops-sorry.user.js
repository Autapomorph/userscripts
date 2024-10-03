// ==UserScript==
// @name Avoid Steam "Oops, Sorry!"
// @name:ru Обход Steam "Ой, извините!"
// @description Redirect to target page avoiding Steam "Oops, Sorry!"
// @description:ru Переадресация на целевую страницу в обход "Ой, извините!"
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 1.0.0
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-steam-oops-sorry.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/avoid-steam-oops-sorry.user.js
// @run-at document_start
// @match https://store.steampowered.com/app/*
// @match https://store.steampowered.com/news/app/*
// @match https://store.steampowered.com/sub/*
// @match https://store.steampowered.com/bundle/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// ==/UserScript==

(function steamRedirectOopsSorry() {
  // Country code redirect to, available values: see ISO 3166-1 alpha-2
  const defaultCountryCodeRedirectTo = 'us';

  // Available values: 'store' | 'community'
  const redirectToType = 'store';

  const steamStoreBaseUrl = 'https://store.steampowered.com';
  const steamCommunityBaseUrl = 'https://steamcommunity.com';

  const appUrlPath = 'app';
  const subUrlPath = 'sub';
  const bundleUrlPath = 'bundle';
  const newsUrlPath = 'news';

  const countryCodeSearchParam = 'cc';
  const birthtimeCookieName = 'birthtime';
  const birthtimeCookieValue = '0';

  const oopsSorryErrorSelector = '#error_box';

  const currentUrl = new URL(window.location.href);
  const appId = currentUrl.pathname.split('/')[2];

  const isOopsSorryError = Boolean(document.querySelector(oopsSorryErrorSelector));

  const isCountryCodeApplied = (url = new URL(window.location.href)) =>
    url.searchParams.has(countryCodeSearchParam);

  // Redirect with country code
  if (isOopsSorryError && !isCountryCodeApplied()) {
    // Redirect to community page
    if (redirectToType === 'community') {
      if (currentUrl.pathname.includes(appUrlPath)) {
        window.location.href = `${steamCommunityBaseUrl}/${appUrlPath}/${appId}`;
      }
    } else if (redirectToType === 'store') {
      // Set birth time cookie to avoid birth check
      if (!document.cookie.includes(birthtimeCookieName)) {
        document.cookie = `${birthtimeCookieName}=${birthtimeCookieValue}`;
      }

      currentUrl.searchParams.set(countryCodeSearchParam, defaultCountryCodeRedirectTo);
      window.location.href = currentUrl;
    }
  }

  // Change store links, add code country
  if (isCountryCodeApplied()) {
    const links = [...document.links];

    links.forEach(link => {
      if (
        link.href.includes(`${steamStoreBaseUrl}/${appUrlPath}/`) ||
        link.href.includes(`${steamStoreBaseUrl}/${newsUrlPath}/${appUrlPath}/`) ||
        link.href.includes(`${steamStoreBaseUrl}/${subUrlPath}/`) ||
        link.href.includes(`${steamStoreBaseUrl}/${bundleUrlPath}/`)
      ) {
        const linkUrl = new URL(link);
        linkUrl.searchParams.set(countryCodeSearchParam, defaultCountryCodeRedirectTo);
        // eslint-disable-next-line no-param-reassign
        link.href = linkUrl.toString();
      }
    });
  }
})();
