import { ChevronDown, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "../lib/language/LanguageContext";
import { translations } from "../lib/language/translations";

type FaqItem = {
  category: string;
  question: string;
  answer: string | string[];
};

function FaqCard({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition ${
        isOpen ? "border-blue-300 shadow-md" : "border-blue-100 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">
            {item.category}
          </p>
          <h3 className="mt-1 text-sm sm:text-base font-bold text-gray-900 leading-snug">
            {item.question}
          </h3>
        </div>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-gray-700 leading-relaxed">
            {Array.isArray(item.answer) ? (
              <ul className="space-y-2">
                {item.answer.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              item.answer
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { lang } = useLanguage();

  // ✅ On récupère directement le tableau FAQ
  const items: FaqItem[] = useMemo(() => {
    return (translations as any)[lang]?.faq || [];
  }, [lang]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-12 pb-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {(translations as any)[lang]?.faqHeader?.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
                {(translations as any)[lang]?.faqHeader?.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((item, idx) => (
            <FaqCard
              key={`${item.category}-${idx}`}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() =>
                setOpenIndex((prev) => (prev === idx ? null : idx))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
