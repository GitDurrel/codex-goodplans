export const translations = {
    fr: {
        // ******************************** Inscription ****************************************
        register: {
            title: "S'inscrire",
            inputUsername: "Nom d'utilisateur",
            indicationUsername: "Lettres, chiffres, tirets et underscores uniquement.",
            inputPassword: "Mot de passe",
            indicationPassword: "Doit contenir au moins une majuscule, une minuscule et un chiffre.",
            inputConfirmPassword: "Confirmer le mot de passe",
            sellerCheckbox: "Je souhaite m'inscrire en tant que vendeur",
            sellerType: "Type de vendeur",
            sellerParticular: "Particulier",
            sellerProfessional: "Professionnel",
            phoneInput: "Téléphone",
            helperPhoneInputText: "Votre numéro sera visible par les acheteurs",
            whatsAppPhoneInput: "WhatsApp (optionnel)",
            helperWhatsAppPhoneInputText: "Permet aux acheteurs de vous contacter rapidement",
            companyNameInput: "Nom de l'entreprise",
            sellerWarning: "Votre compte vendeur devra être validé par l'administration.",
            submitButton: "S'inscrire",
            loginRedirect: "Vous avez déjà un compte ? Se connecter",
            loading: " Traitement en cours...",
        },

        // ******************************** Connexion ****************************************
        login: {
            title: "Se connecter",
            titleGoogle: "Se connecter avec Google",
            inputPassword: "Mot de passe",
            forgotLoading: "Envoi en cours ...",
            forgotPassword: "Mot de passe oublié ?",
            loading: "Connexion en cours...",
            registerRedirect: "Pas encore de compte ?",
            impConnection: "Impossible de se connecter",
            notEmailMsg: "Merci de renseigner votre email d’abord.",
            resetPasswordmsg: "Un email de réinitialisation a été envoyé.",
            resetPasswordErr: "Impossible d’envoyer l’email de réinitialisation.",
        },

        // ******************************** HomePage ****************************************
        home: {
            heroTitle: "Le bon moment, le bon objet, le bon échange, tout commence ici",
            heroSubtitle: "Un seul site, des milliers de bons plans… sans intermédiaire.",
            searchPlaceholder: "Que cherchez-vous ?",
            recentListings: "Annonces récentes",
            filter: "Filtre",
            seeMore: "Voir plus",
            seeAll: "Voir tout",
            seeAllLabel: "Voir tout",
            seeMoreLabel: "Voir tout",
            noResults: "Aucune annonce ne correspond aux filtres.",
            noResultsCategory: " Aucune annonce pour cette catégorie.",
            noResultsImmo: "Aucune annonce immobilier.",
            noResultsCraft: "Aucune annonce artisanat.",
            noResultsServices: "Aucune annonce service.",
            noResultsVehicle: "Aucune annonce véhicule.",
            sponsored: "Sponsorisé",
            discover: "Découvrir",
        },

        categories: {
            vehicules: "Véhicules",
            immobilier: "Immobilier",
            services: "Services",
            artisanat: "Artisanat",
        },

        transaction: {
            rent: "À louer",
            sale: "À vendre",
        },

        // ******************************** Popup Filtres ****************************************
        filters: {
            title: "Filtres",
            category: "Catégorie",
            location: "Localisation",
            cityAll: "Toutes les villes",
            regionAll: "Toutes les régions",
            price: "Prix",
            min: "Min",
            max: "Max",
            transactionType: "Type de transaction",
            rent: "Location",
            buy: "Achat",
            reset: "Réinitialiser",
            apply: "Appliquer",
            loading: "Chargement...",
        },

        // ******************************** Resultats de la page de recherche ****************************************
        search: {
            placeholder: "Que recherchez-vous ?",
            resultsTitle: "Résultats",
            allListings: "Toutes les annonces",
            resultsFor: "résultat",
            resultsForPlural: "résultats",
            noResults: "Aucune annonce ne correspond à votre recherche.",
            sponsored: "Annonce sponsorisée",
            discover: "Découvrir",
            city: "Ville",
            region: "Région",
            min: "Min",
            max: "Max",
            priceRange: "Fourchette de prix",
            resetFilters: "Réinitialiser les filtres",
            viewResults: "Voir",
        },

        // ******************************** Annonces  ****************************************
        listing: {
            description: "Description",
            publishedOn: "Publié le",
            views: "vues",
            favorites: "favoris",
            photos: "photos",
            share: "Partager",
            linkCopied: "Lien copié",
            details: "Détails",
            premium: "Premium",
            sold: "Vendu",
            rent: "À louer",
            sale: "À vendre",

            rentalPeriod: {
                day: "jour",
                week: "semaine",
                month: "mois",
                year: "an",
            },
            seller: {
                defaultName: "Vendeur",
                memberSince: "Membre depuis",
                contactSeller: "Contacter le vendeur",
                loginToChat: "Connectez-vous pour discuter",
                viewProfile: "Voir le profil",
                ariaProfile: "Voir le profil de",
                linkCopied: "Lien copié"
            },
            safety: {
                title: "Conseils de sécurité",
                tip1: "Rencontrez-vous dans un lieu public et sécurisé.",
                tip2: "Ne partagez jamais d'informations bancaires en avance.",
                tip3: "Inspectez le produit avant de payer.",
                tip4: "Signalez tout comportement suspect à l'équipe GoodPlans."
            },
            cat: {
                // Section title
                details: "Détails",

                // VEHICLE
                vehicle: {
                    brand: "Marque",
                    model: "Modèle",
                    year: "Année",
                    mileage: "Kilométrage",
                },

                // REAL ESTATE
                realEstate: {
                    rooms: "Pièces",
                    surface: "Surface",
                    bedrooms: "Chambres",
                    bathrooms: "Salles de bain",
                },

                // SERVICES
                services: {
                    serviceType: "Type de service",
                    experience: "Expérience",
                },

                // CRAFT
                craft: {
                    type: "Type",
                    material: "Matériau",
                    dimensions: "Dimensions",
                },
            },
        },

        // ******************************** Footer ****************************************
        footer: {
            description: "La première plateforme d'annonces au Maroc. Trouvez tout ce dont vous avez besoin ou vendez facilement ce que vous n'utilisez plus.",
            mobileApp: "L’application mobile GoodPlans",
            downloadApp: "Télécharger GoodPlans sur l’App Store",
            quickLinks: "Liens rapides",
            categories: "Catégories",
            contact: "Contact",
            rights: "Tous droits réservés.",
            admin: "Administration",

            links: {
                createListing: "Déposer une annonce",
                safety: "Sécurité",
                faq: "FAQ",
                contact: "Contact",
                support: "Support / Aide",

                realEstate: "Immobilier",
                vehicles: "Véhicules",
                services: "Services",
                craft: "Artisanat",

                privacy: "Politique de confidentialité",
                terms: "Conditions d'utilisation",
                legal: "Mentions légales",
            },
        },

        // ******************************** Navbar****************************************
        navbar: {
            postListing: "Publier une annonce",
            postShort: "Publier",
            requestQuote: "Demander un devis publicitaire",
            requestQuoteShort: "Devis pub",
            messages: "Messages",
            login: "Se connecter",
            logout: "Déconnexion",
            home: "Accueil",
            search: "Rechercher",

            profile: "Profil",
            favorites: "Mes favoris",
            settings: "Paramètres",

            sellerDashboard: "Tableau de bord vendeur",
            sellerDashboardShort: "Tableau vendeur",

            admin: "Administration",
        },

        // **************************** Politique de confidentialité ************************************
        safety: {
            heroTitle: "Votre sécurité, notre priorité",
            heroSubtitle:
                "Chez GoodPlans, la confiance est au cœur de notre plateforme gratuite. Nous mettons en place des mesures techniques et organisationnelles strictes pour protéger vos données et sécuriser vos échanges.",

            sections: {
                dataProtection: {
                    title: "Protection des données personnelles",
                    bullets: [
                        "Vos données personnelles (nom, email, téléphone, annonces, messages) sont strictement confidentielles.",
                        "Elles sont hébergées sur des serveurs sécurisés et protégées par des protocoles de chiffrement avancés.",
                        "L'accès aux données est limité et contrôlé, conformément aux normes en vigueur.",
                        "Nous ne revendons jamais vos données à des tiers.",
                    ],
                },
                accountSecurity: {
                    title: "Sécurité des comptes utilisateurs",
                    bullets: [
                        "Authentification par OTP (code à usage unique) envoyé par email à chaque connexion.",
                        "Pas de mot de passe à retenir, moins de risques de piratage.",
                        "Chaque code OTP expire après quelques minutes et ne peut être utilisé qu'une seule fois.",
                        "Détection d'activités suspectes pour prévenir les accès frauduleux.",
                        "Vous êtes responsable de la confidentialité de votre boîte email.",
                    ],
                },
                moderation: {
                    title: "Modération et lutte contre la fraude",
                    bullets: [
                        "Toutes les annonces sont soumises à validation avant publication.",
                        "Les comptes vendeurs peuvent être vérifiés manuellement.",
                        "Un système de signalement permet d'alerter en cas de contenu suspect ou abusif.",
                        "Tout comportement frauduleux entraîne la suspension ou la suppression du compte.",
                        "Surveillance active des annonces pour détecter les tentatives d'arnaque.",
                    ],
                },
                messaging: {
                    title: "Messagerie sécurisée",
                    bullets: [
                        "Les échanges entre utilisateurs se font exclusivement via la messagerie interne.",
                        "Cela protège vos coordonnées personnelles et assure une traçabilité en cas de litige.",
                        "Ne communiquez jamais vos informations bancaires ou personnelles en dehors de la plateforme.",
                    ],
                },
                payments: {
                    title: "Système de mise en avant sécurisé",
                    bullets: [
                        "La mise en avant d'annonces est une fonctionnalité optionnelle et payante.",
                        "Les paiements sont traités via des prestataires certifiés et reconnus.",
                        "Les informations bancaires ne sont jamais stockées sur nos serveurs.",
                        "Toutes les transactions sont protégées par des protocoles SSL/TLS.",
                    ],
                },
                regulations: {
                    title: "Respect des réglementations",
                    bullets: [
                        "Nous respectons les réglementations applicables en matière de protection des données et de commerce en ligne.",
                        "Vous disposez d’un droit d’accès, de modification et de suppression de vos données.",
                        "Consultez notre Politique de Confidentialité pour plus de détails.",
                    ],
                },
            },

            accountTipsTitle: "Conseils pour protéger votre compte",
            accountTips: [
                "Ne partagez jamais votre code OTP avec qui que ce soit.",
                "Vérifiez que vous êtes bien sur le site officiel GoodPlans avant de saisir votre code.",
                "Ne cliquez pas sur des liens suspects reçus par email.",
            ],
            emailWarning:
                "Votre boîte email fait partie de votre sécurité : gardez-la protégée (code, 2FA, etc.).",

            transactionTipsTitle: "Conseils pour vos transactions",
            transactionTips: [
                "Privilégiez les rencontres en lieu public pour les échanges en main propre.",
                "Méfiez-vous des prix anormalement bas ou des demandes de paiement en dehors de la plateforme.",
                "Utilisez toujours la messagerie interne pour communiquer.",
            ],
            reportWarning:
                "En cas de doute, signalez immédiatement : nous analysons et agissons rapidement.",

            helpTitle: "Besoin d’aide ?",
            helpText:
                "Si vous rencontrez un comportement suspect ou un problème de sécurité, utilisez la fonction de signalement ou contactez le support depuis l’application.",
        },

        // ******************************** FAQ ****************************************
        faqHeader: {
            title: "FAQ – Foire Aux Questions",
            subtitle:
                "Retrouvez ici les réponses aux questions les plus fréquentes sur GoodPlans.",
        },

        faq: [
            {
                category: "Général",
                question: "L'inscription est-elle gratuite ?",
                answer:
                    "Oui, totalement. L'inscription et l'utilisation de GoodPlans sont 100 % gratuites. Vous pouvez créer un compte, consulter les annonces, publier et échanger sans aucun frais.",
            },
            {
                category: "Général",
                question: "Comment fonctionne la connexion par OTP ?",
                answer:
                    "À chaque connexion, vous recevez un code à usage unique (OTP) par email. Il suffit de le saisir pour accéder à votre compte. Ce code expire après quelques minutes et ne peut être utilisé qu'une seule fois, garantissant ainsi la sécurité de votre compte.",
            },
            {
                category: "Général",
                question: "Je n'ai pas reçu mon code OTP, que faire ?",
                answer: [
                    "Vérifiez votre dossier spam/courrier indésirable.",
                    "Assurez-vous d'avoir saisi la bonne adresse email.",
                    "Attendez quelques minutes puis demandez un nouveau code.",
                    "Si le problème persiste, contactez notre support.",
                ],
            },

            {
                category: "Publication d'annonces",
                question: "Qui peut publier une annonce ?",
                answer:
                    "Les particuliers peuvent publier un nombre limité d'annonces gratuitement. Les professionnels doivent créer un compte vendeur, soumis à validation par l'administrateur.",
            },
            {
                category: "Publication d'annonces",
                question: "Pourquoi mon annonce doit-elle être validée ?",
                answer: [
                    "La validation permet de garantir la qualité des annonces.",
                    "Éviter les arnaques et contenus frauduleux.",
                    "Protéger tous les utilisateurs de la plateforme.",
                    "Une fois validée, votre annonce devient visible immédiatement.",
                ],
            },
            {
                category: "Publication d'annonces",
                question: "Combien de temps prend la validation ?",
                answer:
                    "En général, les annonces sont validées sous 24 à 48 heures. Vous recevrez une notification par email dès que votre annonce sera en ligne.",
            },
            {
                category: "Publication d'annonces",
                question: "Puis-je modifier mon annonce après publication ?",
                answer: [
                    "Oui, vous pouvez modifier le texte et la description.",
                    "Les images.",
                    "Le prix.",
                    "Les informations spécifiques à votre catégorie.",
                    "Toute modification majeure peut nécessiter une nouvelle validation.",
                ],
            },
            {
                category: "Publication d'annonces",
                question: "Puis-je supprimer mon annonce ?",
                answer:
                    "Oui, à tout moment depuis votre espace personnel. La suppression est immédiate.",
            },

            {
                category: "Mise en avant",
                question: "Qu'est-ce que la mise en avant d'annonce ?",
                answer:
                    "C'est une option payante qui permet de donner plus de visibilité à votre annonce en la plaçant en haut des résultats de recherche et en page d'accueil.",
            },
            {
                category: "Mise en avant",
                question: "Combien coûte la mise en avant ?",
                answer:
                    'Les tarifs varient selon la durée et le niveau de mise en avant choisis. Consultez la page "Tarifs" pour plus de détails.',
            },
            {
                category: "Mise en avant",
                question: "Comment payer pour une mise en avant ?",
                answer:
                    "Les paiements sont sécurisés et gérés par des plateformes de paiement certifiées (carte bancaire, mobile money selon disponibilité).",
            },
            {
                category: "Mise en avant",
                question: "La mise en avant garantit-elle une vente ?",
                answer:
                    "Non, elle augmente la visibilité de votre annonce mais ne garantit pas de transaction. Le succès dépend aussi de la qualité de votre annonce, du prix et de la demande.",
            },

            {
                category: "Sécurité et données",
                question: "Mes données sont-elles en sécurité ?",
                answer:
                    "Oui. Vos données sont protégées, chiffrées et utilisées uniquement dans le cadre du fonctionnement de la plateforme. Nous ne les revendons jamais.",
            },
            {
                category: "Sécurité et données",
                question: "Comment contacter un vendeur ou un acheteur ?",
                answer:
                    "Exclusivement via la messagerie interne de la plateforme. Cela garantit votre sécurité et évite le partage direct de vos informations personnelles.",
            },
            {
                category: "Sécurité et données",
                question: "Que faire en cas de problème ou d'arnaque ?",
                answer: [
                    'Utilisez le bouton "Signaler" sur l’annonce ou le profil concerné.',
                    "Contactez notre support avec un maximum d’informations (messages, annonce, utilisateur).",
                    "Notre équipe analysera la situation rapidement et prendra les mesures nécessaires.",
                ],
            },
            {
                category: "Sécurité et données",
                question: "Comment éviter les arnaques ?",
                answer: [
                    "Ne payez jamais en dehors de la plateforme.",
                    "Méfiez-vous des prix trop bas.",
                    "Privilégiez les rencontres en lieu public.",
                    "Utilisez toujours la messagerie interne.",
                    "Signalez tout comportement suspect.",
                ],
            },

            {
                category: "Compte utilisateur",
                question: "Puis-je avoir plusieurs comptes ?",
                answer:
                    "Non, chaque utilisateur ne peut avoir qu'un seul compte pour garantir la transparence et la sécurité de la plateforme.",
            },
            {
                category: "Compte utilisateur",
                question: "Comment modifier mes informations personnelles ?",
                answer:
                    "Rendez-vous dans Paramètres > Mon profil pour modifier vos informations (nom, téléphone, photo, etc.).",
            },
            {
                category: "Compte utilisateur",
                question: "Puis-je supprimer mon compte ?",
                answer:
                    "Oui, vous pouvez demander la suppression de votre compte et de toutes vos données à tout moment via les paramètres ou en contactant le support. Cette action est irréversible.",
            },
            {
                category: "Compte utilisateur",
                question: "J'ai oublié avec quel email je me suis inscrit",
                answer:
                    "Contactez notre support en fournissant des informations permettant de vous identifier (nom, numéro de téléphone, etc.).",
            },
        ],

        // ******************************** Page Contact  ****************************************
        contact: {
            title: "Contactez-nous",
            subtitle: "Nous sommes là pour vous aider. Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
            inputName: "Nom",
            inputSujet: "Sujet",
            inputMessage: "Message",
            loading: "Envoi en cours...",
            button: "Envoyer",
            validationErrorMsg: "Merci de remplir au minimum votre nom, votre email et votre message.",
            successMsg: "Votre message a été envoyé avec succès !",
            errorMsg: "Une erreur est survenue. Veuillez réessayer.",
        },

        // ******************************** Conditions d'utilisation ****************************************
        terms: {
            title: "Conditions d’utilisation",
            subtitle: "Goodplans Maroc • RENOVIO DIGITAL LLC",
            lastUpdated: "30 décembre 2025",

            toc: [
                { id: "s1-acceptation-des-conditions", label: "1. ACCEPTATION DES CONDITIONS" },
                { id: "s2-presentation-de-la-plateforme", label: "2. PRÉSENTATION DE LA PLATEFORME" },
                { id: "s3-inscription-et-compte-utilisateur", label: "3. INSCRIPTION ET COMPTE UTILISATEUR" },
                { id: "s4-publication-d-annonces", label: "4. PUBLICATION D’ANNONCES" },
                { id: "s5-regles-de-conduite", label: "5. RÈGLES DE CONDUITE" },
                { id: "s6-transactions-entre-utilisateurs", label: "6. TRANSACTIONS ENTRE UTILISATEURS" },
                { id: "s7-propriete-intellectuelle", label: "7. PROPRIÉTÉ INTELLECTUELLE" },
                { id: "s8-donnees-personnelles", label: "8. DONNÉES PERSONNELLES" },
                { id: "s9-limitation-de-responsabilite", label: "9. LIMITATION DE RESPONSABILITÉ" },
                { id: "s10-signalement-et-reclamations", label: "10. SIGNALEMENT ET RÉCLAMATIONS" },
                { id: "s11-modifications-des-cgu", label: "11. MODIFICATIONS DES CGU" },
                { id: "s12-resiliation", label: "12. RÉSILIATION" },
                { id: "s13-droit-applicable-et-juridiction", label: "13. DROIT APPLICABLE ET JURIDICTION" },
                { id: "s14-dispositions-diverses", label: "14. DISPOSITIONS DIVERSES" },
                { id: "s15-contact", label: "15. CONTACT" }
            ],

            blocks: [
                { t: "h1", text: "CONDITIONS GÉNÉRALES D'UTILISATION" },
                { t: "p", text: "Goodplans Maroc" },
                { t: "p", text: "Date d'entrée en vigueur : 30 décembre 2025" },

                { t: "h2", id: "s1-acceptation-des-conditions", num: "1", text: "ACCEPTATION DES CONDITIONS" },
                {
                    t: "p",
                    text:
                        "Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») régissent votre accès et votre utilisation de la plateforme Goodplans Maroc (ci-après la « Plateforme »), accessible via les applications web et mobile. La Plateforme est exploitée par RENOVIO DIGITAL LLC, une société à responsabilité limitée constituée aux États-Unis.",
                },
                {
                    t: "p",
                    text:
                        "En accédant à la Plateforme ou en créant un compte, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser la Plateforme.",
                },

                { t: "h2", id: "s2-presentation-de-la-plateforme", num: "2", text: "PRÉSENTATION DE LA PLATEFORME" },
                { t: "h3", text: "2.1. Description du service" },
                { t: "ul", items: ["Créer un compte utilisateur", "Publier des annonces de biens ou services", "Consulter les annonces d'autres utilisateurs", "Contacter les annonceurs via la messagerie intégrée", "Être contacté par d'autres utilisateurs"] },
                { t: "h3", text: "2.2. Rôle de la Plateforme" },
                { t: "p", text: "La Plateforme agit exclusivement en tant qu'intermédiaire technique. Nous ne sommes ni vendeurs, ni acheteurs, ni prestataires. Les transactions et relations contractuelles se font directement entre utilisateurs." },

                { t: "h2", id: "s3-inscription-et-compte-utilisateur", num: "3", text: "INSCRIPTION ET COMPTE UTILISATEUR" },
                { t: "h3", text: "3.1. Conditions d'inscription" },
                { t: "ul", items: ["Être âgé d'au moins 18 ans", "Fournir des informations exactes et à jour", "Créer un seul compte par personne", "Ne pas usurper l'identité d'autrui"] },
                { t: "h3", text: "3.2. Sécurité du compte" },
                { t: "ul", items: ["Ne pas partager vos identifiants avec des tiers", "Nous informer de toute utilisation non autorisée", "Vous déconnecter en fin de session"] },
                { t: "h3", text: "3.3. Suspension et résiliation" },
                { t: "p", text: "Nous pouvons suspendre ou supprimer un compte en cas de violation des CGU, comportement frauduleux/abusif, ou toute raison légitime." },

                { t: "h2", id: "s4-publication-d-annonces", num: "4", text: "PUBLICATION D’ANNONCES" },
                { t: "h3", text: "4.1. Obligations de l'annonceur" },
                { t: "ul", items: ["Informations exactes, complètes, non trompeuses", "Photos authentiques", "Respect de la propriété intellectuelle", "Mettre à jour/supprimer dès indisponibilité", "Prix réaliste et conforme au marché"] },
                { t: "h3", text: "4.2. Contenus interdits" },
                { t: "ul", items: ["Biens/services illégaux ou contrefaits", "Armes, drogues, substances illicites", "Contenus pornographiques, violents ou haineux", "Services à caractère sexuel", "Animaux protégés", "Médicaments sur ordonnance", "Documents officiels falsifiés", "Tout contenu contraire aux lois"] },
                { t: "h3", text: "4.3. Modération" },
                { t: "p", text: "Nous pouvons modérer/refuser/modifier/supprimer toute annonce non conforme, sans notification préalable." },

                { t: "h2", id: "s5-regles-de-conduite", num: "5", text: "RÈGLES DE CONDUITE" },
                {
                    t: "ul", items: [
                        "Respecter les lois en vigueur au Maroc",
                        "Respect et courtoisie entre utilisateurs",
                        "Pas de harcèlement/menaces/insultes",
                        "Pas d'usage frauduleux ou malveillant",
                        "Pas de contournement des sécurités",
                        "Pas de collecte de données à des fins commerciales sans consentement",
                        "Pas de spam / publicité non sollicitée",
                        "Pas de faux comptes / comptes multiples",
                    ]
                },

                { t: "h2", id: "s6-transactions-entre-utilisateurs", num: "6", text: "TRANSACTIONS ENTRE UTILISATEURS" },
                { t: "h3", text: "6.1. Responsabilité des utilisateurs" },
                { t: "p", text: "Les transactions se font directement entre utilisateurs. Chaque utilisateur est responsable de vérifier l'identité/fiabilité, négocier, exécuter, conformité, paiement et livraison." },
                { t: "h3", text: "6.2. Exclusion de responsabilité" },
                { t: "ul", items: ["Non-conformité", "Vice caché/défaut", "Non-paiement", "Non-livraison", "Fraude/escroquerie", "Annonce trompeuse"] },
                { t: "h3", text: "6.3. Recommandations de sécurité" },
                { t: "ul", items: ["Rencontres en lieux publics", "Vérifier l'état du bien avant transaction", "Éviter paiements anticipés sans garantie", "Se méfier des offres trop alléchantes", "Signaler tout comportement suspect"] },

                { t: "h2", id: "s7-propriete-intellectuelle", num: "7", text: "PROPRIÉTÉ INTELLECTUELLE" },
                { t: "h3", text: "7.1. Droits sur la Plateforme" },
                { t: "p", text: "Tous les éléments (structure, design, graphismes, logos, codes, textes, etc.) sont la propriété de RENOVIO DIGITAL LLC ou concédants, protégés par les lois." },
                { t: "h3", text: "7.2. Contenu publié par les utilisateurs" },
                { t: "p", text: "Vous conservez vos droits, mais accordez une licence mondiale, non exclusive, gratuite et transférable pour exploiter le contenu dans le cadre du service." },

                { t: "h2", id: "s8-donnees-personnelles", num: "8", text: "DONNÉES PERSONNELLES" },
                { t: "p", text: "Le traitement des données personnelles est régi par notre Politique de confidentialité (Loi marocaine n° 09-08)." },

                { t: "h2", id: "s9-limitation-de-responsabilite", num: "9", text: "LIMITATION DE RESPONSABILITÉ" },
                { t: "h3", text: "9.1. Disponibilité" },
                { t: "p", text: "Pas de garantie d'accès ininterrompu (maintenance, mises à jour, pannes, force majeure)." },
                { t: "h3", text: "9.2. Contenu des annonces" },
                { t: "p", text: "Nous ne garantissons pas l'exactitude/qualité/sécurité/légalité des biens et services." },
                { t: "h3", text: "9.3. Préjudices indirects" },
                { t: "p", text: "Dans les limites de la loi, pas de responsabilité pour dommages indirects (profits, données, etc.)." },

                { t: "h2", id: "s10-signalement-et-reclamations", num: "10", text: "SIGNALEMENT ET RÉCLAMATIONS" },
                { t: "p", text: "Signalement via la fonction dédiée sur chaque annonce ou par e-mail : contact@goodplansmaroc.ma." },

                { t: "h2", id: "s11-modifications-des-cgu", num: "11", text: "MODIFICATIONS DES CGU" },
                { t: "p", text: "Nous pouvons modifier les CGU à tout moment. Les modifications s'appliquent dès publication." },

                { t: "h2", id: "s12-resiliation", num: "12", text: "RÉSILIATION" },
                { t: "p", text: "Vous pouvez supprimer votre compte à tout moment depuis les paramètres. Nous pouvons suspendre ou résilier en cas de violation des CGU." },

                { t: "h2", id: "s13-droit-applicable-et-juridiction", num: "13", text: "DROIT APPLICABLE ET JURIDICTION" },
                { t: "p", text: "Les CGU sont régies par le droit marocain. Litiges : tribunaux marocains compétents." },

                { t: "h2", id: "s14-dispositions-diverses", num: "14", text: "DISPOSITIONS DIVERSES" },
                { t: "h3", text: "14.1. Intégralité" },
                { t: "p", text: "CGU + Politique de confidentialité + Mentions légales = intégralité de l'accord." },
                { t: "h3", text: "14.2. Nullité partielle" },
                { t: "p", text: "Si une clause est invalide, les autres restent en vigueur." },
                { t: "h3", text: "14.3. Absence de renonciation" },
                { t: "p", text: "Le non-exercice d'un droit ne vaut pas renonciation." },

                { t: "h2", id: "s15-contact", num: "15", text: "CONTACT" },
                { t: "p", text: "E-mail : contact@goodplansmaroc.ma" },
                { t: "p", text: "Courrier : RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, États-Unis" },
            ]
        },


        // ******************************** Page Support ****************************************
        support: {
            title: "Support",
            subtitle: "Besoin d’aide ? Remplissez le formulaire ci-dessous. Notre équipe vous répond généralement sous 48h.",
            badge1: "Aiistance",
            badge2: "Comptes",
            badge3: "Annonces",
            badge4: "Paiements",
            infoTitle: "Réponse rapide",
            infoText: "Notre équipe traite les demandes sous 48h (souvent plus vite).",
            infoSecondTitle: "Bon à savoir",
            infoText1: "Décrivez clairement votre problème.",
            infoText2: "Ajoutez des détails (annonce, ville, capture si besoin).",
            infoText3: "Vérifiez votre email, y compris les spams.",
            formTitle: "Formulaire de contact",
            formSubtitle: "Tous les champs sont requis pour envoyer votre demande.",
            inputName: "Nom",
            placeholderName: "Votre nom",
            inputSubject: "Sujet",
            placeholderSubject: "Ex: problème de connexion, annonce bloquée...",
            inputMsg: "Message",
            placeholderMsg: "Décrivez votre problème en détail...",
            indicationMsg: "Décrivez clairement votre problème pour une réponse rapide.(Minimum 10 caractères.)",
            resetButton: "Réinitialiser",
            loading: "Envoi en cours...",
            submitButton: "Envoyer",
            miniFaqTitle: "Questions fréquentes",
            miniFaqCard1P1: "Sous 48h",
            miniFaqCard1P2: "Délai de réponse moyen.",
            miniFaqCard2P1: "OTP",
            miniFaqCard2P2: "Vérifiez aussi vos spams.",
            miniFaqCard3P1: "Sécurité",
            miniFaqCard3P2: "Toujours via la messagerie interne.",
            notName: "Veuillez renseigner votre nom.",
            notMsg: "Veuillez décrire votre problème (minimum 10 caractères).",
            notSubject: "Veuillez renseigner le sujet de votre demande.",
            notEmail: "Veuillez renseigner votre adresse email pour que nous puissions vous répondre.",
            successMsg: "Demande envoyée. Réponse sous 48h.",
            errorMsg: "Impossible d’envoyer la demande. Réessayez.",
        },

        // ******************************* Mentions légales ****************************************
        legal: {
            title: "Mentions légales",
            subtitle: "Goodplans Maroc • RENOVIO DIGITAL LLC",
            lastUpdated: "30 décembre 2025",

            toc: [
                { id: "s1-editeur-de-la-plateforme", label: "1. ÉDITEUR DE LA PLATEFORME" },
                { id: "s2-hebergement", label: "2. HÉBERGEMENT" },
                { id: "s3-objet-de-la-plateforme", label: "3. OBJET DE LA PLATEFORME" },
                { id: "s4-acces-a-la-plateforme", label: "4. ACCÈS À LA PLATEFORME" },
                { id: "s5-propriete-intellectuelle", label: "5. PROPRIÉTÉ INTELLECTUELLE" },
                { id: "s6-protection-des-donnees-personnelles", label: "6. PROTECTION DES DONNÉES PERSONNELLES" },
                { id: "s7-cookies", label: "7. COOKIES" },
                { id: "s8-responsabilite", label: "8. RESPONSABILITÉ" },
                { id: "s9-signalement-de-contenu-illicite", label: "9. SIGNALEMENT DE CONTENU ILLICITE" },
                { id: "s10-liens-hypertextes", label: "10. LIENS HYPERTEXTES" },
                { id: "s11-droit-applicable-et-juridiction-competente", label: "11. DROIT APPLICABLE ET JURIDICTION COMPÉTENTE" },
                { id: "s12-modification-des-mentions-legales", label: "12. MODIFICATION DES MENTIONS LÉGALES" },
                { id: "s13-contact", label: "13. CONTACT" }
            ],

            blocks: [
                { t: "h1", text: "MENTIONS LÉGALES" },
                { t: "p", text: "Goodplans Maroc" },
                { t: "p", text: "Date de dernière mise à jour : 30 décembre 2025" },

                { t: "h2", id: "s1-editeur-de-la-plateforme", num: "1", text: "ÉDITEUR DE LA PLATEFORME" },
                { t: "p", text: "La plateforme Goodplans Maroc (ci-après « la Plateforme ») est éditée par :" },
                { t: "p", text: "Raison sociale : RENOVIO DIGITAL LLC" },
                { t: "p", text: "Forme juridique : Limited Liability Company (LLC)" },
                { t: "p", text: "EIN : 37-2202455" },
                { t: "p", text: "Siège social : 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, États-Unis" },
                { t: "p", text: "État d'incorporation : New Mexico, États-Unis" },
                { t: "p", text: "Date de constitution : 31 octobre 2025" },
                { t: "p", text: "Responsable de la publication : Belmeskine Said, Membre" },
                { t: "p", text: "Contact : contact@goodplansmaroc.ma" },
                { t: "p", text: "Zone d'activité principale : Maroc" },

                { t: "h2", id: "s2-hebergement", num: "2", text: "HÉBERGEMENT" },
                { t: "p", text: "La Plateforme est hébergée par :" },
                { t: "p", text: "[À compléter avec les informations de votre hébergeur]" },
                { t: "p", text: "Raison sociale : [Nom de l'hébergeur]" },
                { t: "p", text: "Adresse : [Adresse]" },
                { t: "p", text: "Téléphone : [Numéro de téléphone]" },

                { t: "h2", id: "s3-objet-de-la-plateforme", num: "3", text: "OBJET DE LA PLATEFORME" },
                { t: "ul", items: ["Publier des annonces de vente, d'achat, de location ou d'échange", "Consulter les annonces d'autres utilisateurs", "Contacter les annonceurs via une messagerie intégrée"] },
                { t: "p", text: "La Plateforme agit exclusivement en tant qu'intermédiaire technique. RENOVIO DIGITAL LLC ne participe pas aux transactions et n'est pas partie aux contrats conclus entre utilisateurs." },

                { t: "h2", id: "s4-acces-a-la-plateforme", num: "4", text: "ACCÈS À LA PLATEFORME" },
                { t: "ul", items: ["Via le site web : www.goodplansmaroc.ma (à confirmer)", "Via les applications mobiles iOS / Android"] },
                { t: "p", text: "L'accès à la Plateforme est gratuit. Des services complémentaires payants peuvent être proposés (mise en avant d'annonces…), avec tarifs affichés avant souscription." },

                { t: "h2", id: "s5-propriete-intellectuelle", num: "5", text: "PROPRIÉTÉ INTELLECTUELLE" },
                { t: "h3", text: "5.1. Droits sur la Plateforme" },
                { t: "p", text: "Tous les éléments présents sur la Plateforme sont la propriété exclusive de RENOVIO DIGITAL LLC ou de ses concédants et sont protégés par les législations applicables (États-Unis, Maroc et international)." },
                { t: "ul", items: ["La structure générale", "Les textes, images, graphismes, logos et icônes", "Les bases de données", "Les logiciels et codes", "Les marques, noms commerciaux et noms de domaine"] },
                { t: "h3", text: "5.2. Usage autorisé" },
                { t: "p", text: "Toute reproduction, modification ou adaptation est interdite sans autorisation écrite préalable. Usage autorisé : personnel et non commercial." },
                { t: "h3", text: "5.3. Contenu utilisateur" },
                { t: "p", text: "Les utilisateurs conservent leurs droits sur leur contenu, mais accordent à RENOVIO DIGITAL LLC une licence mondiale, non exclusive, gratuite et transférable pour exploiter ce contenu dans le cadre du service." },

                { t: "h2", id: "s6-protection-des-donnees-personnelles", num: "6", text: "PROTECTION DES DONNÉES PERSONNELLES" },
                { t: "p", text: "Les données personnelles sont traitées conformément à la Loi marocaine n° 09-08 et à notre Politique de confidentialité." },
                { t: "p", text: "Responsable du traitement : RENOVIO DIGITAL LLC" },
                { t: "p", text: "Contact : contact@goodplansmaroc.ma" },
                { t: "p", text: "Droits : accès, rectification, opposition, suppression (via contact)." },

                { t: "h2", id: "s7-cookies", num: "7", text: "COOKIES" },
                { t: "p", text: "Des cookies peuvent être utilisés pour améliorer l'expérience utilisateur et analyser l'utilisation. Détails et gestion : Politique de confidentialité. Le refus peut limiter certaines fonctionnalités." },

                { t: "h2", id: "s8-responsabilite", num: "8", text: "RESPONSABILITÉ" },
                { t: "h3", text: "8.1. Contenu publié par les utilisateurs" },
                { t: "p", text: "RENOVIO DIGITAL LLC agit en qualité d'hébergeur du contenu. Retrait prompt si contenu manifestement illicite porté à connaissance." },
                { t: "h3", text: "8.2. Transactions entre utilisateurs" },
                { t: "p", text: "La Plateforme n'intervient pas dans les transactions. RENOVIO DIGITAL LLC n'est pas responsable des litiges (non-conformité, non-paiement, fraude, etc.)." },
                { t: "h3", text: "8.3. Disponibilité de la Plateforme" },
                { t: "p", text: "Objectif d'accessibilité 24/7 sans garantie d'accès ininterrompu (maintenance, pannes, force majeure)." },

                { t: "h2", id: "s9-signalement-de-contenu-illicite", num: "9", text: "SIGNALEMENT DE CONTENU ILLICITE" },
                { t: "p", text: "Signalement via la fonction dédiée sur chaque annonce ou par e-mail : contact@goodplansmaroc.ma." },
                { t: "ul", items: ["Lien vers l'annonce", "Motifs du signalement", "Coordonnées du signalant"] },

                { t: "h2", id: "s10-liens-hypertextes", num: "10", text: "LIENS HYPERTEXTES" },
                { t: "p", text: "La Plateforme peut contenir des liens vers des sites tiers. Aucun contrôle sur leur contenu/disponibilité. Tout lien vers la Plateforme doit être autorisé. Les liens profonds sont interdits sans autorisation." },

                { t: "h2", id: "s11-droit-applicable-et-juridiction-competente", num: "11", text: "DROIT APPLICABLE ET JURIDICTION COMPÉTENTE" },
                { t: "p", text: "Les présentes mentions légales sont régies par le droit marocain. Tribunaux marocains seuls compétents en cas de litige." },

                { t: "h2", id: "s12-modification-des-mentions-legales", num: "12", text: "MODIFICATION DES MENTIONS LÉGALES" },
                { t: "p", text: "RENOVIO DIGITAL LLC peut modifier ces mentions à tout moment. Entrée en vigueur dès publication." },

                { t: "h2", id: "s13-contact", num: "13", text: "CONTACT" },
                { t: "p", text: "E-mail : contact@goodplansmaroc.ma" },
                { t: "p", text: "Courrier : RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, États-Unis" },
            ]
        },

        // ******************************** Page de demande de devis publicité ****************************************
        advertisingRequest: {
            title: "Demande de devis publicitaire",
            subtitle:
                "Boostez la visibilité de votre entreprise sur GoodPlans. Remplissez le formulaire ci-dessous et recevez une proposition personnalisée.",

            form: {
                companyName: "Nom de l'entreprise",
                contactName: "Nom complet",
                duration: "Durée souhaitée",
                placeholderDuration: "Ex: 1 semaine, 1 mois...",

                ChooseArea: "Espaces publicitaires souhaités",
                TopOfPage: "Haut de page",
                carousel: "Carrousel",
                searchBannerPage: "Bannière page de recherche",


                submit: "Envoyer la demande",
                loading: "Envoi en cours...",
            },

            footerInfo: "Nous répondons généralement sous 48h ouvrés.",

            toast: {
                success: "Votre demande a été envoyée avec succès.",
                error: "Une erreur est survenue. Veuillez réessayer.",
            },
        },

        // ******************************** Page Profil *************************************
        profile: {
            sellerApproved: "Vendeur Approuvé",
            sellerNotApproved: "En attente d'approbation",
            fromCreateListing: "Finalisez votre profil vendeur pour publier une annonce",
            sellerCalloutMessagePending: "Votre compte vendeur est en attente d'approbation. Dès qu'il sera validé par un administrateur, vous pourrez publier vos annonces.",
            notSellerCalloutMessage: "Pour publier votre première annonce, activez le mode vendeur ci-dessous et complétez les informations requises.",

            form: {
                title: "Informations personnelles",
                saving: "Traitement...",
                inputUserName: "Nom d'utilisateur",
            },

            sellerMode: {
                title: "Mode vendeur",
                subtitle: "Je souhaite vendre des articles",
                text: "Activez cette option pour mettre en vente vos articles",
                submitButton: "Activer le mode vendeur",
                sellerType: "Type de vendeur",
                sellerParticular: "Particulier",
                sellerParticularText: "Pour les ventes occasionnelles",
                sellerProfessional: "Professionnel",
                sellerProfessionalText: "Pour les entreprises",
                companyName: "Nom de l'entreprise*",
                placeholderCompanyName: "Votre entreprise",
                phoneNeedsCountryHint: "Certains anciens comptes ont des numéros sans indicatif (ex: sans <b>+212</b>). Sélectionne ton pays dans la liste, vérifie le numéro, puis clique <b>Enregistrer</b>.",
                phoneInput: "Téléphone",
                normalizePhone: "L’indicatif seul n’est pas un numéro. Ajoute le numéro complet.",
                whatsAppInput: "WhatsApp",
                siretInput: "Numéro de SIRET*",
                placeholderSiret: "SIRET",
            },

            actions: {
                notSave: "Annuler",
                save: "Enregistrer",
                loading: "Traitement...",
            },

            restrictedArea: {
                title: "Zone sensible",
                subtitle: "Supprimer votre compte effacera toutes vos données et nécessite une reconnexion.",
                deleteAccountMessage: "Supprimer mon compte",
            },

            toast: {
                errorLoadProfile: "Échec du chargement du profil",
                initialSellerLocked: "Un compte vendeur ne peut pas redevenir acheteur.",
                selleRequiredPhone: "Un numéro de téléphone valide est requis pour les vendeurs (pas seulement l’indicatif).",
                requiredCompanyName: "Le nom de l'entreprise est obligatoire pour les professionnels.",
                requiredSiret: "Le numéro de SIRET est obligatoire pour les professionnels.",
                maxFileSize: "La taille maximale est de 5 Mo.",
                fileType: "Formats autorisés : JPEG, PNG, GIF.",
                uploadAvatarSuccess: "Avatar mis à jour",
                uploadAvatarError: "Erreur lors de l'upload de l'avatar",
                notNullPhone: "Tu ne peux pas enregistrer un téléphone vide. Mets un numéro valide (ou contacte le support si tu veux le supprimer).",
                onlyCountryCode: "Téléphone invalide : l’indicatif seul n’est pas un numéro. Ajoute ton numéro complet.",
                incompletePhone: "Téléphone invalide : choisis un pays puis saisis ton numéro complet.",
                notNullWhatsapp: "Tu ne peux pas enregistrer un WhatsApp vide si tu en avais déjà un. Mets un numéro valide.",
                onlyCountryCodeWhatsapp: "WhatsApp invalide : l’indicatif seul n’est pas un numéro. Ajoute ton numéro complet.",
                incompleteWhatsappPhone: "WhatsApp invalide : choisis un pays puis saisis ton numéro complet.",
                success: "Profil mis à jour avec succès",
                error: "Erreur lors de la mise à jour du profil",
                confirmationDeleteAccount: "Êtes-vous sûr de vouloir supprimer votre compte ?",
                successDelete: "Compte supprimé",
                errorDelete: "Erreur lors de la suppression du compte"
            },

            globalLoader: "Chargement du profil...",

        },

        // ******************************* Page favoris *************************************
        favorite: {

            notConnected: {
                title: "Connecte-toi pour voir tes favoris",
                subtitle: "En te connectant, tu pourras retrouver toutes les annonces que tu as ajoutées en favoris.",
                redirectLogin: "Me connecter",
            },

            globalLoader: "Chargement de vos favoris...",

            error: {
                title: "Oups, un problème est survenu",
                reloadButton: "Réessayer",
            },

            title: "Mes favoris",
            subtitle: " Retrouve ici toutes les annonces que tu as mises de côté pour plus tard.",
            favoriteLength: "Total",
            favoriteNull: "Tu n'as encore aucun favori",
            subtitleFavoriteNull: "Explore les bonnes affaires sur GoodPlans.ma et clique sur le petit cœur pour garder les annonces qui t'intéressent.",
            redirectHome: "Découvrir des annonces",

            toast: {
                error: "Impossible de charger vos favoris.",
            }
        },

        // ****************************** Page Inexistante **********************************
        notFound: {
            illustration: "404",
            title: "Page non trouvée",
            subtitle: "La page que vous recherchez n'existe pas ou a été déplacée.",
            redirectHome: "Retour à l'accueil",
            help: "Besoin d'aide pour trouver ce que vous cherchez ?",
            redirectContact: " Contactez-nous",
        },

        // ****************************** Page de vérification de l'OTP *********************************
        verifyOtp: {
            title: "Vérification de votre compte",
            sendEmailMessage: "Un code à 6 chiffres a été envoyé à ",
            subtitle: "Merci de le saisir ci-dessous pour activer votre compte.",
            sending: "Vérification en cours...",
            submitButton: "Valider le code",
            info: " Si vous ne trouvez pas l’email, pensez à vérifier vos spams.",

            invalidEmail: {
                title: "Lien invalide",
                subtitle: "L’email est manquant. Merci de recommencer votre inscription.",
                redirectRegister: "Retour à l’inscription",
            },

            toast: {
                notEmail: "Email manquant. Merci de revenir depuis le lien d’inscription.",
                invalidOtp: "Merci de saisir les 6 chiffres du code OTP.",
                success: "Votre compte a été vérifié avec succès 🎉",
                error: "Code invalide ou expiré. Merci de réessayer.",
            }

        },

        // ****************************** Page de réinitialisation du code de vérification *********************
        resetVerifyCode: {

            invalidEmail: {
                title: "Lien invalide",
                subtitle: "L’email est manquant. Merci de recommencer la procédure.",
            },

            title: "Vérification du code",
            sendEmailMessage: "Un code à 6 chiffres a été envoyé à",
            infoText: "Vous pouvez coller le code directement",
            sending: "Vérification en cours...",
            submitButton: "Valider le code",
            resending: "Envoi en cours...",
            resendButton: "Renvoyer le code",
            redirectLogin: "Retour à la connexion",
            expirationTimer: "⏱ Le code expire dans 10 minutes",

            toast: {
                notEmail: "Email manquant. Merci de recommencer.",
                success: "Un nouveau code a été envoyé à votre email ✅",
                errorResendCode: "Impossible de renvoyer le code. Réessayez.",
                invalidCode: "Merci de saisir les 6 chiffres du code.",
                verifyCode: "Code vérifié ✅",
                errorVerifyCode: "Code invalide ou expiré. Merci de réessayer.",
            }
        },

        // ****************************** Page de reinitialisation du mot de passe **************************************
        resetPassword: {
            title: "Nouveau mot de passe",
            subtitle: "Choisissez un nouveau mot de passe sécurisé pour votre compte.",
            redirectLogin: " Retour à la connexion",

            form: {
                inputNewPwd: "Nouveau mot de passe",
                placeholderNewPwd: "Minimum 8 caractères",
                requiredPwd: "Mot de passe requis",
                minLength: "Le mot de passe doit contenir au moins 8 caractères.",
                pattern: "Doit contenir une majuscule, une minuscule et un chiffre.",
                inputConfirmPwd: "Confirmer le mot de passe",
                placeholderconfirmPwd: "Confirmez votre mot de passe",
                requiredConfirmPwd: "Confirmation requise",
                validatePwd: "Les deux mots de passe ne correspondent pas.",
                VeryStrongPwd: "Mot de passe très fort",
                strongPwd: "✓ Mot de passe fort",
                meanPwd: "⚠ Mot de passe moyen",
                lowPwd: "Mot de passe faible",
                submitting: " Réinitialisation...",
                submitButton: "Enregistrer le nouveau mot de passe",
            },

            toast: {
                notEmailOrCode: "Lien invalide. Merci de recommencer la procédure.",
                notConfirmPwd: "Les deux mots de passe ne correspondent pas.",
                errParamPwd: "Le mot de passe doit contenir au moins 8 caractères.",
                success: "Mot de passe réinitialisé avec succès ✅ ",
                error: "Impossible de réinitialiser le mot de passe."
            }
        },

        // ******************************* Liste des conversations **************************************
        conversationList: {

            notConnected: {
                title: "Connecte-toi pour voir tes conversations",
            },

            title: "Mes conversations",
            placeholderSearch: "Rechercher par nom, annonce...",
            errorLoading: "Impossible de charger les conversations.",
            refreshButton: "Réesayer",
            notConversations: "Aucune conversation trouvée",
            nullConversations: "Vous n'avez aucune conversation pour le moment.",
            resetButton: "Effacer la recherche",
            newMessageButton: "Nouveau message",

        },

        // ******************************* Interface de chat ***************************************
        chatWindow: {

            notExistingListing: {
                title: "Sélectionnez une conversation dans la liste ou utilisez le bouton ",
                contactSeller: "Contacter le vendeur",
                from: "depuis une annonce.",
            },

            error: {
                errorMsg: "Impossible de charger la conversation",
                notFound: "Conversation introuvable",
                refreshButton: "Réesayer",
            },

            title: "Commencez la conversation à propos de cette annonce.",
        },

        // ******************************** Page de paramétres ****************************************
        settings: {
            title: "Paramètres",

            tabs: {
                account: "Compte",
                notifications: "Notifications",
                security: "Sécurité",
            },

            alerts: {
                loadError: "Impossible de charger vos paramètres",
                preferencesUpdated: "Préférences mises à jour",
                preferencesSaveError: "Erreur lors de la sauvegarde des préférences",
                accountUpdated: "Compte mis à jour",
                accountUpdateError: "Erreur lors de la mise à jour du compte",
                deleteError: "Suppression impossible",
                deleteConfirm: "Êtes-vous sûr de vouloir supprimer votre compte ?",
                passwordFieldsRequired: "Merci de remplir tous les champs mot de passe",
                passwordMismatch: "Les mots de passe ne correspondent pas",
                passwordInvalid: "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule et un chiffre",
                passwordUpdated: "Mot de passe mis à jour. Veuillez vous reconnecter.",
                passwordChangeError: "Impossible de changer le mot de passe",
            },

            account: {
                title: "Compte",
                email: "Email",
                emailHelp: "Pour modifier votre adresse email, veuillez contacter le support.",
                username: "Nom d'utilisateur",
                accountType: "Type de compte",
                accountTypeHelp: "La modification du type de compte se fait via le support.",
                phone: "Téléphone",
                whatsapp: "WhatsApp",
                phoneHelper: "Affiché aux acheteurs si vous l’autorisez",
                whatsappHelper: "Permet aux acheteurs de vous contacter rapidement",
                company: "Société",
                companyHelper: "Facultatif pour les particuliers, obligatoire pour certains comptes pros.",
                logout: "Déconnexion",
                save: "Enregistrer",
                deleting: "Suppression...",
                deleteAccount: "Supprimer mon compte",
            },

            notifications: {
                title: "Notifications",
                emailTitle: "Email",
                emailDesc: "Recevoir les mises à jour importantes par email.",
                pushTitle: "Notifications push",
                pushDesc: "Alertes rapides sur l'activité de vos annonces.",
                save: "Sauvegarder",
            },

            security: {
                title: "Sécurité",
                oldPassword: "Ancien mot de passe",
                newPassword: "Nouveau mot de passe",
                confirmPassword: "Confirmation",
                passwordHelper: "Au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
                update: "Mettre à jour",
            },

            sellerProfile: {
                title: "Profil vendeur",
                sellerType: "Type de vendeur",
                notProvided: "Non renseigné",
            },

            misc: {
                na: "N/A",
                unknownSeller: "Vendeur inconnu",
            },
        },

        // ******************************** Modification des listings ****************************************
        editListing: {
            errors: {
                loadError: "Impossible de charger cette annonce",
                unsupportedCategory: "Catégorie non supportée pour l’édition",
                updateError: "Erreur lors de la mise à jour de l’annonce",
                validationFix: "Merci de corriger les erreurs",
                notFound: "Annonce introuvable ou non autorisée.",
            },

            success: {
                updated: "Annonce mise à jour avec succès",
            },

            navigation: {
                backToListings: "Retour à mes annonces",
            },

            header: {
                title: "Modifier l’annonce",
                category: "Catégorie: ",
            },

            sections: {
                generalInfo: "Informations générales",
                specificDetails: "Détails spécifiques",
                images: "Images",
            },

            fields: {
                title: "Titre",
                description: "Description",
                price: "Prix",
                city: "Ville",
                region: "Région",
            },

            validation: {
                titleRequired: "Titre requis",
                descriptionRequired: "Description requise",
                invalidPrice: "Prix invalide",
            },

            images: {
                none: "Aucune image enregistrée pour cette annonce.",
                delete: "Supprimer",
                addNew: "Ajouter de nouvelles images",
                selectedCount: "nouvelle(s) image(s) sélectionnée(s)",
            },

            buttons: {
                cancel: "Annuler",
                save: "Enregistrer",
                saving: "Enregistrement...",
            },
        },

        // ******************************** Page de création d'une annonce ****************************************
        createListing: {
            guard: {
                checking: "Vérification de vos droits de publication...",
                pendingApproval:
                    "Votre compte vendeur est en attente d'approbation avant de pouvoir publier une annonce.",
                notSeller:
                    "Pour publier une annonce, vous devez d'abord activer le mode vendeur dans votre profil.",
                statusCheckFailed:
                    "Impossible de vérifier votre statut vendeur pour le moment.",
            },

            wizard: {
                title: "Créer une annonce",
                preview: "Aperçu",
                stepsTitle: "Étapes de création",
            },

            steps: {
                category: "Catégorie",
                generalInfo: "Infos",
                specificDetails: "Détails",
                pricing: "Prix",
                images: "Photos",
                submission: "Validation",
            },

            validation: {
                requiredFields:
                    "Merci de compléter les champs obligatoires avant de continuer.",
                missingFields: "Certains champs obligatoires sont manquants.",
            },

            images: {
                maxReached: "Vous avez déjà atteint le maximum de 10 images.",
                uploadSuccess: "Images ajoutées avec succès.",
                uploadError:
                    "Erreur lors de l’upload des images. Veuillez réessayer.",
                noUrlReturned:
                    "Aucune URL d’image retournée par le serveur.",
            },

            success: {
                created: "Votre annonce a été créée avec succès !",
            },

            errors: {
                creationFailed:
                    "Une erreur est survenue lors de la création de l’annonce.",
            },

            inappropriate: {
                title: "Contenu potentiellement inapproprié détecté",
                description:
                    "Merci de vérifier le titre et la description de votre annonce.",
            },

            generalInfo: {
                infoNote:
                    "Fournissez des informations précises pour attirer plus d'acheteurs potentiels.",

                fields: {
                    title: "Titre",
                    titlePlaceholder: "Titre de votre annonce",

                    description: "Description",
                    descriptionPlaceholder:
                        "Description détaillée de votre annonce",

                    locationTitle: "Localisation",

                    city: "Ville",
                    citySelect: "Sélectionnez une ville",

                    region: "Région",
                    regionSelect: "Sélectionnez une région",

                    loading: "Chargement...",
                },
            },

            specificDetails: {
                title: "Détails de l’annonce",

                selectCategoryFirst: "Sélectionnez une catégorie",

                loading: "Chargement...",
                loadingRealEstate: "Chargement des types de biens...",
                loadingServices: "Chargement des types de services...",
                loadingCraft: "Chargement des types d’artisanat...",
                loadingBrands: "Chargement des marques...",
                loadingModels: "Chargement des modèles...",

                realEstate: {
                    sectionTitle: "Bien immobilier",
                    propertyType: "Type de bien",
                    propertyTypePlaceholder: "Appartement, maison, bureau…",
                    surface: "Surface (m²)",
                    surfacePlaceholder: "Ex : 120",
                    rooms: "Pièces",
                    bedrooms: "Chambres",
                    bathrooms: "Salles de bain",
                    garden: "Jardin",
                    pool: "Piscine",
                    garage: "Garage",
                },

                vehicle: {
                    sectionTitle: "Véhicule",
                    brand: "Marque",
                    brandSelect: "Sélectionnez une marque",
                    model: "Modèle",
                    modelSelect: "Sélectionnez un modèle",
                    selectBrandFirst: "Sélectionnez d’abord une marque.",
                    year: "Année",
                    yearPlaceholder: "Ex : 2018",
                    mileage: "Kilométrage (km)",
                    mileagePlaceholder: "Ex : 120000",
                },

                service: {
                    sectionTitle: "Service",
                    serviceType: "Type de service",
                    servicePlaceholder: "Plomberie, coiffure, ménage…",
                    experienceLevel: "Niveau d’expérience",
                    experiencePlaceholder: "Débutant / Intermédiaire / Expert",
                    homeService: "Prestation à domicile",
                },

                craft: {
                    sectionTitle: "Artisanat",
                    craftType: "Type d’artisanat",
                    craftPlaceholder: "Sculpture, tissage, poterie…",
                    origin: "Origine",
                    originPlaceholder: "Ex : Cameroun, Maroc…",
                    material: "Matériau",
                    materialPlaceholder: "Bois, cuir, métal…",
                    handmade: "Fait main",
                    authentic: "Authentique",
                    vintage: "Vintage / ancien",
                    dimensions: "Dimensions (optionnel)",
                    dimensionsPlaceholder: "Ex : 120x60x75 cm",
                },
            },

            categoryStep: {
                loading: "Chargement des catégories…",
                error: "Impossible de charger les catégories. Vérifiez l’API /categories.",

                warning:
                    "Veuillez créer une annonce distincte pour chaque bien ou service.",

                categoryLabel: "Catégorie",
                selectCategoryError: "Veuillez sélectionner une catégorie.",

                transactionLabel: "Type de transaction",
                transactionSale: "Achat / Vente",
                transactionRent: "Location",
                selectTransactionError:
                    "Veuillez sélectionner un type de transaction.",
            },
        },

    },

    en: {
        // ******************************** Register ****************************************
        register: {
            title: "Register",
            inputUsername: "Username",
            indicationUsername: "Letters, numbers, hyphens, and underscores only.",
            inputPassword: "Password",
            indicationPassword: "Must contain at least one uppercase letter, one lowercase letter, and one number.",
            inputConfirmPassword: "Confirm Password",
            sellerCheckbox: "I want to register as a seller",
            sellerType: "Seller Type",
            sellerParticular: "Individual",
            sellerProfessional: "Professional",
            phoneInput: "Phone",
            helperPhoneInputText: "Your number will be visible to buyers",
            whatsAppPhoneInput: "WhatsApp (optional)",
            helperWhatsAppPhoneInputText: "Allows buyers to contact you quickly",
            companyNameInput: "Company name",
            sellerWarning: "Your seller account will need to be validated by the administration.",
            submitButton: "Sign up",
            loginRedirect: "Already have an account? Log in",
            loading: "Processing...",
        },

        // ******************************** Login ****************************************
        login: {
            title: "Log in",
            titleGoogle: "Log in with Google",
            inputPassword: "Password",
            forgotLoading: "Sending...",
            forgotPassword: "Forgot your password?",
            loading: "Logging in...",
            registerRedirect: "Don't have an account yet?",
            impConnection: "Unable to log in",
            notEmailMsg: "Please enter your email address first.",
            resetPasswordmsg: "A reset email has been sent.",
            resetPasswordErr: "Unable to send the reset email.",
        },


        // ******************************** HomePage ****************************************
        home: {
            heroTitle: "The right moment, the right item, the right deal starts here",
            heroSubtitle: "One platform, thousands of great deals… no middleman.",
            searchPlaceholder: "What are you looking for?",
            recentListings: "Recent listings",
            filter: "Filter",
            seeMore: "See more",
            seeAll: "See all",
            seeAllLabel: "See all",
            seeMoreLabel: "See all",
            noResults: "No listings match your filters.",
            noResultsCategory: "No listings in this category.",
            noResultsImmo: "No real estate listings.",
            noResultsCraft: "No craft listings.",
            noResultsServices: "No service listings.",
            noResultsVehicle: "No vehicle listings.",
            sponsored: "Sponsored",
            discover: "Discover",
        },
        categories: {
            vehicules: "Vehicles",
            immobilier: "Real Estate",
            services: "Services",
            artisanat: "Crafts",
        },
        transaction: {
            rent: "For rent",
            sale: "For sale",
        },

        // ******************************** Fiters Drawers ****************************************
        filters: {
            title: "Filters",
            category: "Category",
            location: "Location",
            cityAll: "All cities",
            regionAll: "All regions",
            price: "Price",
            min: "Min",
            max: "Max",
            transactionType: "Transaction type",
            rent: "Rent",
            buy: "Buy",
            reset: "Reset",
            apply: "Apply",
            loading: "Loading...",
        },

        // ******************************** Search Results Page ****************************************
        search: {
            placeholder: "What are you looking for?",
            resultsTitle: "Results",
            allListings: "All listings",
            resultsFor: "result",
            resultsForPlural: "results",
            noResults: "No listings match your search.",
            sponsored: "Sponsored",
            discover: "Discover",
            city: "City",
            region: "Region",
            min: "Min",
            max: "Max",
            priceRange: "Price range",
            resetFilters: "Reset filters",
            viewResults: "View",
        },

        // ******************************** Listing  ****************************************
        listing: {
            description: "Description",
            publishedOn: "Published on",
            views: "views",
            favorites: "favorites",
            photos: "photos",
            share: "Share",
            linkCopied: "Link copied",
            details: "Details",
            premium: "Premium",
            sold: "Sold",
            rent: "For rent",
            sale: "For sale",

            rentalPeriod: {
                day: "day",
                week: "week",
                month: "month",
                year: "year",
            },
            seller: {
                defaultName: "Seller",
                memberSince: "Member since",
                contactSeller: "Contact seller",
                loginToChat: "Log in to chat",
                viewProfile: "View profile",
                ariaProfile: "View profile of",
                linkCopied: "Link copied"
            },
            safety: {
                title: "Safety tips",
                tip1: "Meet in a public and safe place.",
                tip2: "Never share your banking information in advance.",
                tip3: "Inspect the product before making payment.",
                tip4: "Report any suspicious behavior to the GoodPlans team."
            },
            cat: {
                // Section title
                details: "Details",

                // VEHICLE
                vehicle: {
                    brand: "Brand",
                    model: "Model",
                    year: "Year",
                    mileage: "Mileage",
                },

                // REAL ESTATE
                realEstate: {
                    rooms: "Rooms",
                    surface: "Area",
                    bedrooms: "Bedrooms",
                    bathrooms: "Bathrooms",
                },

                // SERVICES
                services: {
                    serviceType: "Service type",
                    experience: "Experience",
                },

                // CRAFT
                craft: {
                    type: "Type",
                    material: "Material",
                    dimensions: "Dimensions",
                },
            },
        },


        // ******************************** Footer ****************************************
        footer: {
            description: "The leading classifieds platform in Morocco. Find everything you need or easily sell what you no longer use.",
            mobileApp: "GoodPlans mobile app",
            downloadApp: "Download GoodPlans on the App Store",
            quickLinks: "Quick links",
            categories: "Categories",
            contact: "Contact",
            rights: "All rights reserved.",
            admin: "Administration",

            links: {
                createListing: "Post a listing",
                safety: "Safety",
                faq: "FAQ",
                contact: "Contact",
                support: "Support",

                realEstate: "Real Estate",
                vehicles: "Vehicles",
                services: "Services",
                craft: "Crafts",

                privacy: "Privacy policy",
                terms: "Terms of use",
                legal: "Legal notice",
            }
        },

        // ******************************** Navbar****************************************
        navbar: {
            postListing: "Post a listing",
            postShort: "Post",
            requestQuote: "Request advertising quote",
            requestQuoteShort: "Ad quote",
            messages: "Messages",
            login: "Login",
            logout: "Logout",
            home: "Home",
            search: "Search",

            profile: "Profile",
            favorites: "My favorites",
            settings: "Settings",

            sellerDashboard: "Seller dashboard",
            sellerDashboardShort: "Seller panel",

            admin: "Administration",
        },

        // **************************** Privacy Policy ************************************
        safety: {
            heroTitle: "Your safety, our priority",
            heroSubtitle:
                "At GoodPlans, trust is at the heart of our free platform. We implement strict technical and organizational measures to protect your data and secure your interactions.",

            sections: {
                dataProtection: {
                    title: "Personal Data Protection",
                    bullets: [
                        "Your personal data (name, email, phone, listings, messages) is strictly confidential.",
                        "It is hosted on secure servers protected by advanced encryption protocols.",
                        "Access to data is limited and controlled in accordance with applicable regulations.",
                        "We never sell your data to third parties.",
                    ],
                },
                accountSecurity: {
                    title: "User Account Security",
                    bullets: [
                        "OTP authentication (one-time code) sent by email at each login.",
                        "No password to remember, reducing hacking risks.",
                        "Each OTP expires after a few minutes and can only be used once.",
                        "Suspicious activity detection to prevent fraudulent access.",
                        "You are responsible for the security of your email inbox.",
                    ],
                },
                moderation: {
                    title: "Moderation and Fraud Prevention",
                    bullets: [
                        "All listings are reviewed before publication.",
                        "Seller accounts may be manually verified.",
                        "A reporting system allows users to flag suspicious or abusive content.",
                        "Fraudulent behavior results in account suspension or removal.",
                        "Active monitoring of listings to detect scam attempts.",
                    ],
                },
                messaging: {
                    title: "Secure Messaging",
                    bullets: [
                        "All communications between users take place through our internal messaging system.",
                        "This protects your personal contact details and ensures traceability in case of disputes.",
                        "Never share banking or personal information outside the platform.",
                    ],
                },
                payments: {
                    title: "Secure Featured Listings System",
                    bullets: [
                        "Featuring listings is an optional paid feature.",
                        "Payments are processed via certified and recognized providers.",
                        "Banking information is never stored on our servers.",
                        "All transactions are protected by SSL/TLS protocols.",
                    ],
                },
                regulations: {
                    title: "Regulatory Compliance",
                    bullets: [
                        "We comply with applicable data protection and e-commerce regulations.",
                        "You have the right to access, modify, and delete your data.",
                        "Please consult our Privacy Policy for more details.",
                    ],
                },
            },

            accountTipsTitle: "Tips to Protect Your Account",
            accountTips: [
                "Never share your OTP code with anyone.",
                "Make sure you are on the official GoodPlans website before entering your code.",
                "Do not click on suspicious links received by email.",
            ],
            emailWarning:
                "Your email inbox is part of your security: keep it protected (password, 2FA, etc.).",

            transactionTipsTitle: "Tips for Safe Transactions",
            transactionTips: [
                "Prefer meeting in public places for in-person exchanges.",
                "Be cautious of unusually low prices or payment requests outside the platform.",
                "Always use internal messaging to communicate.",
            ],
            reportWarning:
                "If in doubt, report immediately: we analyze and act quickly.",

            helpTitle: "Need help?",
            helpText:
                "If you encounter suspicious behavior or a security issue, use the reporting feature or contact support through the application.",
        },

        // ******************************** FAQ ****************************************
        faqHeader: {
            title: "FAQ – Frequently Asked Questions",
            subtitle:
                "Find here the answers to the most frequently asked questions about GoodPlans.",
        },

        faq: [
            {
                category: "General",
                question: "Is registration free?",
                answer:
                    "Yes, completely. Registration and use of GoodPlans are 100% free. You can create an account, browse listings, publish ads, and communicate without any fees.",
            },
            {
                category: "General",
                question: "How does OTP login work?",
                answer:
                    "Each time you log in, you receive a one-time password (OTP) by email. Simply enter it to access your account. This code expires after a few minutes and can only be used once, ensuring your account security.",
            },
            {
                category: "General",
                question: "I did not receive my OTP code, what should I do?",
                answer: [
                    "Check your spam/junk folder.",
                    "Make sure you entered the correct email address.",
                    "Wait a few minutes, then request a new code.",
                    "If the issue persists, contact our support team.",
                ],
            },

            {
                category: "Ad Publishing",
                question: "Who can publish a listing?",
                answer:
                    "Individuals can publish a limited number of listings for free. Professionals must create a seller account, which is subject to administrator approval.",
            },
            {
                category: "Ad Publishing",
                question: "Why does my listing need to be approved?",
                answer: [
                    "Approval ensures the quality of listings.",
                    "Prevents scams and fraudulent content.",
                    "Protects all users of the platform.",
                    "Once approved, your listing becomes immediately visible.",
                ],
            },
            {
                category: "Ad Publishing",
                question: "How long does approval take?",
                answer:
                    "Generally, listings are approved within 24 to 48 hours. You will receive an email notification as soon as your listing goes live.",
            },
            {
                category: "Ad Publishing",
                question: "Can I edit my listing after publication?",
                answer: [
                    "Yes, you can modify the text and description.",
                    "The images.",
                    "The price.",
                    "The category-specific information.",
                    "Any major modification may require a new approval.",
                ],
            },
            {
                category: "Ad Publishing",
                question: "Can I delete my listing?",
                answer:
                    "Yes, at any time from your personal dashboard. Deletion is immediate.",
            },

            {
                category: "Promotion",
                question: "What is featured listing promotion?",
                answer:
                    "It is a paid option that gives more visibility to your listing by placing it at the top of search results and on the homepage.",
            },
            {
                category: "Promotion",
                question: "How much does promotion cost?",
                answer:
                    'Prices vary depending on the duration and level of promotion selected. Please check the "Pricing" page for more details.',
            },
            {
                category: "Promotion",
                question: "How can I pay for promotion?",
                answer:
                    "Payments are secure and handled by certified payment providers (bank card, mobile money depending on availability).",
            },
            {
                category: "Promotion",
                question: "Does promotion guarantee a sale?",
                answer:
                    "No, it increases your listing’s visibility but does not guarantee a transaction. Success also depends on the quality of your listing, pricing, and market demand.",
            },

            {
                category: "Security and Data",
                question: "Is my data secure?",
                answer:
                    "Yes. Your data is protected, encrypted, and used only for platform functionality. We never resell your data.",
            },
            {
                category: "Security and Data",
                question: "How can I contact a seller or buyer?",
                answer:
                    "Exclusively through the platform’s internal messaging system. This ensures your safety and avoids direct sharing of personal information.",
            },
            {
                category: "Security and Data",
                question: "What should I do in case of an issue or scam?",
                answer: [
                    'Use the "Report" button on the listing or profile concerned.',
                    "Contact our support team with as much information as possible (messages, listing, user).",
                    "Our team will quickly analyze the situation and take the necessary measures.",
                ],
            },
            {
                category: "Security and Data",
                question: "How can I avoid scams?",
                answer: [
                    "Never pay outside the platform.",
                    "Be cautious of unusually low prices.",
                    "Prefer meeting in public places.",
                    "Always use the internal messaging system.",
                    "Report any suspicious behavior.",
                ],
            },

            {
                category: "User Account",
                question: "Can I have multiple accounts?",
                answer:
                    "No, each user may only have one account to ensure transparency and platform security.",
            },
            {
                category: "User Account",
                question: "How can I update my personal information?",
                answer:
                    "Go to Settings > My Profile to edit your information (name, phone number, photo, etc.).",
            },
            {
                category: "User Account",
                question: "Can I delete my account?",
                answer:
                    "Yes, you can request the deletion of your account and all your data at any time through the settings or by contacting support. This action is irreversible.",
            },
            {
                category: "User Account",
                question: "I forgot which email I registered with",
                answer:
                    "Contact our support team and provide information that helps identify you (name, phone number, etc.).",
            },
        ],

        // ********************************  Contact Page ****************************************
        contact: {
            title: "Contact us",
            subtitle: "We're here to help. Fill out the form below and we'll get back to you as soon as possible.",
            inputName: "Name",
            inputSubject: "Subject",
            inputMessage: "Message",
            loading: "Sending...",
            button: "Send",
            validationErrorMsg: "Please fill in at least your name, email address, and message.",
            successMsg: "Your message has been sent successfully!",
            errorMsg: "An error has occurred. Please try again.",
        },

        // ******************************** Terms ****************************************
        terms: {
            title: "Terms of Use",
            subtitle: "Goodplans Morocco • RENOVIO DIGITAL LLC",
            lastUpdated: "December 30, 2025",

            toc: [
                { id: "s1-acceptation-des-conditions", label: "1. ACCEPTANCE OF TERMS" },
                { id: "s2-presentation-de-la-plateforme", label: "2. PLATFORM PRESENTATION" },
                { id: "s3-inscription-et-compte-utilisateur", label: "3. REGISTRATION AND USER ACCOUNT" },
                { id: "s4-publication-d-annonces", label: "4. LISTING PUBLICATION" },
                { id: "s5-regles-de-conduite", label: "5. RULES OF CONDUCT" },
                { id: "s6-transactions-entre-utilisateurs", label: "6. USER TRANSACTIONS" },
                { id: "s7-propriete-intellectuelle", label: "7. INTELLECTUAL PROPERTY" },
                { id: "s8-donnees-personnelles", label: "8. PERSONAL DATA" },
                { id: "s9-limitation-de-responsabilite", label: "9. LIMITATION OF LIABILITY" },
                { id: "s10-signalement-et-reclamations", label: "10. REPORTING AND CLAIMS" },
                { id: "s11-modifications-des-cgu", label: "11. CHANGES TO TERMS" },
                { id: "s12-resiliation", label: "12. TERMINATION" },
                { id: "s13-droit-applicable-et-juridiction", label: "13. GOVERNING LAW AND JURISDICTION" },
                { id: "s14-dispositions-diverses", label: "14. MISCELLANEOUS PROVISIONS" },
                { id: "s15-contact", label: "15. CONTACT" }
            ],

            blocks: [
                { t: "h1", text: "GENERAL TERMS OF USE" },
                { t: "p", text: "Goodplans Morocco" },
                { t: "p", text: "Effective date: December 30, 2025" },

                { t: "h2", id: "s1-acceptation-des-conditions", num: "1", text: "ACCEPTANCE OF TERMS" },
                { t: "p", text: "These General Terms of Use (hereinafter the “Terms”) govern your access to and use of the Goodplans Morocco platform (hereinafter the “Platform”), accessible via web and mobile applications. The Platform is operated by RENOVIO DIGITAL LLC, a limited liability company incorporated in the United States." },
                { t: "p", text: "By accessing the Platform or creating an account, you fully accept these Terms. If you do not agree, please do not use the Platform." },

                { t: "h2", id: "s2-presentation-de-la-plateforme", num: "2", text: "PLATFORM PRESENTATION" },
                { t: "h3", text: "2.1. Service Description" },
                { t: "ul", items: ["Create a user account", "Publish listings for goods or services", "Browse other users’ listings", "Contact advertisers via internal messaging", "Be contacted by other users"] },
                { t: "h3", text: "2.2. Role of the Platform" },
                { t: "p", text: "The Platform acts solely as a technical intermediary. We are neither sellers, buyers, nor service providers. Transactions and contractual relationships occur directly between users." },

                { t: "h2", id: "s3-inscription-et-compte-utilisateur", num: "3", text: "REGISTRATION AND USER ACCOUNT" },
                { t: "h3", text: "3.1. Registration Conditions" },
                { t: "ul", items: ["Be at least 18 years old", "Provide accurate and up-to-date information", "Create only one account per person", "Not impersonate others"] },
                { t: "h3", text: "3.2. Account Security" },
                { t: "ul", items: ["Do not share your login credentials", "Inform us of any unauthorized use", "Log out at the end of each session"] },
                { t: "h3", text: "3.3. Suspension and Termination" },
                { t: "p", text: "We may suspend or delete an account in case of Terms violation, fraudulent/abusive behavior, or any legitimate reason." },

                { t: "h2", id: "s4-publication-d-annonces", num: "4", text: "LISTING PUBLICATION" },
                { t: "h3", text: "4.1. Advertiser Obligations" },
                { t: "ul", items: ["Accurate and non-misleading information", "Authentic photos", "Respect intellectual property", "Update/remove listing when unavailable", "Realistic market-compliant price"] },
                { t: "h3", text: "4.2. Prohibited Content" },
                { t: "ul", items: ["Illegal or counterfeit goods/services", "Weapons, drugs, illegal substances", "Pornographic, violent or hateful content", "Sexual services", "Protected animals", "Prescription drugs", "Falsified official documents", "Any unlawful content"] },
                { t: "h3", text: "4.3. Moderation" },
                { t: "p", text: "We may moderate/refuse/modify/delete non-compliant listings without prior notice." },

                { t: "h2", id: "s5-regles-de-conduite", num: "5", text: "RULES OF CONDUCT" },
                { t: "ul", items: ["Comply with Moroccan law", "Respect and courtesy between users", "No harassment/threats/insults", "No fraudulent or malicious use", "No bypassing security measures", "No commercial data collection without consent", "No spam / unsolicited advertising", "No fake or multiple accounts"] },

                { t: "h2", id: "s6-transactions-entre-utilisateurs", num: "6", text: "USER TRANSACTIONS" },
                { t: "h3", text: "6.1. User Responsibility" },
                { t: "p", text: "Transactions occur directly between users. Each user is responsible for verifying identity/reliability, negotiation, execution, compliance, payment and delivery." },
                { t: "h3", text: "6.2. Disclaimer" },
                { t: "ul", items: ["Non-conformity", "Hidden defects", "Non-payment", "Non-delivery", "Fraud/scam", "Misleading listing"] },
                { t: "h3", text: "6.3. Safety Recommendations" },
                { t: "ul", items: ["Meet in public places", "Verify the item before transaction", "Avoid advance payments without guarantees", "Be cautious of overly attractive offers", "Report suspicious behavior"] },

                { t: "h2", id: "s7-propriete-intellectuelle", num: "7", text: "INTELLECTUAL PROPERTY" },
                { t: "h3", text: "7.1. Platform Rights" },
                { t: "p", text: "All elements (structure, design, graphics, logos, codes, texts, etc.) are owned by RENOVIO DIGITAL LLC or licensors and protected by law." },
                { t: "h3", text: "7.2. User Content" },
                { t: "p", text: "You retain your rights but grant a worldwide, non-exclusive, royalty-free and transferable license to use the content within the service framework." },

                { t: "h2", id: "s8-donnees-personnelles", num: "8", text: "PERSONAL DATA" },
                { t: "p", text: "Personal data processing is governed by our Privacy Policy." },

                { t: "h2", id: "s9-limitation-de-responsabilite", num: "9", text: "LIMITATION OF LIABILITY" },
                { t: "h3", text: "9.1. Availability" },
                { t: "p", text: "No guarantee of uninterrupted access (maintenance, updates, outages, force majeure)." },
                { t: "h3", text: "9.2. Listing Content" },
                { t: "p", text: "We do not guarantee the accuracy/quality/safety/legal compliance of goods or services." },
                { t: "h3", text: "9.3. Indirect Damages" },
                { t: "p", text: "Within legal limits, no liability for indirect damages (loss of profit, data, etc.)." },

                { t: "h2", id: "s10-signalement-et-reclamations", num: "10", text: "REPORTING AND CLAIMS" },
                { t: "p", text: "Report via the dedicated function on each listing or by email: contact@goodplansmaroc.ma." },

                { t: "h2", id: "s11-modifications-des-cgu", num: "11", text: "CHANGES TO TERMS" },
                { t: "p", text: "We may modify the Terms at any time. Changes apply upon publication." },

                { t: "h2", id: "s12-resiliation", num: "12", text: "TERMINATION" },
                { t: "p", text: "You may delete your account at any time via settings. We may suspend or terminate in case of Terms violation." },

                { t: "h2", id: "s13-droit-applicable-et-juridiction", num: "13", text: "GOVERNING LAW AND JURISDICTION" },
                { t: "p", text: "These Terms are governed by Moroccan law. Disputes fall under competent Moroccan courts." },

                { t: "h2", id: "s14-dispositions-diverses", num: "14", text: "MISCELLANEOUS PROVISIONS" },
                { t: "h3", text: "14.1. Entire Agreement" },
                { t: "p", text: "Terms + Privacy Policy + Legal Notice constitute the entire agreement." },
                { t: "h3", text: "14.2. Partial Invalidity" },
                { t: "p", text: "If a clause is invalid, others remain effective." },
                { t: "h3", text: "14.3. No Waiver" },
                { t: "p", text: "Failure to exercise a right does not constitute waiver." },

                { t: "h2", id: "s15-contact", num: "15", text: "CONTACT" },
                { t: "p", text: "Email: contact@goodplansmaroc.ma" },
                { t: "p", text: "Mail: RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, United States" }
            ]
        },

        // ******************************** Support Page ****************************************
        support: {
            title: "Support",
            subtitle: "Need help? Fill out the form below.Our team will usually respond within 48 hours.",
            badge1: "Support",
            badge2: "Accounts",
            badge3: "Listings",
            badge4: "Payments",
            infoTitle: "Quick response",
            infoText: "Our team processes requests within 48 hours(often faster).",
            infoSecondTitle: "Good to know",
            infoText1: "Clearly describe your problem.",
            infoText2: "Add details(ad, city, screenshot if necessary).",
            infoText3: "Check your email, including spam.",
            formTitle: "Contact form",
            formSubtitle: "All fields are required to send your request.",
            inputName: "Name",
            placeholderName: "Your name",
            inputSubject: "Subject",
            placeholderSubject: "Ex: login issue, blocked listing...",
            inputMsg: "Message",
            placeholderMsg: "Describe your problem in detail...",
            indicationMsg: "Describe your problem clearly for a quick response. (Minimum 10 characters.) ",
            resetButton: "Reset",
            loading: "Sending...",
            submitButton: "Send",
            miniFaqTitle: "Frequently asked questions",
            miniFaqCard1P1: "Within 48 hours",
            miniFaqCard1P2: "Average response time.",
            miniFaqCard2P1: "OTP",
            miniFaqCard2P2: "Also check your spam folder.",
            miniFaqCard3P1: "Security",
            miniFaqCard3P2: "Always via internal messaging.",
            notName: "Please enter your name.",
            notMsg: "Please describe your problem (minimum 10 characters).",
            notSubject: "Please enter the subject of your request.",
            notEmail: "Please enter your email address so that we can reply to you.",
            successMsg: "Request sent. Response within 48 hours.",
            errorMsg: "Unable to send the request. Please try again.",

        },

        // ************************************* Legal Page ****************************************

        legal: {
            title: "Legal Notice",
            subtitle: "Goodplans Morocco • RENOVIO DIGITAL LLC",
            lastUpdated: "December 30, 2025",

            toc: [
                { id: "s1-editeur-de-la-plateforme", label: "1. PLATFORM PUBLISHER" },
                { id: "s2-hebergement", label: "2. HOSTING" },
                { id: "s3-objet-de-la-plateforme", label: "3. PURPOSE OF THE PLATFORM" },
                { id: "s4-acces-a-la-plateforme", label: "4. ACCESS TO THE PLATFORM" },
                { id: "s5-propriete-intellectuelle", label: "5. INTELLECTUAL PROPERTY" },
                { id: "s6-protection-des-donnees-personnelles", label: "6. PERSONAL DATA PROTECTION" },
                { id: "s7-cookies", label: "7. COOKIES" },
                { id: "s8-responsabilite", label: "8. LIABILITY" },
                { id: "s9-signalement-de-contenu-illicite", label: "9. REPORTING ILLEGAL CONTENT" },
                { id: "s10-liens-hypertextes", label: "10. HYPERLINKS" },
                { id: "s11-droit-applicable-et-juridiction-competente", label: "11. GOVERNING LAW AND JURISDICTION" },
                { id: "s12-modification-des-mentions-legales", label: "12. MODIFICATION OF LEGAL NOTICE" },
                { id: "s13-contact", label: "13. CONTACT" }
            ],

            blocks: [
                { t: "h1", text: "LEGAL NOTICE" },
                { t: "p", text: "Goodplans Morocco" },
                { t: "p", text: "Last updated: December 30, 2025" },

                { t: "h2", id: "s1-editeur-de-la-plateforme", num: "1", text: "PLATFORM PUBLISHER" },
                { t: "p", text: "The Goodplans Morocco platform (hereinafter the “Platform”) is published by:" },
                { t: "p", text: "Company name: RENOVIO DIGITAL LLC" },
                { t: "p", text: "Legal form: Limited Liability Company (LLC)" },
                { t: "p", text: "EIN: 37-2202455" },
                { t: "p", text: "Registered office: 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, United States" },
                { t: "p", text: "State of incorporation: New Mexico, United States" },
                { t: "p", text: "Date of incorporation: October 31, 2025" },
                { t: "p", text: "Publication director: Belmeskine Said, Member" },
                { t: "p", text: "Contact: contact@goodplansmaroc.ma" },
                { t: "p", text: "Main area of activity: Morocco" },

                { t: "h2", id: "s2-hebergement", num: "2", text: "HOSTING" },
                { t: "p", text: "The Platform is hosted by:" },
                { t: "p", text: "[To be completed with your hosting provider information]" },
                { t: "p", text: "Company name: [Hosting provider name]" },
                { t: "p", text: "Address: [Address]" },
                { t: "p", text: "Phone: [Phone number]" },

                { t: "h2", id: "s3-objet-de-la-plateforme", num: "3", text: "PURPOSE OF THE PLATFORM" },
                {
                    t: "ul", items: [
                        "Publish listings for sale, purchase, rental or exchange",
                        "Browse other users’ listings",
                        "Contact advertisers via internal messaging"
                    ]
                },
                { t: "p", text: "The Platform acts solely as a technical intermediary. RENOVIO DIGITAL LLC does not participate in transactions and is not a party to contracts concluded between users." },

                { t: "h2", id: "s4-acces-a-la-plateforme", num: "4", text: "ACCESS TO THE PLATFORM" },
                {
                    t: "ul", items: [
                        "Via the website: www.goodplansmaroc.ma (to be confirmed)",
                        "Via iOS / Android mobile applications"
                    ]
                },
                { t: "p", text: "Access to the Platform is free. Additional paid services may be offered (featured listings…), with pricing displayed before subscription." },

                { t: "h2", id: "s5-propriete-intellectuelle", num: "5", text: "INTELLECTUAL PROPERTY" },
                { t: "h3", text: "5.1. Platform Rights" },
                { t: "p", text: "All elements present on the Platform are the exclusive property of RENOVIO DIGITAL LLC or its licensors and are protected by applicable laws (United States, Morocco and international)." },
                {
                    t: "ul", items: [
                        "General structure",
                        "Texts, images, graphics, logos and icons",
                        "Databases",
                        "Software and code",
                        "Trademarks, trade names and domain names"
                    ]
                },
                { t: "h3", text: "5.2. Authorized Use" },
                { t: "p", text: "Any reproduction, modification or adaptation is prohibited without prior written authorization. Authorized use is strictly personal and non-commercial." },
                { t: "h3", text: "5.3. User Content" },
                { t: "p", text: "Users retain their rights over their content but grant RENOVIO DIGITAL LLC a worldwide, non-exclusive, royalty-free and transferable license to use such content within the service framework." },

                { t: "h2", id: "s6-protection-des-donnees-personnelles", num: "6", text: "PERSONAL DATA PROTECTION" },
                { t: "p", text: "Personal data is processed in accordance with Moroccan Law No. 09-08 and our Privacy Policy." },
                { t: "p", text: "Data controller: RENOVIO DIGITAL LLC" },
                { t: "p", text: "Contact: contact@goodplansmaroc.ma" },
                { t: "p", text: "Rights: access, rectification, objection, deletion (via contact)." },

                { t: "h2", id: "s7-cookies", num: "7", text: "COOKIES" },
                { t: "p", text: "Cookies may be used to improve user experience and analyze usage. Details and management: Privacy Policy. Refusal may limit certain functionalities." },

                { t: "h2", id: "s8-responsabilite", num: "8", text: "LIABILITY" },
                { t: "h3", text: "8.1. User Published Content" },
                { t: "p", text: "RENOVIO DIGITAL LLC acts as a hosting provider. Content will be removed promptly if manifestly illegal and brought to our attention." },
                { t: "h3", text: "8.2. Transactions Between Users" },
                { t: "p", text: "The Platform does not intervene in transactions. RENOVIO DIGITAL LLC is not responsible for disputes (non-conformity, non-payment, fraud, etc.)." },
                { t: "h3", text: "8.3. Platform Availability" },
                { t: "p", text: "We aim for 24/7 accessibility without guaranteeing uninterrupted access (maintenance, outages, force majeure)." },

                { t: "h2", id: "s9-signalement-de-contenu-illicite", num: "9", text: "REPORTING ILLEGAL CONTENT" },
                { t: "p", text: "Report via the dedicated function on each listing or by email: contact@goodplansmaroc.ma." },
                {
                    t: "ul", items: [
                        "Link to the listing",
                        "Reason for reporting",
                        "Reporter’s contact details"
                    ]
                },

                { t: "h2", id: "s10-liens-hypertextes", num: "10", text: "HYPERLINKS" },
                { t: "p", text: "The Platform may contain links to third-party sites. We have no control over their content or availability. Any link to the Platform must be authorized. Deep linking is prohibited without authorization." },

                { t: "h2", id: "s11-droit-applicable-et-juridiction-competente", num: "11", text: "GOVERNING LAW AND JURISDICTION" },
                { t: "p", text: "These legal notices are governed by Moroccan law. Moroccan courts have exclusive jurisdiction in case of dispute." },

                { t: "h2", id: "s12-modification-des-mentions-legales", num: "12", text: "MODIFICATION OF LEGAL NOTICE" },
                { t: "p", text: "RENOVIO DIGITAL LLC may modify this legal notice at any time. It becomes effective upon publication." },

                { t: "h2", id: "s13-contact", num: "13", text: "CONTACT" },
                { t: "p", text: "Email: contact@goodplansmaroc.ma" },
                { t: "p", text: "Mail: RENOVIO DIGITAL LLC, 8206 Louisiana Blvd NE, Ste A #7595, Albuquerque, New Mexico 87113, United States" }
            ]
        },

        // ************************************* Advertising page ****************************************
        advertisingRequest: {
            title: "Advertising quote request",
            subtitle:
                "Boost your company’s visibility on GoodPlans. Fill out the form below and receive a personalized proposal.",

            form: {
                companyName: "Company name",
                contactName: "Full name",
                duration: "Desired duration",
                placeholderDuration: "Ex: 1 week, 1 month...",

                ChooseArea: "Select an area",
                TopOfPage: "Top of page",
                carousel: "Carousel",
                searchBannerPage: "Search page banner",

                submit: "Send request",
                loading: "Sending...",
            },

            footerInfo: "We generally respond within 48 business hours.",


            toast: {
                success: "Your request has been successfully sent.",
                error: "An error occurred. Please try again.",
            },
        },

        // ******************************** Profile Page *************************************
        profile: {
            sellerApproved: "Approved Seller",
            sellerNotApproved: "Pending Approval",
            fromCreateListing: "Complete your seller profile to post a listing",
            sellerCalloutMessagePending: "Your seller account is pending approval. Once it has been validated by an administrator, you will be able to publish your listings.",
            notSellerCalloutMessage: "To publish your first listing, activate seller mode below and complete the required information.",

            form: {
                title: "Personal Information",
                saving: "Processing...",
                inputUserName: "Username",
            },

            sellerMode: {
                title: "Seller Mode",
                subtitle: "I want to sell items",
                text: "Enable this option to sell your items",
                submitButton: "Enable Seller Mode",
                sellerType: "Seller Type",
                sellerParticular: "Individual",
                sellerParticularText: "For occasional sales",
                sellerProfessional: "Professional",
                sellerProfessionalText: "For businesses",
                companyName: "Company name*",
                placeholderCompanyName: "Your company",
                phoneNeedsCountryHint: "Some older accounts have numbers without area codes (e.g., without <b>+212</b>). Select your country from the list, check the number, then click <b>Save</b>.",
                phoneInput: "Phone",
                normalizePhone: "The area code alone is not a number. Add the full number.",
                whatsAppInput: "WhatsApp",
                siretInput: "SIRET number*",
                placeholderSiret: "SIRET",
            },

            actions: {
                notSave: "Cancel",
                save: "Save",
                loading: "Processing...",
            },

            restrictedArea: {
                title: "Sensitive Area",
                subtitle: "Deleting your account will erase all your data and require you to log in again.",
                deleteAccountMessage: "Delete my account",
            },

            toast: {
                errorLoadProfile: "Profile loading failed",
                initialSellerLocked: "A seller account cannot revert to buyer status.",
                selleRequiredPhone: "A valid phone number is required for sellers(not just the area code).",
                requiredCompanyName: "Company name is required for professionals.",
                requiredSiret: "SIRET number is required for professionals.",
                maxFileSize: "Maximum size is 5 MB.",
                fileType: "Allowed formats: JPEG, PNG, GIF.",
                uploadAvatarSuccess: "Avatar updated",
                uploadAvatarError: "Error uploading avatar",
                notNullPhone: "You cannot save an empty phone number. Enter a valid number (or contact support if you want to delete it).",
                onlyCountryCode: "Invalid phone number: the country code alone is not a valid number.Enter your full number.",
                incompletePhone: "Invalid phone number: select a country and enter your full number.",
                notNullWhatsapp: "You cannot register an empty WhatsApp if you already had one.Enter a valid number.",
                onlyCountryCodeWhatsapp: "Invalid WhatsApp: the code alone is not a number.Add your full number.",
                incompleteWhatsappPhone: "Invalid WhatsApp: select a country and enter your full phone number.",
                success: "Profile successfully updated",
                error: "Error updating profile",
                confirmationDeleteAccount: "Are you sure you want to delete your account?",
                successDelete: "Account deleted",
                errorDelete: "Error deleting account"
            },

            globalLoader: "Loading profile...",
        },

        // ******************************* Favorites page *************************************
        favorite: {
            notConnected: {
                title: "Log in to see your favorites",
                subtitle: "By logging in, you will be able to find all the ads you have added to your favorites.",
                redirectLogin: "Log in",
            },

            globalLoader: "Loading your favorites...",

            error: {
                title: "Oops, there was a problem",
                reloadButton: "Try again",
            },

            title: "My favorites",
            subtitle: "Find all the ads you've saved for later here.",
            favoriteLength: "Total",
            favoriteNull: "You don't have any favorites yet",
            subtitleFavoriteNull: "Explore the great deals on GoodPlans.ma and click on the little heart to save the ads that interest you.",
            redirectHome: "Discover ads",

            toast: {
                error: "Unable to load your favorites.",
            }
        },

        // ****************************** Page Not Found **********************************
        notFound: {
            illustration: "404",
            title: "Page not found",
            subtitle: "The page you are looking for does not exist or has been moved.",
            redirectHome: "Back to home page",
            help: "Need help finding what you're looking for?",
            redirectContact: "Contact us",
        },

        // ****************************** OTP verification page *********************************
        verifyOtp: {
            title: "Verifying your account",
            sendEmailMessage: "A 6-digit code has been sent to ",
            subtitle: "Please enter it below to activate your account.",
            sending: "Verifying...",
            submitButton: "Validate code",
            info: " If you can't find the email, check your spam folder.",

            invalidEmail: {
                title: "Invalid link",
                subtitle: "The email is missing.Please restart your registration.",
                redirectRegister: "Back to registration",
            },

            toast: {
                notEmail: "Email missing. Please return to the registration link.",
                invalidOtp: "Please enter the 6 digits of the OTP code.",
                success: "Your account has been successfully verified 🎉",
                error: "Invalid or expired code.Please try again.",
            }

        },

        // ****************************** Verification code reset page *********************
        resetVerifyCode: {

            invalidEmail: {
                title: "Invalid link",
                subtitle: "The email is missing. Please start the procedure again.",
            },

            title: "Code verification",
            sendEmailMessage: "A 6-digit code has been sent to",
            infoText: "You can paste the code directly",
            sending: "Verifying...",
            submitButton: "Validate code",
            resending: "Sending...",
            resendButton: "Resend code",
            redirectLogin: "Back to login",
            expirationTimer: "⏱ The code expires in 10 minutes",

            toast: {
                notEmail: "Email missing. Please try again.",
                success: "A new code has been sent to your email ✅",
                errorResendCode: "Unable to resend the code. Please try again.",
                invalidCode: "Please enter the 6 digits of the code.",
                verifyCode: "Code verified ✅",
                errorVerifyCode: "Invalid or expired code. Please try again.",
            }
        },

        // ****************************** Password reset page **************************************
        resetPassword: {
            title: "New Password",
            subtitle: "Choose a new secure password for your account.",
            redirectLogin: "Back to Login",

            form: {
                inputNewPwd: "New password",
                placeholderNewPwd: "Minimum 8 characters",
                requiredPwd: "Password required",
                minLength: "The password must contain at least 8 characters.",
                pattern: "Must contain an uppercase letter, a lowercase letter, and a number.",
                inputConfirmPwd: "Confirm password",
                placeholderconfirmPwd: "Confirm your password",
                requiredConfirmPwd: "Confirmation required",
                validatePwd: "The two passwords do not match.",
                VeryStrongPwd: "Very strong password",
                strongPwd: " ✓ Strong password",
                meanPwd: "⚠ Medium password",
                lowPwd: "Weak password",
                submitting: "Resetting...",
                submitButton: "Save new password",
            },

            toast: {
                notEmailOrCode: "Invalid link. Please try again.",
                notConfirmPwd: "The two passwords do not match.",
                errParamPwd: "The password must contain at least 8 characters.",
                success: "Password successfully reset ✅",
                error: "Unable to reset the password."
            }
        },

        // ******************************* Conversation list **************************************
        conversationList: {

            notConnected: {
                title: "Log in to see your conversations",
            },

            title: "My conversations",
            placeholderSearch: "Search by name, announcement...",
            errorLoading: "Unable to load conversations.",
            refreshButton: "Try again",
            notConversations: "No conversations found",
            nullConversations: "You don't have any conversations at the moment.",
            resetButton: "Clear search",
            newMessageButton: "New message",

        },

        // ******************************* Chat interface ***************************************
        chatWindow: {

            notExistingListing: {
                title: "Select a conversation from the list or use the button below ",
                contactSeller: "Contact the seller",
                from: "from a listing.",
            },

            error: {
                errorMsg: "Unable to load conversation",
                notFound: "Conversation not found",
                refreshButton: "Try again",
            },

            title: "Start a conversation about this listing.",
        },

        // ******************************* Settings Page ***************************************
        settings: {
            title: "Settings",

            tabs: {
                account: "Account",
                notifications: "Notifications",
                security: "Security",
            },

            alerts: {
                loadError: "Unable to load your settings",
                preferencesUpdated: "Preferences updated",
                preferencesSaveError: "Error while saving preferences",
                accountUpdated: "Account updated",
                accountUpdateError: "Error while updating account",
                deleteError: "Unable to delete account",
                deleteConfirm: "Are you sure you want to delete your account?",
                passwordFieldsRequired: "Please fill in all password fields",
                passwordMismatch: "Passwords do not match",
                passwordInvalid: "Password must contain 8 characters, one uppercase letter, one lowercase letter and one number",
                passwordUpdated: "Password updated. Please log in again.",
                passwordChangeError: "Unable to change password",
            },

            account: {
                title: "Account",
                email: "Email",
                emailHelp: "To change your email address, please contact support.",
                username: "Username",
                accountType: "Account type",
                accountTypeHelp: "Account type changes must be requested via support.",
                phone: "Phone",
                whatsapp: "WhatsApp",
                phoneHelper: "Visible to buyers if you allow it",
                whatsappHelper: "Allows buyers to contact you quickly",
                company: "Company",
                companyHelper: "Optional for individuals, required for some professional accounts.",
                logout: "Log out",
                save: "Save",
                deleting: "Deleting...",
                deleteAccount: "Delete my account",
            },

            notifications: {
                title: "Notifications",
                emailTitle: "Email",
                emailDesc: "Receive important updates by email.",
                pushTitle: "Push notifications",
                pushDesc: "Instant alerts about your listing activity.",
                save: "Save",
            },

            security: {
                title: "Security",
                oldPassword: "Current password",
                newPassword: "New password",
                confirmPassword: "Confirmation",
                passwordHelper: "At least 8 characters, one uppercase, one lowercase and one number.",
                update: "Update",
            },

            sellerProfile: {
                title: "Seller profile",
                sellerType: "Seller type",
                notProvided: "Not provided",
            },

            misc: {
                na: "N/A",
                unknownSeller: "Unknown seller",
            },
        },

        // ******************************* Edit listings Page ***************************************
        editListing: {
            errors: {
                loadError: "Unable to load this listing",
                unsupportedCategory: "Category not supported for editing",
                updateError: "Error while updating listing",
                validationFix: "Please fix the errors",
                notFound: "Listing not found or unauthorized.",
            },

            success: {
                updated: "Listing successfully updated",
            },

            navigation: {
                backToListings: "Back to my listings",
            },

            header: {
                title: "Edit listing",
                category: "Category",
            },

            sections: {
                generalInfo: "General information",
                specificDetails: "Specific details",
                images: "Images",
            },

            fields: {
                title: "Title",
                description: "Description",
                price: "Price",
                city: "City",
                region: "Region",
            },

            validation: {
                titleRequired: "Title is required",
                descriptionRequired: "Description is required",
                invalidPrice: "Invalid price",
            },

            images: {
                none: "No images registered for this listing.",
                delete: "Delete",
                addNew: "Add new images",
                selectedCount: "{count} new image(s) selected",
            },

            buttons: {
                cancel: "Cancel",
                save: "Save",
                saving: "Saving...",
            },
        },

        // ******************************* Create Listings Page ***************************************
        createListing: {
            guard: {
                checking: "Checking your publishing permissions...",
                pendingApproval:
                    "Your seller account is pending approval before you can publish a listing.",
                notSeller:
                    "To publish a listing, you must first activate seller mode in your profile.",
                statusCheckFailed:
                    "Unable to verify your seller status at the moment.",
            },

            wizard: {
                title: "Create listing",
                preview: "Preview",
                stepsTitle: "Creation steps",
            },

            steps: {
                category: "Category",
                generalInfo: "Info",
                specificDetails: "Details",
                pricing: "Pricing",
                images: "Photos",
                submission: "Review",
            },

            validation: {
                requiredFields:
                    "Please complete required fields before continuing.",
                missingFields: "Some required fields are missing.",
            },

            images: {
                maxReached: "You have already reached the maximum of 10 images.",
                uploadSuccess: "Images successfully uploaded.",
                uploadError:
                    "Error uploading images. Please try again.",
                noUrlReturned:
                    "No image URL returned by the server.",
            },

            success: {
                created: "Your listing has been successfully created!",
            },

            errors: {
                creationFailed:
                    "An error occurred while creating the listing.",
            },

            inappropriate: {
                title: "Potentially inappropriate content detected",
                description:
                    "Please review the title and description of your listing.",
            },

            generalInfo: {
                infoNote:
                    "Provide accurate information to attract more potential buyers.",

                fields: {
                    title: "Title",
                    titlePlaceholder: "Title of your listing",

                    description: "Description",
                    descriptionPlaceholder:
                        "Detailed description of your listing",

                    locationTitle: "Location",

                    city: "City",
                    citySelect: "Select a city",

                    region: "Region",
                    regionSelect: "Select a region",

                    loading: "Loading...",
                },
            },

            specificDetails: {
                title: "Listing details",

                selectCategoryFirst: "Select a category",

                loading: "Loading...",
                loadingRealEstate: "Loading property types...",
                loadingServices: "Loading service types...",
                loadingCraft: "Loading craft types...",
                loadingBrands: "Loading brands...",
                loadingModels: "Loading models...",

                realEstate: {
                    sectionTitle: "Property",
                    propertyType: "Property type",
                    propertyTypePlaceholder: "Apartment, house, office…",
                    surface: "Surface (m²)",
                    surfacePlaceholder: "Ex: 120",
                    rooms: "Rooms",
                    bedrooms: "Bedrooms",
                    bathrooms: "Bathrooms",
                    garden: "Garden",
                    pool: "Pool",
                    garage: "Garage",
                },

                vehicle: {
                    sectionTitle: "Vehicle",
                    brand: "Brand",
                    brandSelect: "Select a brand",
                    model: "Model",
                    modelSelect: "Select a model",
                    selectBrandFirst: "Select a brand first.",
                    year: "Year",
                    yearPlaceholder: "Ex: 2018",
                    mileage: "Mileage (km)",
                    mileagePlaceholder: "Ex: 120000",
                },

                service: {
                    sectionTitle: "Service",
                    serviceType: "Service type",
                    servicePlaceholder: "Plumbing, hairdressing, cleaning…",
                    experienceLevel: "Experience level",
                    experiencePlaceholder: "Beginner / Intermediate / Expert",
                    homeService: "Home service available",
                },

                craft: {
                    sectionTitle: "Craft",
                    craftType: "Craft type",
                    craftPlaceholder: "Sculpture, weaving, pottery…",
                    origin: "Origin",
                    originPlaceholder: "Ex: Cameroon, Morocco…",
                    material: "Material",
                    materialPlaceholder: "Wood, leather, metal…",
                    handmade: "Handmade",
                    authentic: "Authentic",
                    vintage: "Vintage / antique",
                    dimensions: "Dimensions (optional)",
                    dimensionsPlaceholder: "Ex: 120x60x75 cm",
                },
            },

            categoryStep: {
                loading: "Loading categories…",
                error:
                    "Unable to load categories. Please check the /categories API.",

                warning:
                    "Please create a separate listing for each property or service.",

                categoryLabel: "Category",
                selectCategoryError: "Please select a category.",

                transactionLabel: "Transaction type",
                transactionSale: "Buy / Sell",
                transactionRent: "Rent",
                selectTransactionError:
                    "Please select a transaction type.",
            },



        }

    },



}
