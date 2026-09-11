# SEO and SSR Deployment

## Environment

Set the production URL before generating canonical URLs and the sitemap:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-production-domain.example
```

Social profile URLs are intentionally empty until they are provided; the Organization schema emits an empty `sameAs` array.

## Build and SSR

```bash
npm ci
npm run build:ssr
php artisan migrate --force
php artisan seo:generate-sitemap
php artisan optimize
php artisan inertia:check-ssr
```

Run the scheduler with one cron entry:

```cron
* * * * * cd /var/www/cps && php artisan schedule:run >> /dev/null 2>&1
```

## Supervisor

Create `/etc/supervisor/conf.d/cps-inertia-ssr.conf`:

```ini
[program:cps-inertia-ssr]
process_name=%(program_name)s
command=php /var/www/cps/artisan inertia:start-ssr
directory=/var/www/cps
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/cps-inertia-ssr.log
stopwaitsecs=3600
```

Apply it:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart cps-inertia-ssr
php artisan inertia:check-ssr
```

## Sitemap and robots

- `php artisan seo:generate-sitemap` writes `public/sitemap.xml`.
- The scheduler regenerates it daily.
- `/robots.txt` allows public pages and disallows admin/auth/settings paths.
- Replace the relative sitemap directive in `public/robots.txt` with the absolute production URL if your deployment requires it.
