// src/pages/seller/SellerHelp.tsx

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

export default function SellerHelp() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Comment créer une annonce ?",
      answer:
        'Pour créer une annonce, cliquez sur le bouton "Déposer une annonce" dans la barre de navigation ou dans votre tableau de bord vendeur. Suivez ensuite les étapes pour ajouter les détails, les photos et le prix de votre article.',
    },
    {
      question: "Comment répondre aux messages des acheteurs ?",
      answer:
        'Vous pouvez accéder à tous vos messages dans la section "Messages" de votre tableau de bord vendeur. Cliquez sur une conversation pour voir les messages et y répondre.',
    },
    {
      question: "Comment sont gérés les paiements ?",
      answer:
        "Les paiements sont sécurisés via notre système. Lorsqu’un acheteur effectue un achat, le montant est mis en attente jusqu’à la confirmation de la réception de l’article. Vous recevez ensuite le paiement sur votre compte associé.",
    },
    {
      question: "Quels sont les frais pour les vendeurs ?",
      answer:
        "Goodplans prélève une commission de 5% sur chaque vente réussie. Il n’y a pas de frais pour publier une annonce ou communiquer avec les acheteurs.",
    },
    {
      question: "Comment promouvoir mes annonces ?",
      answer:
        "Ajoutez des photos de qualité, des descriptions détaillées et répondez rapidement aux messages. Des options de promotion premium seront bientôt disponibles.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          <HelpCircle className="inline-block h-5 w-5 mr-2 text-primary" />
          Questions fréquentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Besoin d’aide ?
        </h2>
        <p className="text-gray-600 mb-6">
          Notre équipe support est là pour vous aider en cas de question sur
          vos annonces, vos ventes ou votre compte vendeur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email */}
          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <Mail className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Par e-mail</h3>
            <p className="text-gray-600 text-sm">support@goodplans.ma</p>
            <p className="text-gray-500 text-xs mt-2">
              Réponse sous 24 à 48h (jours ouvrables).
            </p>
          </div>

          {/* Téléphone */}
          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Par téléphone</h3>
            <p className="text-gray-600 text-sm">+212 6 00 00 00 00</p>
            <p className="text-gray-500 text-xs mt-2">
              Du lundi au vendredi, 9h – 18h.
            </p>
          </div>

          {/* Chat */}
          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Chat en ligne</h3>
            <p className="text-gray-600 text-sm">
              Discutez avec un conseiller quand le chat est disponible.
            </p>
            <button className="mt-2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
              Ouvrir le chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
