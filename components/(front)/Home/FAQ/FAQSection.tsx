import React from "react";
import { HomeFAQ } from "@/lib/types/pages/homeTypes";
import FAQCard from "./FAQCard";
import { getTranslations } from "next-intl/server";

interface FAQSectionProps {
  faqs: HomeFAQ[];
  locale: string;
}

export default async function FAQSection({ faqs, locale }: FAQSectionProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="text-center mb-12">
        <h2
          id="faq-heading"
          className="text-2xl xl:text-3xl font-bold text-gray-900 mb-4"
        >
          {t("Sıkça Sorulan Sorular")}
        </h2>
        <p className="text-base xl:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          {t("Platform hakkında merak ettiğiniz soruların cevapları")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <FAQCard key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
}
