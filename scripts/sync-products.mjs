// Snapshots the live store's public catalog into public/data so the demo
// works offline and doesn't depend on Shopify's CORS rules.
import { writeFile } from 'node:fs/promises'

const STORE = 'https://fpt831sportz.myshopify.com'

async function fetchAll(path, key) {
  const items = []
  for (let page = 1; ; page++) {
    let res
    // Shopify rate-limits the public JSON endpoints; back off and retry on 429.
    for (let attempt = 0; attempt < 6; attempt++) {
      res = await fetch(`${STORE}/${path}?limit=250&page=${page}`)
      if (res.status !== 429) break
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
    }
    if (!res.ok) throw new Error(`${path} page ${page}: HTTP ${res.status}`)
    const batch = (await res.json())[key]
    if (!batch.length) break
    items.push(...batch)
  }
  return items
}

const products = (await fetchAll('products.json', 'products')).map((p) => ({
  id: p.id,
  title: p.title,
  handle: p.handle,
  type: p.product_type,
  tags: p.tags,
  createdAt: p.created_at,
  price: Math.min(...p.variants.map((v) => Number(v.price))),
  compareAt: Math.max(0, ...p.variants.map((v) => Number(v.compare_at_price) || 0)) || null,
  available: p.variants.some((v) => v.available),
  options: p.options.map((o) => ({ name: o.name, values: o.values })),
  images: p.images.map((i) => i.src),
}))
const collections = (await fetchAll('collections.json', 'collections')).map((c) => ({
  id: c.id,
  title: c.title,
  handle: c.handle,
  count: c.products_count,
  image: c.image?.src ?? null,
}))

await writeFile('public/data/products.json', JSON.stringify(products))
await writeFile('public/data/collections.json', JSON.stringify(collections))
console.log(`Saved ${products.length} products, ${collections.length} collections`)
