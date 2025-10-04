"use client";
import React from "react";
import CustomSelect from "@/components/others/CustomSelect";
import CustomButton from "@/components/others/CustomButton";
import { MdLanguage, MdAdd, MdClose } from "react-icons/md";

interface LanguagesSectionProps {
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

const AVAILABLE_LANGUAGES = [
  { id: 1, name: "Türkçe", value: "turkish" },
  { id: 2, name: "İngilizce", value: "english" },
  { id: 3, name: "Almanca", value: "german" },
  { id: 4, name: "Fransızca", value: "french" },
  { id: 5, name: "Arapça", value: "arabic" },
  { id: 6, name: "Rusça", value: "russian" },
  { id: 7, name: "İspanyolca", value: "spanish" },
  { id: 8, name: "İtalyanca", value: "italian" },
  { id: 9, name: "Japonca", value: "japanese" },
  { id: 10, name: "Korece", value: "korean" },
  { id: 11, name: "Çince", value: "chinese" },
  { id: 12, name: "Farsça", value: "farsi" },
  { id: 13, name: "Hintçe", value: "hindi" },
  { id: 14, name: "Portekizce", value: "portuguese" },
  { id: 15, name: "İbranice", value: "hebrew" },
];

export default function LanguagesSection({ languages, onLanguagesChange }: LanguagesSectionProps) {
  const availableLanguages = AVAILABLE_LANGUAGES.filter(
    lang => !languages.includes(lang.value)
  );

  const addLanguage = (selectedLanguage: { id: number; name: string; value: string } | null) => {
    if (selectedLanguage && !languages.includes(selectedLanguage.value)) {
      onLanguagesChange([...languages, selectedLanguage.value]);
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    onLanguagesChange(languages.filter(lang => lang !== languageToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MdLanguage className="text-sitePrimary text-xl" />
        <h4 className="text-lg font-semibold text-gray-900">Konuşulan Diller</h4>
      </div>
      
      {/* Seçili Diller */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {languages.map((language, index) => (
            <div
              key={index}
              className="bg-sitePrimary/10 text-sitePrimary px-3 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
            >
              <span>{language}</span>
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="hover:bg-sitePrimary/20 rounded-full p-1 transition-colors"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Dil Ekleme */}
      {availableLanguages.length > 0 && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <CustomSelect
              id="language-select"
              name="language-select"
              label="Dil Ekle"
              value={null}
              options={availableLanguages}
              onChange={addLanguage}
              placeholder="Dil seçiniz"
            />
          </div>
        </div>
      )}
      {languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MdLanguage className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600">Henüz dil eklenmemiş</p>
          <p className="text-sm text-gray-500">Konuştuğunuz dilleri ekleyin</p>
        </div>
      )}
    </div>
  );
}
