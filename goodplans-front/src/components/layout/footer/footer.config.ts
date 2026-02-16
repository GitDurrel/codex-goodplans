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
    labelKey: string;
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
    { to: "/create-listing", labelKey: "footer.links.createListing" },
    { to: "/safety", labelKey: "footer.links.safety" },
    { to: "/faq", labelKey: "footer.links.faq" },
    { to: "/contact", labelKey: "footer.links.contact" },
    { to: "/support", labelKey: "footer.links.support" },
];


export const CATEGORY_LINKS: SimpleLink[] = [
    { to: "/category/immobilier", labelKey: "footer.links.realEstate" },
    { to: "/category/vehicules", labelKey: "footer.links.vehicles" },
    { to: "/category/services", labelKey: "footer.links.services" },
    { to: "/category/artisanat", labelKey: "footer.links.craft" },
];

export const LEGAL_LINKS: SimpleLink[] = [
    { to: "/privacy", labelKey: "footer.links.privacy" },
    { to: "/terms", labelKey: "footer.links.terms" },
    { to: "/legal", labelKey: "footer.links.legal" },
];
