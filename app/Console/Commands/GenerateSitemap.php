<?php

namespace App\Console\Commands;

use App\Models\Division;
use App\Models\ProjectReference;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'seo:generate-sitemap';

    protected $description = 'Generate the public XML sitemap.';

    public function handle(): int
    {
        $paths = ['/', '/about', '/services', '/projects', '/consultation', '/contact'];
        $sitemap = Sitemap::create();

        foreach ($paths as $path) {
            $sitemap->add(Url::create(url($path)));
        }

        Division::query()->orderBy('sort_order')->each(function (Division $division) use ($sitemap): void {
            $sitemap->add(Url::create(url('/services/'.$division->slug))->setLastModificationDate($division->updated_at));
        });

        ProjectReference::query()->orderBy('id')->each(function (ProjectReference $reference) use ($sitemap): void {
            $sitemap->add(Url::create(url('/projects/'.$reference->id))->setLastModificationDate($reference->updated_at));
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));
        $this->info('Sitemap generated at public/sitemap.xml.');

        return self::SUCCESS;
    }
}
