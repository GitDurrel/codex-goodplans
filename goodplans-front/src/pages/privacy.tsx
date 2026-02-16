import { ShieldCheck } from "lucide-react";
import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { useLanguage } from "../lib/language/LanguageContext";

type Block =
  | { t: "h1"; text: string }
  | { t: "h2"; id: string; num: string; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] };

const tocFR = [
  { id: "s1-informations-generales", label: "1. INFORMATIONS GÉNÉRALES" },
  { id: "s2-donnees-collectees", label: "2. DONNÉES COLLECTÉES" },
  { id: "s3-finalites-du-traitement", label: "3. FINALITÉS DU TRAITEMENT" },
  { id: "s4-base-legale-du-traitement", label: "4. BASE LÉGALE DU TRAITEMENT" },
  { id: "s5-partage-des-donnees", label: "5. PARTAGE DES DONNÉES" },
  { id: "s6-transfert-international-de-donnees", label: "6. TRANSFERT INTERNATIONAL DE DONNÉES" },
  { id: "s7-cookies-et-technologies-similaires", label: "7. COOKIES ET TECHNOLOGIES SIMILAIRES" },
  { id: "s8-conservation-des-donnees", label: "8. CONSERVATION DES DONNÉES" },
  { id: "s9-vos-droits", label: "9. VOS DROITS" },
  { id: "s10-securite-des-donnees", label: "10. SÉCURITÉ DES DONNÉES" },
  { id: "s11-mineurs", label: "11. MINEURS" },
  { id: "s12-modifications-de-la-politique", label: "12. MODIFICATIONS DE LA POLITIQUE" },
  { id: "s13-contact", label: "13. CONTACT" },
] as const;

const tocEN = [
  { id: "s1-informations-generales", label: "1. GENERAL INFORMATION" },
  { id: "s2-donnees-collectees", label: "2. DATA COLLECTED" },
  { id: "s3-finalites-du-traitement", label: "3. PURPOSE OF PROCESSING" },
  { id: "s4-base-legale-du-traitement", label: "4. LEGAL BASIS FOR PROCESSING" },
  { id: "s5-partage-des-donnees", label: "5. DATA SHARING" },
  { id: "s6-transfert-international-de-donnees", label: "6. INTERNATIONAL DATA TRANSFERS" },
  { id: "s7-cookies-et-technologies-similaires", label: "7. COOKIES AND SIMILAR TECHNOLOGIES" },
  { id: "s8-conservation-des-donnees", label: "8. DATA RETENTION" },
  { id: "s9-vos-droits", label: "9. YOUR RIGHTS" },
  { id: "s10-securite-des-donnees", label: "10. DATA SECURITY" },
  { id: "s11-mineurs", label: "11. MINORS" },
  { id: "s12-modifications-de-la-politique", label: "12. POLICY CHANGES" },
  { id: "s13-contact", label: "13. CONTACT" },
] as const;


