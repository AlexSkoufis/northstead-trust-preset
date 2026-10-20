import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ trail, light = false }: { trail: { label: string; to?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-medium ${light ? 'text-mist' : 'text-taupe-ink'}`}>
        <li>
          <Link to="/" className="link-line hover:text-oxblood">
            Home
          </Link>
        </li>
        {trail.map((t) => (
          <li key={t.label} className="flex min-w-0 items-center gap-2">
            <ChevronRight size={13} aria-hidden className="flex-none opacity-60" />
            {t.to ? (
              <Link to={t.to} className="link-line hover:text-oxblood">
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className={light ? 'text-porcelain' : 'text-ink'}>
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
