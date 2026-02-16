import type { FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "../../lib/language/LanguageContext";

interface CategoryTab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface HeroProps {
    title: string;
    subtitle: string;
    heroImage: string;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    onSubmitSearch: () => void;
    onOpenFilters: () => void;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    tabs: CategoryTab[];
}

export function Hero({
    title,
    subtitle,
    heroImage,
    searchQuery,
    onSearchQueryChange,
    onSubmitSearch,
    onOpenFilters,
    selectedCategory,
    onSelectCategory,
    tabs,
}: HeroProps) {

    const { t, lang } = useLanguage();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmitSearch();
    } 

    return (
        <div className="relative text-white w-full rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden">
            {/* Image de fond */}
            <div className="absolute inset-0">
                <img 
                    src={heroImage} 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700/70 via-blue-600/60 to-indigo-700/80" />
            </div>

            {/* Contenu */}
            <div className="relative w-full max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28 flex flex-col items-center">
                {/* Titre */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 text-center max-w-5xl leading-tight px-2">
                    {title}
                </h1>
                
                {/* Sous-titre */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-50/90 mb-6 sm:mb-8 md:mb-10 text-center max-w-3xl px-4">
                    {subtitle}
                </p>

                {/* Container de recherche */}
                <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                    {/* Onglets de catégories */}
                    <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full max-w-2xl">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isSelected = selectedCategory === tab.id;
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onSelectCategory(tab.id)}
                                        className={`
                                            flex flex-col items-center justify-center 
                                            gap-1.5 sm:gap-2 
                                            px-3 sm:px-4 md:px-5 
                                            py-2.5 sm:py-3 md:py-4
                                            transition-all duration-200 
                                            rounded-lg sm:rounded-xl
                                            ${isSelected
                                                ? "bg-gradient-to-r from-[#00A5E7] to-[#0095D1] text-white shadow-lg scale-105"
                                                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:shadow-md hover:scale-102"
                                            }
                                        `}
                                    >
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                                        <span className="text-xs sm:text-sm md:text-base font-medium">
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full shadow-2xl overflow-hidden p-1 sm:p-1.5 border border-white/30">
                            <input
                                type="text"
                                placeholder={t("home.searchPlaceholder")}
                                className="
                                    flex-grow 
                                    py-2.5 sm:py-3 md:py-4 
                                    px-3 sm:px-4 md:px-6 
                                    bg-transparent 
                                    text-white placeholder-blue-100/80
                                    focus:outline-none 
                                    text-sm sm:text-base md:text-lg
                                    font-medium
                                "
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                            />
                            
                            {/* Bouton filtres */}
                            <button
                                type="button"
                                className="
                                    p-2 sm:p-2.5 md:p-3 
                                    mx-0.5 sm:mx-1 
                                    text-white 
                                    hover:bg-white/20 
                                    rounded-full 
                                    transition-all duration-200
                                    hover:scale-110
                                "
                                onClick={onOpenFilters}
                                aria-label={t("home.filter")}
                            >
                                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                            </button>
                            
                            {/* Bouton recherche */}
                            <button
                                type="submit"
                                className="
                                    bg-gradient-to-r from-blue-500 to-blue-600 
                                    hover:from-blue-600 hover:to-blue-700
                                    text-white 
                                    rounded-full 
                                    p-2.5 sm:p-3 md:p-4 
                                    transition-all duration-200
                                    shadow-lg
                                    hover:shadow-xl
                                    hover:scale-110
                                "
                                aria-label="Rechercher"
                            >
                                <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}