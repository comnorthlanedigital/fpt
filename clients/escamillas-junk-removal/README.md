# Escamilla's Junk Removal & Hauling (one-page site)
- `python3 -I prepare.py` embeds fonts and optimizes the logos (src/gen); `python3 -I build.py` builds `dist/` and `zips/escamillas-netlify.zip`.
- Real media: put `truck.jpg` (hero photo, ~16:8) and `loading-trailer.mp4` (muted loop) in `assets/`, then rebuild. The page swaps the illustration for the photo and reveals the "See us work" section only when those files exist.
- Quote form posts to FormSubmit (AJAX) -> escamillasjunkremoval@gmail.com. FormSubmit emails a one-time activation link to that address the first time a request is sent: open it once, or requests will not arrive.
- Replace `https://example.com/` (canonical) in `src/index.template.html` with the real domain.
- Facts used are only those provided by the owner's family; FAQ answers are drafts for the family to confirm.
