import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import React from "react";
import { IoFlaskOutline } from "react-icons/io5";
import AlphabetNavigation from "./AlphabetNavigation";

export interface ListCategoriesProps {
  data: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
  title: string;
  description: string;
  seeMoreLabel: string;
  locale: string;
  categoryType: "diseases" | "branches" | "treatments-services";
}

const ListCategories: React.FC<ListCategoriesProps> = ({ data, title, description, seeMoreLabel, locale, categoryType }) => {
  const groupedCategories = React.useMemo(() => {
    const groups: { [key: string]: typeof data } = {};
    data.forEach((category) => {
      const firstLetter = category.title.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(category);
    });
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.title.localeCompare(b.title, "tr"));
    });
    return groups;
  }, [data]);

  const alphabet = React.useMemo(() => "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("") , []);
  const colCount = 4;
  const lettersPerCol = Math.ceil(alphabet.length / colCount);
  const alphabetColumns = React.useMemo(() =>
    Array.from({ length: colCount }, (_, i) =>
      alphabet.slice(i * lettersPerCol, (i + 1) * lettersPerCol)
    ), [alphabet, colCount, lettersPerCol]);

  return (
    <>
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
        <div className="container mx-auto px-4 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800 ">{title}</h2>
          <p className="text-gray-600 ">{description}</p>

          {/* Alfabe navigasyonu */}
          <AlphabetNavigation alphabet={alphabet} groupedDiseases={groupedCategories} />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
        {/* Kategori Grupları */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {alphabetColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-8">
              {col.map((letter) => {
                const categoriesInLetter = groupedCategories[letter];
                if (!categoriesInLetter || categoriesInLetter.length === 0)
                  return null;

                return (
                  <div
                    key={letter}
                    id={`letter-${letter}`}
                    className="scroll-mt-20 "
                  >
                    <div className="bg-white rounded-lg shadow-sm relative">
                      {/* Harf Başlığı */}
                      <div className="flex items-center select-none justify-center absolute lg:-top-6 lg:-left-6 -top-3 -left-2 bg-gradient-to-r from-sitePrimary to-sitePrimary/80 lg:size-14 size-10 rounded-full">
                        <h3 className="text-2xl font-bold text-white">
                          {letter}
                        </h3>
                      </div>

                      {/* Kategori Listesi */}
                      <div className="flex flex-col gap-4 p-4 pt-10">
                        {categoriesInLetter.map((category) => (
                          <Link
                            key={category.id}
                            href={getLocalizedUrl(
                              `/${categoryType}/[slug]`,
                              locale,
                              category.slug
                            )}
                            className="group cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-sitePrimary/30 hover:bg-gradient-to-r hover:from-sitePrimary/5 hover:to-transparent transition-all duration-300"
                          >
                            <div className="flex items-center space-x-3">
                              <IoFlaskOutline className="text-xl text-gray-500" />
                              <div>
                                <h4 className="font-medium text-gray-800 group-hover:text-sitePrimary transition-colors duration-300">
                                  {category.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {seeMoreLabel}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListCategories;
