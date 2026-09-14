import type { PublicCompany } from '@/lib/public-data';

const cardClass =
    'group border border-white/10 border-t-cyan bg-panel p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/60 hover:shadow-[0_0_35px_rgba(0,217,255,.07)]';

const labelClass = 'text-cyan font-mono text-[11px] tracking-[.18em] uppercase';

const linkClass = 'hover:text-cyan mt-6 block text-sm text-white transition';

export function ContactInfoCards({ company }: { company: PublicCompany }) {
    const addressLines = [
        company.address.line1,
        `${company.address.city}, ${company.address.province} ${company.address.postalCode}`,
        company.address.country,
    ];

    return (
        <div className="space-y-4">
            <div className={cardClass}>
                <p className={labelClass}>Kantor</p>
                <h3 className="mt-6 text-base font-semibold text-white">{company.name}</h3>
                <p className="text-soft mt-3 text-sm leading-7 whitespace-pre-line">{addressLines.join('\n')}</p>
            </div>

            <div className={cardClass}>
                <p className={labelClass}>Telepon</p>
                <a href={`tel:${company.contact.phones[0] ?? ''}`} className={linkClass}>
                    {company.contact.phones[0] ?? '—'}
                </a>
            </div>

            <div className={cardClass}>
                <p className={labelClass}>Ponsel / WhatsApp</p>
                <a
                    href={`https://wa.me/${(company.contact.phones[1] ?? '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                >
                    {company.contact.phones[1] ?? '—'}
                </a>
            </div>

            <div className={cardClass}>
                <p className={labelClass}>Email</p>
                <a href={`mailto:${company.contact.email}`} className={linkClass}>
                    {company.contact.email}
                </a>
            </div>
        </div>
    );
}
