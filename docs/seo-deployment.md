# SEO and SSR Deployment

## Environment

Set the production URL before generating canonical URLs and the sitemap:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-production-domain.example
```

Social profile URLs are intentionally empty until they are provided; the Organization schema emits an empty `sameAs` array.

## Build and deployment

This application uses client-side rendering and does not require an Inertia SSR process.

```bash
npm ci
npm run build
php artisan migrate --force
php artisan seo:generate-sitemap
php artisan optimize
```

Run the scheduler with one cron entry:

```cron
* * * * * cd /var/www/cps && php artisan schedule:run >> /dev/null 2>&1
```

## Server process

No Inertia SSR worker or Supervisor process is required. Serve the Laravel application normally after completing the build and migration steps above.

## Sitemap and robots

- `php artisan seo:generate-sitemap` writes `public/sitemap.xml`.
- The scheduler regenerates it daily.
- `/robots.txt` allows public pages and disallows admin/auth/settings paths.
- Replace the relative sitemap directive in `public/robots.txt` with the absolute production URL if your deployment requires it.
