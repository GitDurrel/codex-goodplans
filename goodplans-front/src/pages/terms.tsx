import { FileText } from "lucide-react";
import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { translations } from "../lib/language/translations";
import { useLanguage } from "../lib/language/LanguageContext";

export default function TermsPage() {
  const { lang } = useLanguage();
  const t = translations[lang].terms;

  return (
    <LegalPageLayout
      icon={<FileText className="w-6 h-6 text-primary" />}
      title={t.title}
      subtitle={t.subtitle}
      lastUpdated={t.lastUpdated}
      toc={t.toc}
      showCredit
    >
      {t.blocks.map((b: any, idx: number) => {
        switch (b.t) {
          case "h1":
            return <h1 key={idx}>{b.text}</h1>;
          case "h2":
            return <h2 key={idx} id={b.id}>{`${b.num}. ${b.text}`}</h2>;
          case "h3":
            return <h3 key={idx}>{b.text}</h3>;
          case "ul":
            return (
              <ul key={idx}>
                {b.items.map((it: string, i: number) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            );
          default:
            return <p key={idx}>{b.text}</p>;
        }
      })}
    </LegalPageLayout>
  );
}