/* ============================= */
/* 🇫🇷 VERSION FR (ORIGINALE) */
/* ============================= */
const privacyBlocksFR: readonly Block[] = [
  { t: "h1", text: "POLITIQUE DE CONFIDENTIALITÉ" },
  { t: "p", text: "Goodplans Maroc" },
  { t: "p", text: "Date d'entrée en vigueur : 30 décembre 2025" },

  { t: "h2", id: "s1-informations-generales", num: "1", text: "INFORMATIONS GÉNÉRALES" },
  {
    t: "p",
    text:
      "Goodplans Maroc (ci-après « la Plateforme », « nous », « notre ») est une plateforme de mise en relation permettant aux utilisateurs de créer des comptes, déposer des annonces et contacter d'autres utilisateurs. La Plateforme est exploitée par RENOVIO DIGITAL LLC, une société à responsabilité limitée constituée aux États-Unis.",
  },
  { t: "p", text: "Entité légale : RENOVIO DIGITAL LLC" },
  { t: "p", text: "EIN : 37-2202455" },
  { t: "p", text: "Adresse : 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, États-Unis" },
  { t: "p", text: "Zone d'activité principale : Maroc" },
  {
    t: "p",
    text:
      "La présente Politique de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons les données personnelles de nos utilisateurs conformément à la législation applicable, notamment la Loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.",
  },
  { t: "p", text: "Cette Politique s'applique à tous les utilisateurs accédant à la Plateforme via les applications web et mobile." },

  { t: "h2", id: "s2-donnees-collectees", num: "2", text: "DONNÉES COLLECTÉES" },
  { t: "h3", text: "2.1. Données fournies par l'utilisateur" },
  { t: "ul", items: [
    "Informations d'identification : nom, prénom, adresse e-mail, numéro de téléphone",
    "Informations de profil : photo (facultative), localisation, préférences",
    "Contenu des annonces : titre, description, photos, prix, catégorie, localisation",
    "Communications : messages envoyés via la messagerie de la Plateforme, signalements",
  ]},
  { t: "h3", text: "2.2. Données collectées automatiquement" },
  { t: "ul", items: [
    "Données techniques : adresse IP, type de navigateur, système d'exploitation, identifiant d'appareil",
    "Données d'utilisation : pages consultées, durée de navigation, clics, recherches effectuées",
    "Cookies et technologies similaires (voir section 7)",
  ]},

  { t: "h2", id: "s3-finalites-du-traitement", num: "3", text: "FINALITÉS DU TRAITEMENT" },
  { t: "ul", items: [
    "Gestion des comptes : création, authentification, suppression",
    "Fourniture des services : publication d'annonces, mise en relation, messagerie",
    "Amélioration de la Plateforme : analyse de l'utilisation, développement de nouvelles fonctionnalités",
    "Communication : envoi de notifications, newsletters (avec consentement)",
    "Sécurité : prévention de la fraude, détection des abus, respect des obligations légales",
    "Conformité : respect des obligations légales et réglementaires",
  ]},

  { t: "h2", id: "s4-base-legale-du-traitement", num: "4", text: "BASE LÉGALE DU TRAITEMENT" },
  { t: "ul", items: [
    "Exécution du contrat : pour fournir les services demandés par l'utilisateur",
    "Consentement : pour l'envoi de communications marketing ou l'utilisation de cookies non essentiels",
    "Intérêt légitime : pour assurer la sécurité et améliorer la Plateforme",
    "Obligation légale : pour respecter les exigences légales applicables",
  ]},

  { t: "h2", id: "s5-partage-des-donnees", num: "5", text: "PARTAGE DES DONNÉES" },
  { t: "h3", text: "5.1. Visibilité publique" },
  { t: "ul", items: [
    "Contenu des annonces (titre, description, photos, prix, localisation générale)",
    "Nom d'utilisateur ou prénom",
    "Photo de profil (si fournie)",
  ]},
  { t: "h3", text: "5.2. Partage avec des tiers" },
  { t: "ul", items: [
    "Prestataires : hébergement, infrastructure, paiement, analyse de données",
    "Autorités : si requis par la loi ou sur demande judiciaire",
    "Autres utilisateurs : dans le cadre de la mise en relation (nom, coordonnées)",
  ]},
  {
    t: "p",
    text:
      "Nous veillons à ce que nos prestataires respectent des normes de protection des données équivalentes et ne traitent les données que selon nos instructions.",
  },

  { t: "h2", id: "s6-transfert-international-de-donnees", num: "6", text: "TRANSFERT INTERNATIONAL DE DONNÉES" },
  {
    t: "p",
    text:
      "Certaines opérations de traitement peuvent impliquer un transfert de données hors du Maroc, notamment vers les États-Unis. Ces transferts sont effectués conformément à la législation marocaine et sous réserve de garanties appropriées.",
  },

  { t: "h2", id: "s7-cookies-et-technologies-similaires", num: "7", text: "COOKIES ET TECHNOLOGIES SIMILAIRES" },
  {
    t: "p",
    text:
      "Les cookies sont de petits fichiers texte stockés sur votre appareil. Ils permettent d'améliorer votre expérience et de mesurer l'audience. Vous pouvez gérer les cookies via les paramètres de votre navigateur. Le refus de certains cookies peut limiter certaines fonctionnalités.",
  },
  { t: "h3", text: "7.1. Types de cookies utilisés" },
  { t: "ul", items: [
    "Essentiels : nécessaires au fonctionnement de la Plateforme (authentification, sécurité)",
    "Performance : mesure d'audience, analyse",
    "Fonctionnalité : mémorisation des préférences",
  ]},

  { t: "h2", id: "s8-conservation-des-donnees", num: "8", text: "CONSERVATION DES DONNÉES" },
  { t: "ul", items: [
    "Données de compte : pendant la durée du compte actif puis 1 an après la dernière connexion",
    "Annonces : pendant la durée de publication puis archivage pendant 1 an",
    "Messages : pendant la durée du compte puis suppression après désactivation",
    "Données de connexion : 1 an",
    "Obligations comptables/fiscales : selon la durée légale applicable",
  ]},

  { t: "h2", id: "s9-vos-droits", num: "9", text: "VOS DROITS" },
  { t: "ul", items: [
    "Accès",
    "Rectification",
    "Opposition",
    "Suppression",
    "Retrait du consentement",
  ]},
  {
    t: "p",
    text:
      "Pour exercer vos droits, contactez : contact@goodplansmaroc.ma. Vous pouvez également déposer une plainte auprès de la CNDP si nécessaire.",
  },

  { t: "h2", id: "s10-securite-des-donnees", num: "10", text: "SÉCURITÉ DES DONNÉES" },
  { t: "ul", items: [
    "Chiffrement des données sensibles",
    "Contrôles d'accès stricts",
    "Surveillance et tests réguliers",
    "Formation du personnel",
  ]},
  {
    t: "p",
    text:
      "Aucun système n'étant totalement sécurisé, protégez vos identifiants et signalez immédiatement toute utilisation non autorisée.",
  },

  { t: "h2", id: "s11-mineurs", num: "11", text: "MINEURS" },
  { t: "p", text: "La Plateforme est destinée aux personnes âgées de 18 ans et plus. Nous ne collectons pas sciemment de données auprès de mineurs." },

  { t: "h2", id: "s12-modifications-de-la-politique", num: "12", text: "MODIFICATIONS DE LA POLITIQUE" },
  { t: "p", text: "Nous pouvons modifier cette Politique à tout moment. Toute modification substantielle sera communiquée via la Plateforme ou par e-mail." },

  { t: "h2", id: "s13-contact", num: "13", text: "CONTACT" },
  { t: "p", text: "E-mail : contact@goodplansmaroc.ma" },
  { t: "p", text: "Courrier : RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, États-Unis" },
] as const;

