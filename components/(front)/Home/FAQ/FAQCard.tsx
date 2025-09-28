"use client";
import React, { useState } from "react";
import { HomeFAQ } from "@/lib/types/pages/homeTypes";
import { IoChevronDown, IoChevronUp, IoHelpCircleOutline } from "react-icons/io5";

interface FAQCardProps {
  faq: HomeFAQ;
}

export default function FAQCard({ faq }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:-translate-y-1 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          aria-expanded={isOpen}
          aria-controls={`faq-${faq.id}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <IoHelpCircleOutline className="text-lg text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
              {faq.name}
            </h3>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isOpen ? (
              <IoChevronUp className="w-6 h-6 text-purple-600 transition-transform duration-200" />
            ) : (
              <IoChevronDown className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors duration-200" />
            )}
          </div>
        </button>
        
        <div
          id={`faq-${faq.id}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6">
            <div className="pl-14">
              <p className="text-gray-700 leading-relaxed text-base">
                {faq.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
