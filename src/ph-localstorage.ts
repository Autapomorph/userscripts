// ==UserScript==
// @name PH localStorage auto populate
// @name:ru PH автозаполнение localStorage
// @description Disables autoplay, sets quality to 1080p, mutes volume
// @description:ru Отключает автовоспроизведение, устанавливает качество 1080p, заглушает звук
// @version 1.2.0
// @run-at document_end
// @match https://*.pornhub.com/*
// @match https://*.pornhub.org/*
// ==/UserScript==

interface PlayerItemValue {
  autoplay: boolean;
  quality: {
    auto: boolean;
    quality: number;
  };
  volume: {
    volume: number;
    muted: boolean;
  };
  closedCaptions: {
    lang: string;
    visible: boolean;
  };
  [key: string]: unknown;
}

const playerItemKey = 'mgp_player';
const rawItem = localStorage.getItem(playerItemKey);
let existingPlayerItemValue: Record<string, unknown> = {};

if (rawItem) {
  try {
    const parsed = JSON.parse(rawItem);
    if (typeof parsed === 'object' && parsed !== null) {
      existingPlayerItemValue = parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore parse error
  }
}

const playerItemValue: PlayerItemValue = {
  autoplay: false,
  quality: {
    auto: false,
    quality: 1080,
  },
  volume: {
    volume: 100,
    muted: true,
  },
  closedCaptions: {
    lang: 'en',
    visible: false,
  },
  ...existingPlayerItemValue,
};

localStorage.setItem(playerItemKey, JSON.stringify(playerItemValue));
