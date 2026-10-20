// Local preview harness: renders the theme's Liquid with mock Shopify objects built from the real catalog.
import { Liquid } from 'liquidjs'
import fs from 'node:fs'
import path from 'node:path'

const THEME = '/home/user/fpt/shopify-theme'
const OUT = process.argv[2]
const cat = JSON.parse(fs.readFileSync('/home/user/fpt/public/data/catalog.json', 'utf8'))
const en = JSON.parse(fs.readFileSync(`${THEME}/locales/en.default.json`, 'utf8'))
const schemaSettings = JSON.parse(fs.readFileSync(`${THEME}/config/settings_schema.json`, 'utf8'))
const settings = {}
for (const g of schemaSettings) for (const s of g.settings || []) if (s.id) settings[s.id] = s.default ?? (s.type === 'checkbox' ? false : '')

const money = (c) => '$' + (c / 100).toFixed(2)
const img = (m, w) => `${cat.cdn}${m}${m.includes('?') ? '&' : '?'}width=${w || 600}`
const mkProduct = (p, i) => {
  const imgs = [{ src: img(p.m, 800), alt: p.t, width: 800, height: 800, id: 100 + i }]
  return {
    id: 9000 + i, title: p.t, handle: p.h, url: `/products/${p.h}`, vendor: 'FPTSPORTZ', price: Math.round(p.p * 100), compare_at_price: 0, price_varies: false,
    available: !!p.a, featured_image: imgs[0], images: imgs, media: imgs.map((m) => ({ ...m, media_type: 'image', preview_image: m })), tags: [],
    has_only_default_variant: false, description: '<p>* REMEMBER: add any other name or number or professional player at checkout.</p>',
    options_with_values: [{ name: 'Size', position: 1, selected_value: 'Small', values: ['Small', 'Medium', 'Large', 'XL'] }, { name: 'Patches', position: 2, selected_value: 'None', values: ['None', 'UCL', 'La Liga'] }],
    options: ['Size', 'Patches'],
    variants: ['Small', 'Medium', 'Large', 'XL'].flatMap((s, si) => ['None', 'UCL', 'La Liga'].map((pt, pi) => ({ id: 1000 + si * 10 + pi, title: `${s} / ${pt}`, options: [s, pt], price: Math.round(p.p * 100), compare_at_price: 0, available: true, featured_media: null }))),
    selected_or_first_available_variant: { id: 1000, available: true, featured_media: { id: 100 + i }, price: Math.round(p.p * 100) },
  }
}
const colProducts = (idx) => cat.products.filter((p) => p.c.includes(idx)).slice(0, 60).map(mkProduct)
const collections = {}
cat.collections.forEach((c, ci) => {
  const prods = colProducts(ci)
  collections[c.handle] = { title: c.title, handle: c.handle, url: `/collections/${c.handle}`, products: prods, products_count: c.count, all_products_count: c.count, description: '', image: null, filters: [], sort_options: [{ name: 'Featured', value: 'manual' }, { name: 'Price, low to high', value: 'price-ascending' }], sort_by: 'manual' }
})
const allProducts = cat.products.slice(0, 80).map(mkProduct)
collections.all = { title: 'Products', handle: 'all', url: '/collections/all', products: allProducts, products_count: 3197, all_products_count: 3197, filters: [], sort_options: [], sort_by: 'manual' }

const engine = new Liquid({ root: [THEME], partials: [`${THEME}/snippets`], extname: '.liquid', jsTruthy: false, strictFilters: false, strictVariables: false })
const kv = (args) => { const o = {}; for (const a of args) if (Array.isArray(a)) o[a[0]] = a[1]; return o }
const lookup = (key) => key.split('.').reduce((o, k) => o?.[k], en)
engine.registerFilter('t', function (key, ...args) {
  const o = kv(args); let v = lookup(key)
  if (v && typeof v === 'object') v = o.count === 1 ? v.one : v.other
  if (v == null) return `[missing ${key}]`
  return String(v).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => o[k] ?? '')
})
engine.registerFilter('asset_url', (f) => `/assets/${f}`)
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`)
engine.registerFilter('money', (c) => money(c))
engine.registerFilter('money_without_currency', (c) => (c / 100).toFixed(2))
engine.registerFilter('image_url', (i, ...a) => { const o = kv(a); return (i?.src || i || '').toString().replace(/width=\d+/, `width=${o.width || 600}`) })
engine.registerFilter('image_tag', (url, ...a) => { const o = kv(a); return `<img src="${url}" alt="${(o.alt || '').toString().replace(/"/g, '&quot;')}"${o.class ? ` class="${o.class}"` : ''} loading="${o.loading || 'lazy'}">` })
engine.registerFilter('placeholder_svg_tag', (n, cls) => `<svg class="${cls || ''}" viewBox="0 0 10 10"><rect width="10" height="10" fill="#ddd"/></svg>`)
engine.registerFilter('payment_type_svg_tag', () => '<span class="pay">VISA · MC · AMEX · SHOP</span>')
engine.registerFilter('handleize', (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-'))
engine.registerFilter('time_tag', (d) => `<time>${d}</time>`)
engine.registerFilter('format_code', (c) => c)
engine.registerFilter('default_errors', () => '')
engine.registerFilter('media_tag', () => '')
engine.registerFilter('payment_button', () => '<div class="shopify-payment-button"><button class="shopify-payment-button__button" style="width:100%;padding:16px;background:#5a31f4;color:#fff;border:0">Buy with Shop</button></div>')
engine.registerFilter('format_address', () => '<p>Address</p>')

const tagBlock = (name, end, onRender) => engine.registerTag(name, {
  parse(tag, tokens) {
    this.args = tag.args; this.tpls = []
    const stream = this.liquid.parser.parseStream(tokens).on(`tag:${end}`, () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error(`${end} missing`) })
    stream.start()
  },
  *render(ctx, emitter) { yield* onRender.call(this, ctx, emitter) },
})
tagBlock('schema', 'endschema', function* () {})
tagBlock('style', 'endstyle', function* (ctx, emitter) { emitter.write('<style>'); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); emitter.write('</style>') })
tagBlock('form', 'endform', function* (ctx, emitter) {
  const cls = (this.args.match(/class:\s*'([^']+)'/) || [])[1] || ''
  emitter.write(`<form method="post" class="${cls}" data-product-form id="f">`)
  ctx.push({ form: { posted_successfully: false, errors: null } })
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter)
  ctx.pop(); emitter.write('</form>')
})
tagBlock('paginate', 'endpaginate', function* (ctx, emitter) {
  ctx.push({ paginate: { pages: 3, current_page: 1, parts: [{ title: 1, is_link: false }, { title: 2, is_link: true, url: '#' }, { title: 3, is_link: true, url: '#' }], next: { url: '#' }, previous: null } })
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); ctx.pop()
})

