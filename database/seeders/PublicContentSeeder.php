<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PublicContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            ['home', 'hero', 'eyebrow', 'Engineering & Power System'],
            ['home', 'hero', 'title', 'Reliable Engineering For Critical Infrastructure'],
            ['home', 'hero', 'description', 'Solusi engineering andal untuk infrastruktur kritikal — didukung 80+ proyek untuk klien seperti Pertamina, PLN, dan Telkomsel.'],
            ['home', 'hero', 'primary_cta', 'Explore Services'],
            ['home', 'hero', 'secondary_cta', 'View Projects'],
            ['home', 'company', 'eyebrow', 'Company / 01'],
            ['home', 'company', 'title', 'Built around engineering expertise.'],
            ['home', 'company', 'description', 'PT. Citra Protecta Semesta adalah perusahaan Electrical & Electronic Engineering yang berfokus pada solusi teknis, sistem kustom, dan dukungan proyek untuk infrastruktur kritikal.'],
            ['home', 'services', 'eyebrow', 'Capabilities / 02'],
            ['home', 'services', 'title', 'Engineering in action.'],
            ['home', 'contact_cta', 'eyebrow', 'Contact / 07'],
            ['home', 'contact_cta', 'title', 'Have an engineering project in mind?'],
            ['home', 'contact_cta', 'description', "Let's discuss your technical requirements."],

            ['about', 'hero', 'eyebrow', 'Company / 01'],
            ['about', 'hero', 'title', 'About CPS.'],
            ['about', 'hero', 'subtitle', 'Electrical engineering excellence built around demanding projects.'],
            ['about', 'hero', 'description', 'PT. Citra Protecta Semesta is an electrical and electronic engineering company focused on technical solutions, customized systems, and project support.'],
            ['about', 'foundation', 'eyebrow', 'Our foundation / 02'],
            ['about', 'foundation', 'title', 'Engineering with purpose and precision.'],
            ['about', 'mission', 'title', 'Mission & vision.'],
            ['about', 'team', 'title', 'People behind the precision.'],
            ['about', 'references', 'title', 'Trusted by industry references.'],
            ['about', 'cta', 'title', 'Ready to partner with CPS?'],

            ['services', 'hero', 'eyebrow', 'Services / 01'],
            ['services', 'hero', 'title', 'Our Services'],
            ['services', 'hero', 'subtitle', 'Comprehensive Engineering Solutions Across Three Core Divisions'],
            ['services', 'hero', 'description', 'From maintenance and optimization to design and manufacturing, CPS delivers end-to-end engineering solutions built for reliability and precision.'],
            ['services', 'divisions', 'title', 'Engineering in action.'],
            ['services', 'delivery', 'title', 'How We Deliver'],
            ['services', 'standards', 'title', 'Why Choose CPS Services?'],
            ['services', 'cta', 'title', 'Ready to Get Started?'],

            ['projects', 'hero', 'eyebrow', 'Project Reference / 05'],
            ['projects', 'hero', 'title', 'Selected Projects.'],
            ['projects', 'hero', 'description', 'Portfolio of engineering solutions delivered to leading companies.'],
            ['projects', 'portfolio', 'title', 'Engineering references.'],
            ['projects', 'scope', 'description', 'A portfolio spanning electrical systems, cathodic protection, telecommunications infrastructure, and load bank testing.'],
            ['projects', 'cta', 'title', 'Ready to work on your next project?'],

            ['industries', 'hero', 'eyebrow', 'Industries / 01'],
            ['industries', 'hero', 'title', 'Engineered Solutions for Demanding Industries'],
            ['industries', 'hero', 'description', 'CPS delivers specialized electrical and electronic engineering across critical sectors.'],
            ['industries', 'sectors', 'title', 'Technical depth across critical environments.'],
            ['industries', 'capabilities', 'title', 'Capabilities across industries.'],
            ['industries', 'cta', 'title', 'Need engineering solutions for your industry?'],

            ['contact', 'hero', 'eyebrow', 'Contact / 01'],
            ['contact', 'hero', 'title', "Let's discuss your engineering project."],
            ['contact', 'hero', 'description', 'Have a technical requirement? Connect with our team.'],
            ['contact', 'form', 'title', 'Send us a message'],
            ['contact', 'location', 'title', 'Office location'],
            ['contact', 'location', 'description', 'Visit us at our Tangerang office.'],

            ['consultation', 'hero', 'eyebrow', 'Contact / 08'],
            ['consultation', 'hero', 'title', 'Request a consultation.'],
            ['consultation', 'hero', 'description', "Let's discuss your engineering project requirements."],
            ['consultation', 'form', 'title', 'Help us understand the scope.'],
            ['consultation', 'form', 'success_message', "We've received your request. Our team will contact you within 24 hours."],
        ];

        foreach ($contents as $index => [$page, $section, $field, $value]) {
            PageContent::updateOrCreate(
                ['page_key' => $page, 'section_key' => $section, 'field_key' => $field],
                ['field_type' => 'textarea', 'value' => $value, 'sort_order' => $index],
            );
        }
    }
}
