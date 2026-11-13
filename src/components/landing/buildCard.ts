/**
 * "Build your card" coach section: live card preview, rank previews, the Overall
 * explainer and a local-only photo. Ported from ISO_Coach_Card/coach-card-script.html.
 * Returns a cleanup function so the document listeners go away when the landing page unmounts.
 */
export function initBuildCard(root: HTMLElement): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
  const card = root.querySelector<HTMLElement>('#bcCard');
  const back = root.querySelector<HTMLElement>('#bcCardBack');
  if (!card || !back) return () => {};

  const input = (id: string) => $<HTMLInputElement>(id);
  const f = {
    name: input('bcInName'),
    city: input('bcInCity'),
    role: input('bcInRole'),
    co: input('bcInCo'),
    b1: input('bcInB1'),
    s1: input('bcInS1'),
    b2: input('bcInB2'),
    s2: input('bcInS2'),
    b3: input('bcInB3'),
    s3: input('bcInS3'),
  };
  const put = (el: HTMLElement, val: string) => {
    const v = (val || '').trim();
    el.textContent = v || el.dataset.ph || '';
    el.classList.toggle('ph', !v);
  };
  const claim = $<HTMLAnchorElement>('bcClaim');
  const base = claim.getAttribute('href') || '';

  function render() {
    const path = root.querySelector<HTMLInputElement>('input[name="bcPath"]:checked')?.value || 'Builder';
    card!.dataset.path = path;
    back!.dataset.path = path;
    $('bcWater').textContent = path;
    $('bcPathLbl').textContent = path;
    $('bcBackPath').textContent = path;
    put($('bcName'), f.name.value);
    const role = f.role.value.trim();
    const co = f.co.value.trim();
    const city = f.city.value.trim() || 'Denver, CO';
    const meta = [role || 'Your role', co || 'Company'].join(', ') + ' · ' + city;
    $('bcMeta').textContent = meta;
    $('bcMeta').classList.toggle('ph', !role && !co);
    for (const k of [1, 2, 3] as const) {
      put($(`bcB${k}`), f[`b${k}`].value);
      put($(`bcS${k}`), f[`s${k}`].value);
    }
    const q = new URLSearchParams({ role: 'coach', pathway: path });
    if (f.name.value.trim()) q.set('name', f.name.value.trim());
    if (role) q.set('title', role);
    if (co) q.set('company', co);
    claim.href = base + '?' + q.toString();
  }

  const form = $<HTMLFormElement>('bcForm');
  const onSubmit = (e: Event) => e.preventDefault();
  // typing shows the front again so the change is visible; pathway colors also show on the back
  const onInput = (e: Event) => {
    render();
    if ((e.target as HTMLInputElement).type !== 'radio') setFlipped(false);
  };
  form.addEventListener('input', onInput);
  form.addEventListener('submit', onSubmit);

  // photo stays in the browser: read it locally, never upload
  const file = $<HTMLInputElement>('bcPhoto');
  const img = $<HTMLImageElement>('bcPhotoImg');
  const add = $('bcAdd');
  const box = $('bcPhotoBox');
  const clr = $<HTMLButtonElement>('bcClear');
  let url: string | null = null;
  const onFile = () => {
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
  };
  const onClear = () => {
    if (url) URL.revokeObjectURL(url);
    url = null;
    img.hidden = true;
    img.removeAttribute('src');
    add.hidden = false;
    box.classList.remove('has');
    clr.hidden = true;
    file.value = '';
  };
  file.addEventListener('change', onFile);
  clr.addEventListener('click', onClear);

  // preview the card at Silver and Gold; Platinum stays a mystery
  const RANKS: Record<string, { ovr: number; label: string; note: string }> = {
    bronze: { ovr: 60, label: 'Bronze', note: 'Every coach starts here. Tap a rank to see where your card is headed.' },
    silver: { ovr: 79, label: 'Silver', note: 'Silver: a coach who shows up and gets strong ratings.' },
    gold: { ovr: 89, label: 'Gold', note: 'Gold: one of the most trusted coaches on your path.' },
  };
  const rankBtns = [...root.querySelectorAll<HTMLButtonElement>('.bc-ranks button')];
  const note = $('bcRankNote');
  const rankHandlers = rankBtns.map((b) => {
    const onRank = () => {
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
    };
    b.addEventListener('click', onRank);
    return onRank;
  });

  // the ? next to Overall explains how it's made up
  const qb = $<HTMLButtonElement>('bcQBtn');
  const pop = $('bcQ');
  const showQ = (on: boolean) => {
    pop.hidden = !on;
    qb.setAttribute('aria-expanded', on ? 'true' : 'false');
  };
  const onQ = (e: MouseEvent) => {
    e.stopPropagation();
    showQ(pop.hidden);
  };
  const onDocClick = (e: MouseEvent) => {
    if (!pop.hidden && !pop.contains(e.target as Node)) showQ(false);
  };
  const onDocKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !pop.hidden) {
      showQ(false);
      qb.focus();
    }
  };
  qb.addEventListener('click', onQ);
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKey);

  // flip the card to see what comes with it; the hidden face is inert so nothing on it takes focus
  const flip = $('bcFlip');
  const left = root.querySelector<HTMLElement>('.bc-left')!;
  const flipBtn = $<HTMLButtonElement>('bcFlipBtn');
  const flipLabel = $('bcFlipLabel');
  function setFlipped(on: boolean) {
    flip.classList.toggle('is-flipped', on);
    left.classList.toggle('is-flipped', on);
    flipBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    flipLabel.textContent = on ? 'Flip back' : 'Flip to see what you get';
    card!.inert = on;
    card!.setAttribute('aria-hidden', on ? 'true' : 'false');
    back!.inert = !on;
    back!.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (on) showQ(false);
  }
  const onFlip = () => setFlipped(!flip.classList.contains('is-flipped'));
  const onBackClick = () => setFlipped(false);
  flipBtn.addEventListener('click', onFlip);
  back.addEventListener('click', onBackClick);

  setFlipped(false);
  render();

  return () => {
    form.removeEventListener('input', onInput);
    flipBtn.removeEventListener('click', onFlip);
    back.removeEventListener('click', onBackClick);
    form.removeEventListener('submit', onSubmit);
    file.removeEventListener('change', onFile);
    clr.removeEventListener('click', onClear);
    rankBtns.forEach((b, i) => b.removeEventListener('click', rankHandlers[i]));
    qb.removeEventListener('click', onQ);
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onDocKey);
    if (url) URL.revokeObjectURL(url);
  };
}
