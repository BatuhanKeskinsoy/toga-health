import React from "react";
import { HomeFAQ } from "@/lib/types/pages/homeTypes";
import FAQCard from "./FAQCard";

interface FAQSectionProps {
  faqs: HomeFAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <div className="container p-4 mx-auto">
      <div className="text-center mb-12">
        <h2
          id="faq-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
        >
          Sıkça Sorulan Sorular
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Platform hakkında merak ettiğiniz soruların cevapları
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <FAQCard key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
}
