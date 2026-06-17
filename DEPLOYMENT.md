# VPS Deploy

1. Copy `.env.example` to `.env` and set `SITE_DOMAIN`.
2. Set `NEXT_PUBLIC_USE_MOCK_DATA=true` only for demo/offline frontend hosting.
3. Build and start:

```sh
docker compose up -d --build
```

4. Check status:

```sh
docker compose ps
docker compose logs -f web caddy
```

Public `NEXT_PUBLIC_*` values are baked into the Next.js client at image build time. Rebuild after changing them.
