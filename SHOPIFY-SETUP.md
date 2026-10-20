# FPT Matchday Night: install guide

## Upload (safe, does not touch the live store)
1. Shopify admin > **Online Store > Themes**.
2. **Add theme > Upload zip file** and pick `fpt-matchday-night-shopify-theme.zip`.
3. It appears under *Theme library*. Click **Customize** to preview. Nothing changes for customers until you press **Publish**.

## Set it up (5 minutes)
- **Logo:** Customize > Theme settings > Logo & favicon. Upload the transparent logo (the zip already includes one as a fallback).
- **Menus:** the header uses the menu named `main-menu`, the footer uses `footer` (Online Store > Navigation). Change them in the Header and Footer sections if yours are named differently.
- **Home page:** every section is editable. The collection pickers are pre-set to the store's real collection handles
  (premier-league-jersey, international-jersey, liga-mx-jersey and so on). If one shows empty, pick the collection again.
- **Colors:** Theme settings > Brand colors (black, gold and deep green are the defaults).
- **Announcement bar:** Header group > Announcement bar.

## Name & number (how it works)
Product pages show a **Make it yours** box with a live jersey preview. What the shopper types is saved on the order as
line item properties **Name**, **Number** and **Notes**, so you see them in the order and in packing slips.
- Hide it on a product (shin guards, gift cards): add the tag `no-personalization` to that product.
- Your products already have a "Personalization" option. If you keep it, shoppers see both. To avoid duplication, remove that option
  from the product, or turn the box off in the product section settings.

## Things to know
- Not tested on a live Shopify store. It passes Shopify's own Theme Check (no errors) and the cart / personalization flow was tested against a simulated store.
- Filters on collection pages come from the **Search & Discovery** app (free). Without it the page still works with sorting only.
- Dynamic checkout buttons (Apple Pay and others) appear only if enabled in your payment settings.
- Fonts (Anton, Inter) load from Google Fonts.
- To roll back: Themes > your old theme > **Publish**.
