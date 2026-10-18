// Builds public/data/catalog.json (slim, fptsportz only) with collection membership, retro years and cover images.
import { readFile, writeFile } from 'node:fs/promises'

const STORE = 'https://fptsportz.myshopify.com'
const CDN = 'https://cdn.shopify.com/s/files/1/0586/4855/9778/'
const get = async (path) => {
  for (let a = 0; a < 7; a++) {
    const r = await fetch(`${STORE}${path}`)
    if (r.status === 429) { await new Promise((s) => setTimeout(s, 2000 * 2 ** a)); continue }
    if (!r.ok) throw new Error(`${path}: ${r.status}`)
    return r.json()
  }
  throw new Error(`${path}: rate limited`)
}

const all = JSON.parse(await readFile('public/data/products.json', 'utf8')).filter((p) => p.store === 'fpt')
const cols = (await get('/collections.json?limit=250')).collections
  .filter((c) => c.products_count > 0 && !/sale|merch|hot|giftcard|^nfl$|copia/i.test(c.title))
const index = new Map(all.map((p) => [p.handle, p]))
const membership = new Map()
for (const [ci, c] of cols.entries()) {
  for (let page = 1; ; page++) {
    const { products } = await get(`/collections/${c.handle}/products.json?limit=250&page=${page}&fields=handle`)
    if (!products.length) break
    for (const { handle } of products) (membership.get(handle) ?? membership.set(handle, []).get(handle)).push(ci)
  }
}
const short = (u) => u.startsWith(CDN) ? u.slice(CDN.length) : null
const products = all.filter((p) => p.images[0] && short(p.images[0])).map((p) => {
  const y = (p.title.match(/\b(19[5-9]\d|20[0-2]\d)\b/) || [])[1]
  return { t: p.title.replace(/\(SALE\)\s*/i, '').replace('Stantard', 'Standard'), h: p.handle, p: p.price, m: short(p.images[0]), c: membership.get(p.handle) ?? [], y: y ? Number(y) : 0, a: p.available ? 1 : 0 }
})
const collections = cols.map((c, ci) => {
  const first = products.find((p) => p.c.includes(ci))
  return { handle: c.handle, title: c.title.replace(/\s*Jerseys?$/i, '').replace(/\//g, ' / ').replace(/\s+/g, ' ').trim(), count: c.products_count, cover: first?.m ?? null }
})
await writeFile('public/data/catalog.json', JSON.stringify({ cdn: CDN, collections, products }))
console.log(products.length, 'products,', collections.length, 'collections;', products.filter((p) => p.y).length, 'with a year')
