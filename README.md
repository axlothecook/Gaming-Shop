# Gaming-Shop

API-only backend for the Gaming Shop inventory app — Node.js + Express + MongoDB
CRUD over games, genres, and developers.

## Related repositories

- [Front end](https://github.com/axlothecook/Gaming-shop-frontend.git)
- [gaming-shop-deploy](https://github.com/axlothecook/gaming-shop-deploy)

## Stack (what each tool is for)

- **Express 5** — the HTTP API / routing.
- **MongoDB** (`mongodb` driver) — stores the games/genres/developers documents
  (including each item's image URL).
- **multer** — parses multipart/form-data image uploads (in memory).
- **express-validator** — validates + sanitizes request input.
- **Cloudflare R2** (`@aws-sdk/client-s3`) — image file storage, S3-compatible.
  See `storage.js`, a thin wrapper that talks to R2 but keeps the old
  `.storage.from().upload()` shape. (Migrated off Supabase, which pauses
  free-tier projects after 7 days idle.)
- **morgan** — request logging. **cors** — cross-origin access for the frontend.
- **dotenv** — loads config/secrets from `.env`. **nodemon** (dev) — auto-restart.

Deploy + env details live in the sibling `gaming-shop-deploy` repo.
