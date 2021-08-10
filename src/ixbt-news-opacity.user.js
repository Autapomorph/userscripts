// ==UserScript==
// @name iXBT News Reduce Opacity — Hide Xiaomi news
// @name:ru iXBT News Reduce Opacity — Скрыть новости о Xiaomi
// @description iXBT Reduce News — No more endless Xiaomi news
// @description:ru iXBT Reduce News — Больше никаких новостей о Xiaomi
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 1.0.0
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/ixbt-news-opacity.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/ixbt-news-opacity.user.js
// @run-at document_start
// @match *://www.ixbt.com/news
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// ==/UserScript==

(function iXBTNewsReduceOpacityByKeyword() {
  const blockList = [/xiaomi/i, /redmi/i];

  const searchParams = new URLSearchParams(top.location.search);
  const isFeedMode = searchParams.get('show') === 'tape';

  const newsItemSelector = isFeedMode ? 'div.item' : 'li.item';
  const newsHeaderSelector = isFeedMode ? '.b-article__header h2 a' : 'a > strong';

  const newsItems = document.querySelectorAll(newsItemSelector);
  [...newsItems].forEach(newsItem => {
    const newsHeader = newsItem.querySelector(newsHeaderSelector);

    const shouldDeleteNews = blockList.some(keyword => {
      if (typeof keyword === 'string') {
        return newsHeader.textContent.includes(keyword);
      }
      return keyword.test(newsHeader.textContent);
    });

    if (shouldDeleteNews) {
      // eslint-disable-next-line no-param-reassign
      newsItem.style.opacity = 0.5;
    }
  });
})();
