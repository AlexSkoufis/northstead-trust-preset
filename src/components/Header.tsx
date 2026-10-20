import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Lock, Menu, X, ArrowUpRight } from 'lucide-react';
import { NAV, CONTACT, type NavItem } from '../data/site';
import { Logo } from './ui';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap';
import { lockScroll } from '../motion/smooth';

export function Header() {
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const { pathname } = useLocation();

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setOpenDrop(null);
    setHidden(false);
  }, [pathname]);

  // Scroll state: solid after 24px; slides away on scroll down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 640);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(
    () => {
      // Reading progress hairline.
      gsap.set(progress.current, { scaleX: 0, transformOrigin: '0 50%' });
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
      });
    },
    { scope: header, dependencies: [pathname], revertOnUpdate: true },
  );

  // Entrance: the header drops in once per page load. clearProps hands the
  // transform back to the hide-on-scroll classes when it finishes.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        header.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, delay: 0.15, ease: 'expo.out', clearProps: 'transform,opacity' },
      );
    });
  });

  // Escape and outside click close dropdowns.
  useEffect(() => {
    if (!openDrop) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenDrop(null);
    const onDown = (e: PointerEvent) => !header.current?.contains(e.target as Node) && setOpenDrop(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [openDrop]);

  const solid = scrolled || !!openDrop;

  return (
    <>
      <header
        ref={header}
        data-intro
        onFocus={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-editorial)] ${
          hidden && !menuOpen ? '-translate-y-full' : ''
        } ${solid ? 'bg-porcelain/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'}`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link to="/" className="flex min-w-0 shrink items-center py-2" aria-label="Northstead Trust, home">
            <Logo className="w-[11.5rem] xs:w-[13.5rem] nav:w-[15rem]" />
          </Link>

          <nav aria-label="Primary" className="hidden nav:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <DesktopItem key={item.label} item={item} open={openDrop === item.label} setOpen={(v) => setOpenDrop(v ? item.label : null)} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACT.clientLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink transition-colors hover:text-oxblood md:inline-flex"
            >
              <Lock size={15} strokeWidth={1.7} aria-hidden />
              Client Login
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <Link to="/contact" className="btn btn-sm hidden nav:inline-flex">
              Start a conversation
            </Link>
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold nav:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="hidden sm:inline">Menu</span>
              <Menu size={22} strokeWidth={1.6} aria-hidden />
              <span className="visually-hidden sm:hidden">Open menu</span>
            </button>
          </div>
        </div>
        <div ref={progress} className="absolute inset-x-0 bottom-0 h-px bg-oxblood" aria-hidden />
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function DesktopItem({ item, open, setOpen }: { item: NavItem; open: boolean; setOpen: (v: boolean) => void }) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const active = pathname === item.to || (item.children?.some((c) => pathname.startsWith(c.to)) ?? false) || (item.to !== '/' && pathname.startsWith(item.to));

  useGSAP(
    () => {
      if (!open || !panel.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(panel.current, { opacity: 0, y: -8, duration: 0.5 });
        gsap.from(panel.current!.querySelectorAll('li'), { opacity: 0, y: 8, duration: 0.6, stagger: 0.03, delay: 0.05 });
      });
    },
    { dependencies: [open] },
  );

  if (!item.children) {
    return (
      <li>
        <NavLink to={item.to} className={({ isActive }) => `flex min-h-11 items-center px-3.5 text-[0.9375rem] font-medium ${isActive ? 'text-oxblood' : ''}`}>
          <span className="link-line">{item.label}</span>
        </NavLink>
      </li>
    );
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      (e.currentTarget.querySelector('button') as HTMLButtonElement)?.focus();
    }
  };

  return (
    <li
      className="relative"
      onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(true)}
      onMouseLeave={() => window.matchMedia('(hover: hover)').matches && setOpen(false)}
      onKeyDown={onKeyDown}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={`flex min-h-11 items-center gap-1.5 px-3.5 text-[0.9375rem] font-medium ${active ? 'text-oxblood' : ''}`}
      >
        <span className="link-line">{item.label}</span>
        <ChevronDown size={14} strokeWidth={1.8} aria-hidden className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div ref={panel} id={id} className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3">
          <ul className="rounded-sm bg-paper p-3 shadow-[0_30px_60px_-30px_rgba(27,31,29,0.35),0_0_0_1px_var(--color-line)]">
            {item.children.map((c) => (
              <li key={c.to}>
                <NavLink
                  to={c.to}
                  end
                  className={({ isActive }) =>
                    `group flex flex-col rounded-sm px-4 py-3 transition-colors hover:bg-porcelain ${isActive ? 'text-oxblood' : ''}`
                  }
                >
                  <span className="serif text-[1.3rem] leading-tight">{c.label}</span>
                  {c.note && <span className="t-meta mt-0.5">{c.note}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // Lock scroll, make the page inert, trap focus, Escape closes.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const main = document.getElementById('page-root');
    main?.setAttribute('inert', '');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
      main?.removeAttribute('inert');
      opener?.focus?.();
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!mounted || !root.current) return;
      const el = root.current;
      const items = el.querySelectorAll('[data-menu-item]');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (open) {
        gsap.set(el, { visibility: 'visible' });
        // Focus once the dialog is actually visible (it mounts a render after opening).
        closeBtn.current?.focus();
        if (reduce) return;
        gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' });
        gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.05, delay: 0.35 });
      } else {
        if (reduce) {
          gsap.set(el, { visibility: 'hidden' });
          return;
        }
        gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
      }
    },
    { dependencies: [open, mounted] },
  );

  if (!mounted) return null;

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="on-dark fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-lake text-porcelain nav:hidden"
      style={{ visibility: 'hidden' }}
    >
      <div className="shell flex min-h-full flex-col pb-10">
        <div className="flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link to="/" className="min-w-0" onClick={onClose} aria-label="Northstead Trust, home">
            <Logo light className="w-[10.5rem] xs:w-[12rem]" />
          </Link>
          <button ref={closeBtn} type="button" onClick={onClose} className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold">
            Close <X size={22} strokeWidth={1.6} aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-8 flex-1">
          <ul className="space-y-7">
            {NAV.map((item) => (
              <li key={item.label} data-menu-item>
                <NavLink to={item.to} end onClick={onClose} className="serif block text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.08]">
                  {item.label}
                </NavLink>
                {item.children && (
                  <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                    {item.children
                      .filter((c) => c.to !== item.to)
                      .map((c) => (
                        <li key={c.to}>
                          <NavLink to={c.to} onClick={onClose} className="flex min-h-11 items-center text-[0.9375rem] text-mist hover:text-porcelain">
                            {c.label}
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div data-menu-item className="mt-12 flex flex-col gap-3 border-t border-lake-line pt-8 sm:flex-row">
          <a href={CONTACT.clientLogin} target="_blank" rel="noopener noreferrer" className="btn btn-light">
            <Lock size={16} strokeWidth={1.7} aria-hidden /> Client Login <ArrowUpRight size={16} aria-hidden />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <a href={CONTACT.phoneHref} className="btn btn-ghost-light">
            Call {CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
