<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'seo:generate-sitemap';

    protected $description = 'Generate the public XML sitemap.';

    public function handle(): int
    {
        $paths = ['/', '/about', '/services', '/industries', '/projects', '/consultation', '/contact'];
        $sitemap = Sitemap::create();

        foreach ($paths as $path) {
            $sitemap->add(Url::create(url($path)));
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));
        $this->info('Sitemap generated at public/sitemap.xml.');

        return self::SUCCESS;
    }
}
