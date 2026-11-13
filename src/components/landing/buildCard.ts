/**
 * "Build your card" coach section. The card is the editor: every line is tap-to-edit
 * (contenteditable), the pathway changes by swiping the card or tapping the arrows, and the
 * photo box opens the picker (the photo stays in the browser). Also drives the rank previews,
 * the Overall explainer and the flip to the back. Returns a cleanup for the landing page unmount.
 */
export const PATHWAYS = ['Builder', 'Founder', 'Healer', 'Reformer', 'Warrior', 'Seeker'] as const;

const RANKS: Record<string, { ovr: number; label: string; note: string }> = {
  bronze: { ovr: 60, label: 'Bronze', note: 'Every coach starts here. Tap a rank to see where your card is headed.' },
  silver: { ovr: 79, label: 'Silver', note: 'Silver: a coach who shows up and gets strong ratings.' },
  gold: { ovr: 89, label: 'Gold', note: 'Gold: one of the most trusted coaches on your path.' },
};

/** Horizontal travel (px) a touch needs before it counts as a swipe. */
const SWIPE_MIN = 40;

export function initBuildCard(root: HTMLElement): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
  const card = root.querySelector<HTMLElement>('#bcCard');
  const back = root.querySelector<HTMLElement>('#bcCardBack');
  if (!card || !back) return () => {};

  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Document,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
    opts?: AddEventListenerOptions,
  ) => {
    el.addEventListener(type, fn as EventListener, opts);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
  };

  // ---------- tap-to-edit lines ----------
  const edits = [...card.querySelectorAll<HTMLElement>('.bc-edit')];
  const field = (name: string) => edits.find((el) => el.dataset.field === name)!;
  const text = (el: HTMLElement) => (el.textContent || '').replace(/\s+/g, ' ').trim();
  for (const el of edits) {
    el.contentEditable = 'plaintext-only';
    if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
    el.spellcheck = false;
    el.setAttribute('role', 'textbox');
    el.setAttribute('aria-label', el.dataset.label || el.dataset.ph || '');
    el.setAttribute('enterkeyhint', 'done');
  }

  const claim = $<HTMLAnchorElement>('bcClaim');
  const base = claim.getAttribute('href') || '';
  let pathIndex = 0;

  function render() {
    const path = PATHWAYS[pathIndex];
    const q = new URLSearchParams({ role: 'coach', pathway: path });
    const name = text(field('name'));
    const role = text(field('role'));
    const co = text(field('co'));
    const city = text(field('city'));
    if (name) q.set('name', name);
    if (role) q.set('title', role);
    if (co) q.set('company', co);
    if (city) q.set('city', city);
    claim.href = base + '?' + q.toString();
  }

  const placeCaretAtEnd = (el: HTMLElement) => {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  on(card, 'input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.bc-edit');
    if (!el) return;
    const max = Number(el.dataset.max) || 24;
    const raw = (el.textContent || '').replace(/\n/g, ' ');
    if (!raw.trim()) {
      // clear the <br> some browsers leave behind so the placeholder shows again
      if (el.innerHTML !== '') el.textContent = '';
    } else if (raw.length > max) {
      el.textContent = raw.slice(0, max);
      placeCaretAtEnd(el);
    }
    render();
  });
  on(card, 'keydown', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.bc-edit');
    if (!el) return;
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      el.blur();
    }
  });
  on(card, 'paste', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.bc-edit');
    if (!el) return;
    e.preventDefault();
    const pasted = (e.clipboardData?.getData('text/plain') || '').replace(/\s+/g, ' ');
    document.execCommand('insertText', false, pasted);
  });
  on(card, 'drop', (e) => {
    if ((e.target as HTMLElement).closest('.bc-edit')) e.preventDefault();
  });
  on(card, 'focusin', (e) => {
    if ((e.target as HTMLElement).closest('.bc-edit')) root.querySelector('#bcHint')?.classList.add('used');
  });

  // ---------- pathway: swipe the card or use the arrows ----------
  const pathEls = [$('bcWater'), $('bcPathLbl'), $('bcBackPath')];
  const glowHost = root.querySelector<HTMLElement>('.bc-left');
  function setPath(next: number, dir: number) {
    pathIndex = (next + PATHWAYS.length) % PATHWAYS.length;
    const path = PATHWAYS[pathIndex];
    card!.dataset.path = path;
    back!.dataset.path = path;
    for (const el of pathEls) el.textContent = path;
    const accent = getComputedStyle(card!).getPropertyValue('--a').trim();
    if (accent) glowHost?.style.setProperty('--bc-glow', accent);
    card!.classList.remove('swap-next', 'swap-prev');
    void card!.offsetWidth;
    card!.classList.add(dir > 0 ? 'swap-next' : 'swap-prev');
    render();
  }
  for (const btn of root.querySelectorAll<HTMLButtonElement>('.bc-path-arrow')) {
    on(btn, 'click', () => {
      const dir = Number(btn.dataset.dir) || 1;
      setPath(pathIndex + dir, dir);
    });
  }
  let touch: { x: number; y: number; editing: boolean } | null = null;
  let swiped = false;
  on(
    card,
    'touchstart',
    (e) => {
      const t = e.touches[0];
      const target = e.target as HTMLElement;
      const editing = !!target.closest('.bc-edit') && document.activeElement === target.closest('.bc-edit');
      touch = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, editing } : null;
    },
    { passive: true },
  );
  on(
    card,
    'touchend',
    (e) => {
      if (!touch || touch.editing) {
        touch = null;
        return;
      }
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      swiped = true;
      window.setTimeout(() => (swiped = false), 400);
      const dir = dx < 0 ? 1 : -1;
      setPath(pathIndex + dir, dir);
    },
    { passive: true },
  );
  // a swipe that starts on the photo box should not also open the photo picker
  on(
    card,
    'click',
    (e) => {
      if (!swiped) return;
      e.preventDefault();
      e.stopPropagation();
    },
    { capture: true },
  );

  // ---------- photo: read locally, never uploaded ----------
  const file = $<HTMLInputElement>('bcPhoto');
  const img = $<HTMLImageElement>('bcPhotoImg');
  const add = $('bcAdd');
  const box = $('bcPhotoBox');
  const clr = $<HTMLButtonElement>('bcClear');
  let url: string | null = null;
  on(file, 'change', () => {
    const fl = file.files && file.files[0];
    if (!fl || !fl.type.startsWith('image/')) return;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(fl);
    img.src = url;
    img.alt = 'Your photo';
    img.hidden = false;
    add.hidden = true;
    box.classList.add('has');
    clr.hidden = false;
    setFlipped(false);
  });
  on(clr, 'click', () => {
    if (url) URL.revokeObjectURL(url);
    url = null;
    img.hidden = true;
    img.removeAttribute('src');
    add.hidden = false;
    box.classList.remove('has');
    clr.hidden = true;
    file.value = '';
  });

  // ---------- rank previews: Silver and Gold; Platinum stays a mystery ----------
  const rankBtns = [...root.querySelectorAll<HTMLButtonElement>('.bc-ranks button')];
  const note = $('bcRankNote');
  for (const b of rankBtns) {
    on(b, 'click', () => {
      const r = b.dataset.rank!;
      if (r === 'platinum') {
        note.textContent = 'Platinum stays a mystery. Unlock it in the app.';
        return;
      }
      rankBtns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      card.dataset.rank = r;
      back.dataset.rank = r;
      $('bcOvr').textContent = String(RANKS[r].ovr);
      $('bcRank').textContent = RANKS[r].label;
      $('bcBackOvr').textContent = String(RANKS[r].ovr);
      $('bcBackRank').textContent = RANKS[r].label;
      $('bcPrev').hidden = r === 'bronze';
      note.textContent = RANKS[r].note;
    });
  }

  // ---------- the ? next to Overall explains how it's made up ----------
  const qb = $<HTMLButtonElement>('bcQBtn');
  const pop = $('bcQ');
  const showQ = (open: boolean) => {
    pop.hidden = !open;
    qb.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  on(qb, 'click', (e) => {
    e.stopPropagation();
    showQ(pop.hidden);
  });
  on(document, 'click', (e) => {
    if (!pop.hidden && !pop.contains(e.target as Node)) showQ(false);
  });
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) {
      showQ(false);
      qb.focus();
    }
  });

  // ---------- flip to see what comes with the card; the hidden face is inert ----------
  const flip = $('bcFlip');
  const left = root.querySelector<HTMLElement>('.bc-left')!;
  const flipBtn = $<HTMLButtonElement>('bcFlipBtn');
  const flipLabel = $('bcFlipLabel');
  function setFlipped(flipped: boolean) {
    flip.classList.toggle('is-flipped', flipped);
    left.classList.toggle('is-flipped', flipped);
    flipBtn.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    flipLabel.textContent = flipped ? 'Flip back' : 'Flip to see what you get';
    card!.inert = flipped;
    card!.setAttribute('aria-hidden', flipped ? 'true' : 'false');
    back!.inert = !flipped;
    back!.setAttribute('aria-hidden', flipped ? 'false' : 'true');
    if (flipped) {
      showQ(false);
      if (document.activeElement instanceof HTMLElement && card!.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }
  }
  on(flipBtn, 'click', () => setFlipped(!flip.classList.contains('is-flipped')));
  on(back, 'click', () => setFlipped(false));

  setFlipped(false);
  render();

  return () => {
    cleanups.forEach((fn) => fn());
    if (url) URL.revokeObjectURL(url);
  };
}
