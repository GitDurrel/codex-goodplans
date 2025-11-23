// src/components/footer/footer.config.ts

export type SocialLink = {
    href: string;
    label: string;
    colorClass: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    customIconUrl?: string;
};

export type SimpleLink = {
    to: string;
    label: string;
};

/* -------------------------------------------------------------------------- */
/*                                   Liens                                    */
/* -------------------------------------------------------------------------- */

import {
    Facebook,
    Instagram,
    Youtube,
} from "lucide-react";

export const SOCIAL_LINKS: SocialLink[] = [
    {
        Icon: Facebook,
        href: "https://www.facebook.com/share/1G5gzpBLa1/",
        label: "Facebook",
        colorClass: "hover:text-blue-600",
    },
    {
        Icon: Instagram,
        href: "https://www.instagram.com/p/DJXyEVwoy8I/?igsh=YWo1ZnpneXJ6Zjl3",
        label: "Instagram",
        colorClass: "hover:text-pink-600",
    },
    {
        Icon: Youtube,
        href: "https://www.youtube.com/channel/UC3DdptAVmJ1_FAdYLSEiU3Q",
        label: "YouTube",
        colorClass: "hover:text-red-600",
    },
    {
        customIconUrl: 'https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/sign/logo/logo_tiktok_png.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzk4ZmU2MmMxLTFlNGQtNDRhOS1hOWM5LWYwNDY2NjFiZThmYyJ9.eyJ1cmwiOiJsb2dvL2xvZ29fdGlrdG9rX3BuZy5wbmciLCJpYXQiOjE3NDY3MDA3NjYsImV4cCI6MTkwNDM4MDc2Nn0.iTS61Xr_tCGEm39_MUJBHRrBrLG_B1H_rZewj07r7GY',
        href: 'https://www.tiktok.com/@goodplans.ma',
        label: "TikTok",
        colorClass: 'hover:text-blue-600'
    },
];

export const QUICK_LINKS: SimpleLink[] = [
    { to: "/create-listing", label: "Déposer une annonce" },
    { to: "/safety", label: "Sécurité" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
];

export const CATEGORY_LINKS: SimpleLink[] = [
    { to: "/category/immobilier", label: "Immobilier" },
    { to: "/category/vehicules", label: "Véhicules" },
    { to: "/category/services", label: "Services" },
    { to: "/category/artisanat", label: "Artisanat" },
];

export const LEGAL_LINKS: SimpleLink[] = [
    { to: "/privacy", label: "Politique de confidentialité" },
    { to: "/terms", label: "Conditions d'utilisation" },
    { to: "/legal", label: "Mentions légales" },
];
