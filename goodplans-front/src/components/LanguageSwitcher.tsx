import { useLanguage } from "../lib/language/LanguageContext";

export function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();

    const toggleLanguage = () => {
        setLang(lang === "fr" ? "en" : "fr");
    };

    return (
        <button
            onClick={toggleLanguage}
            aria-label="Changer la langue"
            className="flex h-6 w-6 items-center justify-center rounded-[10%]
                 border border-gray-200 bg-white shadow-sm
                 transition hover:scale-105 hover:bg-gray-50"
        >
            <img
                src={lang === "fr" ? "/flags/fr.png" : "/flags/en.png"}
                alt={lang === "fr" ? "Français" : "English"}
                className="h-full w-full object-cover"
            />
        </button>
    );
}
