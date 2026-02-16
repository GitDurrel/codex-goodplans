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
import { useLanguage } from "../../lib/language/LanguageContext";

export default function SellerHelp() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: t("seller.help.faq.createListing.question"),
      answer: t("seller.help.faq.createListing.answer"),
    },
    {
      question: t("seller.help.faq.replyMessages.question"),
      answer: t("seller.help.faq.replyMessages.answer"),
    },
    {
      question: t("seller.help.faq.payments.question"),
      answer: t("seller.help.faq.payments.answer"),
    },
    {
      question: t("seller.help.faq.fees.question"),
      answer: t("seller.help.faq.fees.answer"),
    },
    {
      question: t("seller.help.faq.promote.question"),
      answer: t("seller.help.faq.promote.answer"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          <HelpCircle className="inline-block h-5 w-5 mr-2 text-primary" />
          {t("seller.help.title")}
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t("seller.help.contact.title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("seller.help.contact.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <Mail className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">{t("seller.help.contact.emailTitle")}</h3>
            <p className="text-gray-600 text-sm">support@goodplans.ma</p>
            <p className="text-gray-500 text-xs mt-2">
              {t("seller.help.contact.emailDelay")}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">{t("seller.help.contact.phoneTitle")}</h3>
            <p className="text-gray-600 text-sm">+212 6 00 00 00 00</p>
            <p className="text-gray-500 text-xs mt-2">
              {t("seller.help.contact.phoneHours")}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg flex flex-col items-center text-center">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">{t("seller.help.contact.chatTitle")}</h3>
            <p className="text-gray-600 text-sm">
              {t("seller.help.contact.chatDescription")}
            </p>
            <button className="mt-2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
              {t("seller.help.contact.openChat")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
