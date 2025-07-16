"use client";
import React from "react";

interface SearchCategory {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface SearchCategoriesProps {
  onCategorySelect?: (category: SearchCategory) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({ onCategorySelect }) => {
  const categories: SearchCategory[] = [
    {
      id: "specialist",
      title: "Uzman Arama",
      description: "Doktor, uzman ve sağlık personeli ara"
    },
    {
      id: "branch",
      title: "Branş Arama", 
      description: "Tıbbi branşlar ve uzmanlık alanları"
    },
    {
      id: "disease",
      title: "Hastalık Arama",
      description: "Hastalık ve sağlık durumları"
    },
    {
      id: "institution",
      title: "Kurum Arama",
      description: "Hastane, klinik ve sağlık kurumları"
    }
  ];

  const handleCategoryClick = (category: SearchCategory) => {
    onCategorySelect?.(category);
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Arama Sonuçları</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="font-medium text-gray-900">{category.title}</div>
            <div className="text-sm text-gray-600">{category.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchCategories; 