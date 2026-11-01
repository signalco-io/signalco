() => {
    const all = [...document.querySelectorAll('body *')];
    const visible = all.filter(el => { const rect = el.getBoundingClientRect(); return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && rect.width > 1 && rect.height > 1 && rect.right > 0 && rect.left < innerWidth && rect.bottom > 0; });
    const samples = new Map();
    for (const el of visible.slice(0, 6000)) {
        const s = getComputedStyle(el);
        const text = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join(' ').trim();
        if (!text && !el.matches('button,a,input,body,main,section,header,footer')) continue;
        let parent = el, background = s.backgroundColor;
        while (background === 'rgba(0, 0, 0, 0)' && parent.parentElement) { parent = parent.parentElement; background = getComputedStyle(parent).backgroundColor; }
        if (background === 'rgba(0, 0, 0, 0)') background = 'rgb(255, 255, 255)';
        const item = { tag: el.tagName.toLowerCase(), text: text.slice(0, 100), color: s.color, background, family: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, spacing: s.letterSpacing, count: 1 };
        const key = [item.tag,item.color,item.background,item.family,item.size,item.weight,item.lineHeight,item.spacing].join('|');
        if (samples.has(key)) samples.get(key).count++; else if (samples.size < 500) samples.set(key, item);
    }
    const name = el => (el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') || '').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ') || el.textContent || el.getAttribute('alt') || el.getAttribute('title') || '').trim();
    const checks = [];
    const add = (label, elements) => checks.push({ label, count: elements.length, examples: elements.slice(0, 5).map(el => el.outerHTML.slice(0, 180)) });
    add('Images missing an alt attribute', visible.filter(el => el.matches('img:not([alt])')));
    add('Buttons without an accessible name', visible.filter(el => el.matches('button,[role="button"]') && !name(el) && !el.querySelector('img[alt]:not([alt=""])')));
    add('Links without an accessible name', visible.filter(el => el.matches('a[href]') && !name(el) && !el.querySelector('img[alt]:not([alt=""])')));
    add('Form fields without a label', visible.filter(el => el.matches('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]),select,textarea') && !el.labels?.length && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title')));
    add('Positive tabindex values', visible.filter(el => Number(el.getAttribute('tabindex')) > 0));
    const headings = visible.filter(el => /^H[1-6]$/.test(el.tagName)).map(el => ({level:Number(el.tagName[1]),text:el.textContent.trim().slice(0,200)}));
    return { styles: [...samples.values()], checks, title: document.title, language: document.documentElement.lang, headings, sampled: Math.min(visible.length,6000), total: visible.length };
}
