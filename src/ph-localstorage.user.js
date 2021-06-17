// ==UserScript==
// @name PH localStorage auto populate
// @name:ru PH автозаполнение localStorage
// @description Disables autoplay, sets quality to 1080p, mutes volume
// @description:ru Отключает автовоспроизведение, устанавливает качество 1080p, заглушает звук
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 1.0.0
// @downloadURL https://github.com/Autapomorph/userscripts/raw/main/src/ph-localstorage.user.js
// @updateURL https://github.com/Autapomorph/userscripts/raw/main/src/ph-localstorage.user.js
// @run-at document_end
// @match https://*.pornhub.com/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// ==/UserScript==

(function phLocalStorage() {
  const playerItemKey = 'mgp_player';
  const existingPlayerItemValue = JSON.parse(localStorage.getItem(playerItemKey)) || {};
  const playerItemValue = {
    autoplay: false,
    quality: 1080,
    volume: {
      volume: 100,
      mute: true,
    },
    ...existingPlayerItemValue,
  };
  localStorage.setItem(playerItemKey, JSON.stringify(playerItemValue));
})();