/* ============================= */
/* 🇬🇧 */
/* ============================= */

const privacyBlocksEN: readonly Block[] = [
  { t: "h1", text: "PRIVACY POLICY" },
  { t: "p", text: "Goodplans Morocco" },
  { t: "p", text: "Effective date: December 30, 2025" },

  { t: "h2", id: "s1-informations-generales", num: "1", text: "GENERAL INFORMATION" },
  {
    t: "p",
    text:
      "Goodplans Morocco (hereinafter referred to as the “Platform”, “we”, “our”) is a marketplace platform allowing users to create accounts, publish listings and contact other users. The Platform is operated by RENOVIO DIGITAL LLC, a limited liability company incorporated in the United States.",
  },
  { t: "p", text: "Legal entity: RENOVIO DIGITAL LLC" },
  { t: "p", text: "EIN: 37-2202455" },
  { t: "p", text: "Address: 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, United States" },
  { t: "p", text: "Primary area of activity: Morocco" },
  {
    t: "p",
    text:
      "This Privacy Policy describes how we collect, use, store and protect personal data in accordance with applicable legislation, including Moroccan Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data.",
  },
  { t: "p", text: "This Policy applies to all users accessing the Platform via web and mobile applications." },

  { t: "h2", id: "s2-donnees-collectees", num: "2", text: "DATA COLLECTED" },
  { t: "h3", text: "2.1. Data provided by the user" },
  { t: "ul", items: [
    "Identification information: name, surname, email address, phone number",
    "Profile information: photo (optional), location, preferences",
    "Listing content: title, description, photos, price, category, location",
    "Communications: messages sent through the Platform messaging system, reports",
  ]},
  { t: "h3", text: "2.2. Data collected automatically" },
  { t: "ul", items: [
    "Technical data: IP address, browser type, operating system, device identifier",
    "Usage data: pages viewed, browsing duration, clicks, searches performed",
    "Cookies and similar technologies (see section 7)",
  ]},

  { t: "h2", id: "s3-finalites-du-traitement", num: "3", text: "PURPOSE OF PROCESSING" },
  { t: "ul", items: [
    "Account management: creation, authentication, deletion",
    "Service provision: listing publication, user connection, messaging",
    "Platform improvement: usage analysis, development of new features",
    "Communication: sending notifications and newsletters (with consent)",
    "Security: fraud prevention, abuse detection, compliance with legal obligations",
    "Compliance with applicable legal and regulatory obligations",
  ]},

  { t: "h2", id: "s4-base-legale-du-traitement", num: "4", text: "LEGAL BASIS FOR PROCESSING" },
  { t: "ul", items: [
    "Performance of a contract: to provide requested services",
    "Consent: for marketing communications or non-essential cookies",
    "Legitimate interest: to ensure security and improve the Platform",
    "Legal obligation: to comply with applicable laws",
  ]},

  { t: "h2", id: "s5-partage-des-donnees", num: "5", text: "DATA SHARING" },
  { t: "h3", text: "5.1. Public visibility" },
  { t: "ul", items: [
    "Listing content (title, description, photos, price, general location)",
    "Username or first name",
    "Profile photo (if provided)",
  ]},
  { t: "h3", text: "5.2. Sharing with third parties" },
  { t: "ul", items: [
    "Service providers: hosting, infrastructure, payment, analytics",
    "Authorities: if required by law or court order",
    "Other users: within the context of user interactions (name, contact details)",
  ]},
  {
    t: "p",
    text:
      "We ensure that our service providers comply with equivalent data protection standards and process data only according to our instructions.",
  },

  { t: "h2", id: "s6-transfert-international-de-donnees", num: "6", text: "INTERNATIONAL DATA TRANSFERS" },
  {
    t: "p",
    text:
      "Some processing operations may involve data transfers outside Morocco, including to the United States. These transfers are carried out in compliance with Moroccan legislation and subject to appropriate safeguards.",
  },

  { t: "h2", id: "s7-cookies-et-technologies-similaires", num: "7", text: "COOKIES AND SIMILAR TECHNOLOGIES" },
  {
    t: "p",
    text:
      "Cookies are small text files stored on your device. They help improve your experience and measure audience analytics. You can manage cookies through your browser settings. Refusing certain cookies may limit some functionalities.",
  },
  { t: "h3", text: "7.1. Types of cookies used" },
  { t: "ul", items: [
    "Essential: necessary for Platform operation (authentication, security)",
    "Performance: analytics and audience measurement",
    "Functionality: remembering preferences",
  ]},

  { t: "h2", id: "s8-conservation-des-donnees", num: "8", text: "DATA RETENTION" },
  { t: "ul", items: [
    "Account data: during active account period and 1 year after last login",
    "Listings: during publication period then archived for 1 year",
    "Messages: during account lifetime then deleted after deactivation",
    "Connection data: 1 year",
    "Accounting/tax obligations: according to applicable legal duration",
  ]},

  { t: "h2", id: "s9-vos-droits", num: "9", text: "YOUR RIGHTS" },
  { t: "ul", items: [
    "Access",
    "Rectification",
    "Objection",
    "Deletion",
    "Withdrawal of consent",
  ]},
  {
    t: "p",
    text:
      "To exercise your rights, contact: contact@goodplansmaroc.ma. You may also lodge a complaint with the CNDP if necessary.",
  },

  { t: "h2", id: "s10-securite-des-donnees", num: "10", text: "DATA SECURITY" },
  { t: "ul", items: [
    "Encryption of sensitive data",
    "Strict access controls",
    "Monitoring and regular testing",
    "Staff training",
  ]},
  {
    t: "p",
    text:
      "As no system is completely secure, protect your credentials and immediately report any unauthorized use.",
  },

  { t: "h2", id: "s11-mineurs", num: "11", text: "MINORS" },
  { t: "p", text: "The Platform is intended for individuals aged 18 and over. We do not knowingly collect data from minors." },

  { t: "h2", id: "s12-modifications-de-la-politique", num: "12", text: "POLICY CHANGES" },
  { t: "p", text: "We may modify this Policy at any time. Any substantial changes will be communicated via the Platform or by email." },

  { t: "h2", id: "s13-contact", num: "13", text: "CONTACT" },
  { t: "p", text: "Email: contact@goodplansmaroc.ma" },
  { t: "p", text: "Mail: RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, United States" },
];

/* ============================= */

function renderBlocks(blocks: readonly Block[]) {
  return blocks.map((b, idx) => {
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
            {b.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        );
      default:
        return <p key={idx}>{b.text}</p>;
    }
  });
}

export default function PrivacyPage() {
  const { lang } = useLanguage();

  const blocks = lang === "fr" ? privacyBlocksFR : privacyBlocksEN;
  const toc = lang === "fr" ? tocFR : tocEN;

  return (
    <LegalPageLayout
      icon={<ShieldCheck className="w-6 h-6 text-primary" />}
      title={lang === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
      subtitle="Goodplans Maroc • RENOVIO DIGITAL LLC"
      lastUpdated={lang === "fr" ? "30 décembre 2025" : "December 30, 2025"}
      toc={[...toc]}
      showCredit
    >
      {renderBlocks(blocks)}
    </LegalPageLayout>
  );
}

