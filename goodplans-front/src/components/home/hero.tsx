import type { FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmitSearch();
    }

    return (
        <div className="relative text-white w-full max-w-[100vw] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0">
                <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/60 to-indigo-700/80" />
            </div>

            <div className="relative w-full max-w-[2560px] mx-auto sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-center max-w-4xl leading-tight">
                    {title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-blue-50/90 mb-8 text-center max-w-3xl">{subtitle}</p>

                <div className="w-full max-w-3xl mx-auto">
                    <div className="flex justify-center items-center mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onSelectCategory(tab.id)}
                                        className={`flex flex-col items-center justify-center gap-2 px-4 py-3 transition-all rounded-xl ${selectedCategory === tab.id
                                                ? "bg-gradient-to-r from-[#00A5E7] to-[#0095D1] text-white shadow-md"
                                                : "bg-white/20 text-white hover:bg-white/30 hover:shadow-sm"
                                            }`}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full shadow-lg overflow-hidden p-1.5 border border-white/20">
                            <input
                                type="text"
                                placeholder="Que cherchez-vous ?"
                                className="flex-grow py-3 sm:py-4 px-4 sm:px-6 bg-transparent text-white placeholder-blue-100 focus:outline-none text-sm sm:text-base"
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                            />
                            <button
                                type="button"
                                className="p-3 mx-1 text-white hover:bg-white/10 rounded-full transition-colors"
                                onClick={onOpenFilters}
                                aria-label="Filtres"
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors"
                                aria-label="Rechercher"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
