// 売り場をひらく／とじる
(() => {
  const aisle = document.querySelector('.aisle');
  if (!aisle) return;
  const panels = [...aisle.querySelectorAll('.panel')];
  const close = () => {
    aisle.classList.remove('has-open');
    panels.forEach(p => { p.classList.remove('is-open'); p.querySelector('.panel-open').setAttribute('aria-expanded', 'false'); });
  };
  const open = p => {
    close();
    aisle.classList.add('has-open');
    p.classList.add('is-open');
    p.querySelector('.panel-open').setAttribute('aria-expanded', 'true');
    if (matchMedia('(max-width:899px)').matches) setTimeout(() => p.scrollIntoView({behavior: 'smooth', block: 'start'}), 60);
    else p.querySelector('.close').focus({preventScroll: true});
  };
  panels.forEach(p => {
    p.querySelector('.panel-open').addEventListener('click', () => open(p));
    p.querySelector('.close').addEventListener('click', e => { e.stopPropagation(); close(); p.querySelector('.panel-open').focus({preventScroll: true}); });
    p.addEventListener('click', e => { if (!p.classList.contains('is-open') && aisle.classList.contains('has-open') && !e.target.closest('a')) open(p); });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  // otokuboy.com/#sale のように、売り場を開いた状態で来られる
  const byHash = () => { const p = location.hash.length > 1 && document.getElementById(location.hash.slice(1)); if (p && p.classList.contains('panel')) open(p); };
  addEventListener('hashchange', byHash); byHash();
})();

// 記事の一覧: キーワードでしぼる＋「もっと見る」（記事が増えても1ページが長くなりすぎないように）
document.querySelectorAll('.cards[data-page]').forEach(box => {
  const cards = [...box.children], step = +box.dataset.page || 12;
  const wrap = box.parentElement, input = wrap.querySelector('.finder input'), count = wrap.querySelector('.finder .count b'), more = wrap.querySelector('.more');
  let shown = step;
  const draw = () => {
    const q = (input ? input.value : '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hit = cards.filter(c => q.every(w => c.dataset.k.includes(w)));
    cards.forEach(c => { c.hidden = true; });
    hit.slice(0, shown).forEach(c => { c.hidden = false; });
    if (count) count.textContent = hit.length;
    if (more) more.hidden = hit.length <= shown;
  };
  if (input) input.addEventListener('input', () => { shown = step; draw(); });
  if (more) more.querySelector('button').addEventListener('click', () => { shown += step; draw(); });
  draw();
});

// 記事の「動画で見る」: 押すとその場で YouTube を再生する（押すまで YouTube には接続しない）
document.querySelectorAll('a.video[data-yt]').forEach(a => {
  a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.yt + '?autoplay=1&rel=0';
    f.title = 'YouTube 動画'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    f.className = 'yt';
    a.replaceWith(f);
  });
});
