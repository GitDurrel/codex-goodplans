// src/components/footer/FooterSections.tsx

import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import type { SocialLink, SimpleLink } from "./footer.config";

/* -------------------------------------------------------------------------- */
/*                             Réseaux Sociaux                                */
/* -------------------------------------------------------------------------- */

export function SocialIcons({ links }: { links: SocialLink[] }) {
  return (
    <div className="flex gap-4">
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2.5 bg-gray-100 rounded-full text-gray-600 transition-all ${social.colorClass} hover:bg-white hover:shadow-md`}
        >
          {social.customIconUrl ? (
            <img src={social.customIconUrl} alt={social.label} className="h-4 w-4" />
          ) : (
            social.Icon && <social.Icon className="h-4 w-4" />
          )}
        </a>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Liste simple                                */
/* -------------------------------------------------------------------------- */

export function LinkList({
  title,
  links,
}: {
  title: string;
  links: SimpleLink[];
}) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-5 text-lg">{title}</h3>
      <ul className="space-y-3 pl-1">
        {links.map((link) => (
          <li key={link.to} className="group">
            <Link
              to={link.to}
              className="text-gray-600 group-hover:text-blue-600 flex items-center transition"
            >
              <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Contact                                  */
/* -------------------------------------------------------------------------- */

export function ContactBlock() {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-5 text-lg">Contact</h3>
      <ul className="space-y-5">
        <li className="flex items-center gap-3 group">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Mail className="h-4 w-4" />
          </div>
          <a href="mailto:Goodplansmaroc@gmail.com" className="text-gray-600 group-hover:text-blue-600">
            Goodplansmaroc@gmail.com
          </a>
        </li>

        <li className="flex items-center gap-3 group">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Phone className="h-4 w-4" />
          </div>
          <a href="tel:+212706003020" className="text-gray-600 group-hover:text-blue-600">
            +212 7 06 00 30 20
          </a>
        </li>

        <li className="flex items-start gap-3 group">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition mt-1">
            <MapPin className="h-4 w-4" />
          </div>
          <address className="not-italic text-gray-600">
            Appt 15 Imm 12 Lot Sine Av Allal Fassi Marrakech
          </address>
        </li>
      </ul>
    </div>
  );
}
