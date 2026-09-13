import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const PROJECT_TYPES = [
    'Electrical Engineering',
    'Cathodic Protection',
    'Load Bank Testing',
    'Equipment Supply',
    'Maintenance & Service',
    'Custom / Other',
];

const TIMELINES = ['Immediate (0-1 month)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Long-term (6-12 months)', 'Planning phase'];

const BUDGET_LABELS = ['Under $10,000', '$10,000–$50,000', '$50,000–$100,000', '$100,000–$500,000', '$500,000+'];

const BUDGET_SCALE = ['< $10,000', '$10,000–$50,000', '$50,000–$100,000', '$100,000–$500,000', '$500,000+'];

const SERVICES = ['Service & Maintenance', 'Design & Manufacture', 'Trading & Construction', 'Cathodic Protection'];

const inputClass =
    'h-14 w-full border border-white/10 bg-night px-4 text-sm text-white outline-none transition placeholder:text-dim hover:border-white/20 focus:border-cyan focus:ring-2 focus:ring-cyan/15';

const legendClass = 'w-full border-b border-white/10 pb-6';

export default function Consultation() {
    const { content, media } = usePublicContent('consultation');
    const [submitted, setSubmitted] = useState(false);
    const [budget, setBudget] = useState(0);
    const [description, setDescription] = useState('');

    return (
        <PublicLayout>
            <>
                {/* Hero Section */}
                <section
                    className="grain grid-bg bg-night relative border-b border-white/10 bg-cover bg-center pt-36"
                    style={
                        media('hero.background')?.image_url
                            ? { backgroundImage: `linear-gradient(rgba(7,9,12,.8), rgba(7,9,12,.9)), url(${media('hero.background')?.image_url})` }
                            : undefined
                    }
                >
                    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24">
                        <div className="max-w-3xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" />
                                {content('hero.eyebrow', 'Contact / 08')}
                            </p>
                            <h1 className="reveal mt-7 text-5xl leading-[.96] font-semibold tracking-[-.06em] text-white delay-1 sm:text-6xl lg:text-7xl">
                                {content('hero.title', 'Request a consultation.')}
                            </h1>
                            <p className="text-soft mt-8 max-w-xl text-base leading-7 sm:text-lg">
                                {content('hero.description', "Let's discuss your engineering project requirements.")}
                            </p>
                            <p className="text-dim mt-4 max-w-xl text-sm leading-7">
                                Fill out the form below and our team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="text-dim mt-16 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>Project inquiry</span>
                            <span className="text-cyan">CPS / ENG-08</span>
                        </div>
                    </div>
                </section>

                {/* Consultation Form Section */}
                <section id="consultation-form" className="bg-ink py-16 sm:py-24 lg:py-28">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        {submitted ? (
                            <div className="p-8 text-center sm:p-14" aria-live="polite">
                                <div className="border-cyan/60 text-cyan mx-auto flex h-16 w-16 items-center justify-center border">
                                    <Icon icon="lucide:check" className="text-3xl" />
                                </div>
                                <p className="text-cyan mt-8 font-mono text-[10px] tracking-[.2em] uppercase">Inquiry received / CPS</p>
                                <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Thank you for your inquiry!</h2>
                                <p className="text-soft mx-auto mt-5 max-w-md text-sm leading-7">
                                    {content('form.success_message', "We've received your request. Our team will contact you within 24 hours.")}
                                </p>
                            </div>
                        ) : (
                            <div className="reveal bg-panel border border-white/10">
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setSubmitted(true);
                                    }}
                                >
                                    <fieldset className="border-b border-white/10 p-6 sm:p-8 lg:p-10">
                                        <legend className={legendClass}>
                                            <span className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">
                                                01 / Personal information
                                            </span>
                                            <span className="mt-3 block text-xl font-semibold tracking-[-.03em] text-white">
                                                Tell us how to reach you.
                                            </span>
                                        </legend>

                                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="full-name"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Full Name{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="full-name"
                                                    name="fullName"
                                                    type="text"
                                                    autoComplete="name"
                                                    required
                                                    aria-required="true"
                                                    className={inputClass}
                                                    placeholder="Your full name"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Email{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    aria-required="true"
                                                    className={inputClass}
                                                    placeholder="name@company.com"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Phone Number{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    required
                                                    aria-required="true"
                                                    className={inputClass}
                                                    placeholder="+62 ..."
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="company-name"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Company Name <span className="text-dim">(optional)</span>
                                                </label>
                                                <input
                                                    id="company-name"
                                                    name="companyName"
                                                    type="text"
                                                    autoComplete="organization"
                                                    className={inputClass}
                                                    placeholder="Your company"
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="border-b border-white/10 p-6 sm:p-8 lg:p-10">
                                        <legend className={legendClass}>
                                            <span className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">02 / Project details</span>
                                            <span className="mt-3 block text-xl font-semibold tracking-[-.03em] text-white">
                                                Help us understand the scope.
                                            </span>
                                        </legend>

                                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="project-type"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Project Type{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    id="project-type"
                                                    name="projectType"
                                                    required
                                                    aria-required="true"
                                                    defaultValue=""
                                                    className={inputClass}
                                                >
                                                    <option value="" disabled>
                                                        Select project type
                                                    </option>
                                                    {PROJECT_TYPES.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="timeline"
                                                    className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                                >
                                                    Timeline{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    id="timeline"
                                                    name="timeline"
                                                    required
                                                    aria-required="true"
                                                    defaultValue=""
                                                    className={inputClass}
                                                >
                                                    <option value="" disabled>
                                                        Select timeline
                                                    </option>
                                                    {TIMELINES.map((timeline) => (
                                                        <option key={timeline} value={timeline}>
                                                            {timeline}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="budget" className="text-soft font-mono text-[10px] tracking-[.16em] uppercase">
                                                    Project Budget{' '}
                                                    <span className="text-cyan" aria-hidden="true">
                                                        *
                                                    </span>
                                                </label>
                                                <output htmlFor="budget" className="text-cyan font-mono text-xs">
                                                    {BUDGET_LABELS[budget]}
                                                </output>
                                            </div>
                                            <input
                                                id="budget"
                                                name="budget"
                                                type="range"
                                                min={0}
                                                max={4}
                                                step={1}
                                                value={budget}
                                                onChange={(event) => setBudget(Number(event.target.value))}
                                                className="accent-cyan mt-6 h-5 w-full cursor-pointer appearance-none bg-transparent"
                                                aria-label="Project budget"
                                            />
                                            <div className="text-dim mt-3 grid grid-cols-5 gap-2 font-mono text-[9px] leading-4">
                                                {BUDGET_SCALE.map((label, index) => (
                                                    <span key={label} className={index === 0 ? '' : index === 4 ? 'text-right' : 'text-center'}>
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="border-b border-white/10 p-6 sm:p-8 lg:p-10">
                                        <legend className={legendClass}>
                                            <span className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">
                                                03 / Project description
                                            </span>
                                            <span className="mt-3 block text-xl font-semibold tracking-[-.03em] text-white">
                                                Share the technical context.
                                            </span>
                                        </legend>

                                        <div className="mt-8">
                                            <label
                                                htmlFor="description"
                                                className="text-soft mb-3 block font-mono text-[10px] tracking-[.16em] uppercase"
                                            >
                                                Project Description{' '}
                                                <span className="text-cyan" aria-hidden="true">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={6}
                                                required
                                                aria-required="true"
                                                maxLength={1000}
                                                value={description}
                                                onChange={(event) => setDescription(event.target.value)}
                                                className="bg-night placeholder:text-dim focus:border-cyan focus:ring-cyan/15 w-full resize-y border border-white/10 px-4 py-4 text-sm leading-7 text-white transition outline-none hover:border-white/20 focus:ring-2"
                                                placeholder="Describe your project requirements, technical specifications, and any specific challenges..."
                                            />
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-dim ml-auto font-mono text-[10px]">{description.length} / 1000</span>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="p-6 sm:p-8 lg:p-10">
                                        <legend className={legendClass}>
                                            <span className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">04 / Required services</span>
                                            <span className="mt-3 block text-xl font-semibold tracking-[-.03em] text-white">
                                                What can CPS support?
                                            </span>
                                        </legend>

                                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                            {SERVICES.map((service) => (
                                                <label
                                                    key={service}
                                                    className="group bg-night hover:border-cyan/60 flex min-h-14 cursor-pointer items-center gap-4 border border-white/10 px-4 transition"
                                                >
                                                    <input type="checkbox" name="services" value={service} className="accent-cyan h-4 w-4" />
                                                    <span className="text-soft text-sm transition group-hover:text-white">{service}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
                                            <a
                                                href="/"
                                                className="text-soft hover:border-cyan hover:text-cyan inline-flex min-h-14 items-center justify-center gap-2 border border-white/10 px-6 text-xs font-bold tracking-[.14em] uppercase transition"
                                            >
                                                <Icon icon="lucide:arrow-left" className="text-base" />
                                                Go Back
                                            </a>
                                            <button
                                                type="submit"
                                                className="bg-cyan text-ink-foreground focus:ring-cyan focus:ring-offset-panel inline-flex min-h-14 items-center justify-center gap-3 px-7 text-xs font-bold tracking-[.16em] uppercase transition hover:bg-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                            >
                                                Submit Request
                                                <Icon icon="lucide:arrow-up-right" className="text-base" />
                                            </button>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        )}
                    </div>
                </section>

                {/* Direct Contact Section */}
                <section id="contact" className="bg-night border-t border-white/10 py-16">
                    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-end lg:px-8">
                        <div>
                            <p className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">Direct contact</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-white">Prefer to speak directly?</h2>
                        </div>
                        <div className="text-soft grid gap-2 text-sm sm:grid-cols-2 sm:gap-x-10">
                            <a href="mailto:cps@cpsindo.com" className="hover:text-cyan transition">
                                cps@cpsindo.com
                            </a>
                            <a href="tel:+622155746808" className="hover:text-cyan transition">
                                +62-21-55746808
                            </a>
                            <span>Kavling DPR Blok C No. 234</span>
                            <span>Tangerang, Banten 15145</span>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
