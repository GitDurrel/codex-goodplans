import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, X, Menu } from "lucide-react";
import { useLanguage } from "../../lib/language/LanguageContext";


type TocItem = { id: string; label: string };

export function LegalPageLayout({
  icon,
  title,
  subtitle,
  lastUpdated,
  toc,
  children,
  showCredit = true,
  creditLabel,
  creditName = "YomGroup",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  toc: TocItem[];
  children: React.ReactNode;
  showCredit?: boolean;
  creditLabel?: string;
  creditName?: string;
}) {
  const { lang } = useLanguage();
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const NAV_OFFSET = 80;

  const safeToc = useMemo(() => {
    const seen = new Set<string>();
    return toc
      .filter((t) => t?.id?.trim())
      .filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
  }, [toc]);

  const highlight = (el: HTMLElement) => {
    el.classList.add("ring-2", "ring-primary/30", "rounded-xl");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary/30", "rounded-xl");
    }, 1600);
  };

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const top = window.scrollY + el.getBoundingClientRect().top - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    highlight(el);

    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    } else {
      window.location.hash = id;
    }

    setMobileTocOpen(false);
  };

  // 🔁 Traductions internes dynamiques
  const internal = {
    fr: {
      summary: "Sommaire",
      quickAccess: "Accès rapide",
      quickAccessSections: "Accès rapide aux sections",
      home: "Accueil",
      backHome: "Retour à l’accueil",
      lastUpdated: "Dernière mise à jour",
      credit: "Conception / réalisation",
      openSummary: "Ouvrir le sommaire",
      closeSummary: "Fermer le sommaire",
    },
    en: {
      summary: "Table of contents",
      quickAccess: "Quick access",
      quickAccessSections: "Quick access to sections",
      home: "Home",
      backHome: "Back to home",
      lastUpdated: "Last updated",
      credit: "Designed by",
      openSummary: "Open table of contents",
      closeSummary: "Close table of contents",
    },
  };

  const t = internal[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {subtitle}
                {lastUpdated
                  ? ` • ${t.lastUpdated} : ${lastUpdated}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Summary Button */}
            <button
              type="button"
              onClick={() => setMobileTocOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              aria-label={t.openSummary}
            >
              <Menu className="w-4 h-4" />
              <span className="text-sm font-medium">{t.summary}</span>
            </button>

            {/* Home */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {t.home}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileTocOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label={t.closeSummary}
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileTocOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-xl border-l border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {t.summary}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t.quickAccess}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileTocOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="p-3 overflow-auto">
              <ul className="space-y-1">
                {safeToc.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(item.id)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>

              {showCredit && (
                <div className="mt-4 p-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {creditLabel ?? t.credit} :{" "}
                    <span className="font-medium text-gray-700">
                      {creditName}
                    </span>
                  </p>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop TOC */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {t.summary}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t.quickAccessSections}
                </p>
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  {safeToc.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => goTo(item.id)}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {showCredit && (
                <div className="p-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {creditLabel ?? t.credit} :{" "}
                    <span className="font-medium text-gray-700">
                      {creditName}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-10 prose prose-gray max-w-none">
                {children}
              </div>

              <div className="px-6 sm:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  {lastUpdated ? `${t.lastUpdated} : ${lastUpdated}` : ""}
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t.backHome} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
