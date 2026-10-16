const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const fullCode = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/product-hover-video.js'), 'utf8');
const code = fullCode.slice(0, fullCode.indexOf('}());') + 6);

function setup(options = {}) {
  const listeners = {};
  const timers = new Map();
  const players = [];
  const desktop = { matches: options.desktop !== false, addEventListener() {} };
  const reduced = { matches: !!options.reduced, addEventListener() {} };
  const document = {
    hidden: false,
    addEventListener(name, fn) { listeners[name] = fn; },
    createElement() {
      const player = {
        handlers: {}, paused: true,
        setAttribute() {}, removeAttribute(name) { delete this[name]; },
        addEventListener(name, fn) { this.handlers[name] = fn; },
        play() { this.paused = false; return Promise.resolve(); },
        pause() { this.paused = true; }, load() { this.unloaded = true; }, remove() { this.removed = true; }
      };
      players.push(player);
      return player;
    }
  };
  vm.runInNewContext(code, {
    document, navigator: { connection: { saveData: !!options.saveData } },
    window: { matchMedia: query => query.includes('hover:') ? desktop : reduced, addEventListener() {} },
    setTimeout(fn) { const id = {}; timers.set(id, fn); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  function media() {
    const classes = new Set();
    const item = { isConnected: true, classes,
      classList: { add: c => classes.add(c), remove: c => classes.delete(c) },
      closest() { return this; }, contains(target) { return target === this; },
      getAttribute() { return '/test.mp4'; }, appendChild(player) { this.player = player; }
    };
    return item;
  }
  return { listeners, players, document, media,
    enter(target, pointerType = 'mouse') { listeners.pointerover({ target, pointerType }); },
    flush() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); }
  };
}

test('loads only after deliberate desktop hover; reveals on playback and restores photo on leave', () => {
  const h = setup(); const media = h.media();
  h.enter(media); assert.equal(h.players.length, 0);
  h.flush(); const player = h.players[0];
  assert.equal(player.muted, true); assert.equal(player.loop, true);
  assert.equal(player.playsInline, true); assert.equal(player.preload, 'none');
  assert.equal(media.classes.size, 0);
  player.handlers.playing(); assert.ok(media.classes.has('is-video-playing'));
  h.listeners.pointerout({ target: media, relatedTarget: null });
  assert.equal(media.classes.size, 0); assert.ok(player.paused && player.removed && player.unloaded);
  assert.equal(player.src, undefined);
});

test('mobile, touch, reduced motion and data saver never load videos', () => {
  for (const options of [{ desktop: false }, { reduced: true }, { saveData: true }]) {
    const h = setup(options); h.enter(h.media()); h.flush(); assert.equal(h.players.length, 0);
  }
  const h = setup(); h.enter(h.media(), 'touch'); h.flush(); assert.equal(h.players.length, 0);
});

test('brief hover cancels pending download; switching cards stops previous video', () => {
  const h = setup(); const a = h.media(); const b = h.media();
  h.enter(a); h.listeners.pointerout({ target: a, relatedTarget: null }); h.flush();
  assert.equal(h.players.length, 0);
  h.enter(a); h.flush(); h.enter(b); h.flush();
  assert.ok(h.players[0].removed && h.players[0].paused);
  assert.equal(h.players.length, 2);
});

test('click, scroll, hidden tab and media errors stop playback without affecting navigation', () => {
  for (const event of ['click', 'scroll', 'visibilitychange', 'error']) {
    const h = setup(); h.enter(h.media()); h.flush(); const player = h.players[0];
    if (event === 'error') player.handlers.error(); else h.listeners[event]({});
    assert.ok(player.removed && player.paused);
  }
});