const sectionFile = (type) => fs.readFileSync(`${THEME}/sections/${type}.liquid`, 'utf8')
const defaultsOf = (src) => { const m = src.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/); return m ? JSON.parse(m[1]) : {} }
const resolve = (setting, v) => { if (setting?.type === 'collection' && typeof v === 'string') return collections[v] || null; return v }
async function renderSection(id, def) {
  const src = sectionFile(def.type); const schema = defaultsOf(src)
  const settings = {}
  for (const s of schema.settings || []) if (s.id) settings[s.id] = resolve(s, def.settings?.[s.id] ?? s.default ?? (s.type === 'checkbox' ? false : s.type === 'link_list' ? { links: [{ title: 'Home', url: '/', links: [] }, { title: 'Shop', url: '/collections/all', links: [] }, { title: 'World Cup', url: '/collections/international-jersey', links: [] }, { title: 'Retro', url: '/collections/retro-vintage-jersey', links: [] }] } : ''))
  const order = def.block_order || Object.keys(def.blocks || {})
  const blocks = order.map((bid) => { const b = def.blocks[bid]; const bs = (schema.blocks || []).find((x) => x.type === b.type); const st = {}; for (const s of bs?.settings || []) st[s.id] = resolve(s, b.settings?.[s.id] ?? s.default ?? (s.type === 'link_list' ? { links: [{ title: 'Link', url: '#' }] } : '')); return { id: bid, type: b.type, settings: st, shopify_attributes: '' } })
  return `<div id="shopify-section-${id}" class="shopify-section">${await engine.parseAndRender(src, { ...globals, template: { name: 'x' }, section: { id, settings, blocks, type: def.type } })}</div>`
}
engine.registerTag('sections', { parse(tag) { this.name = tag.args.trim().replace(/['"]/g, '') }, *render(ctx, emitter) { const g = JSON.parse(fs.readFileSync(`${THEME}/sections/${this.name}.json`, 'utf8')); for (const id of g.order) emitter.write(yield renderSection(id, g.sections[id])) } })
engine.registerTag('content_for', { parse() {}, render() {} })

const globals = {
  settings, shop: { name: 'FPTSPORTZ', money_format: '${{amount}}', enabled_payment_types: ['visa'], customer_accounts_enabled: true, url: 'https://fptsportz.myshopify.com' },
  routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_update_url: '/cart/update', search_url: '/search', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', account_logout_url: '/account/logout', all_products_collection_url: '/collections/all', product_recommendations_url: '/recommendations/products' },
  cart: { item_count: 0, total_price: 0, note: '', items: [], currency: { iso_code: 'USD' } }, request: { locale: { iso_code: 'en' }, design_mode: false },
  collections, canonical_url: 'https://fptsportz.myshopify.com/', content_for_header: '', powered_by_link: '', current_page: 1, current_tags: null, linklists: {}, search: { terms: '', performed: false, results: [], results_count: 0 },
}
const layout = fs.readFileSync(`${THEME}/layout/theme.liquid`, 'utf8')
async function page(name, template, extra = {}) {
  const t = JSON.parse(fs.readFileSync(`${THEME}/templates/${template}.json`, 'utf8'))
  let body = ''
  for (const id of t.order) body += await renderSection(id, t.sections[id]).catch((e) => `<pre>${e.message}</pre>`)
  const scope = { ...globals, ...extra, template: { name: template }, page_title: name }
  // section rendering needs the same extras (product etc.)
  const withExtra = async (id, def) => engine.parseAndRender(sectionFile(def.type), { ...scope, section: { id } })
  void withExtra
  const html = await engine.parseAndRender(layout.replace('{{ content_for_layout }}', body.replaceAll('{', '&#123;') === body ? body : body), scope)
  fs.writeFileSync(path.join(OUT, `${name}.html`), html)
}
fs.mkdirSync(OUT, { recursive: true })
// extras are injected through globals so sections can read `product`, `collection`
const prod = allProducts[2]
Object.assign(globals, { product: prod, collection: collections['premier-league-jersey'] })
await page('index', 'index')
await page('product', 'product', { product: prod })
await page('collection', 'collection', { collection: collections['premier-league-jersey'] })
console.log('rendered', fs.readdirSync(OUT))
