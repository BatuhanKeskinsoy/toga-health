"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { IoChevronDownOutline } from "react-icons/io5";

interface Option {
  id: number;
  name: string;
  code?: string;
  countryId?: number;
  [key: string]: any;
}

interface CustomSelectProps {
  id: string;
  name: string;
  label: string;
  value: Option | null;
  options: Option[];
  onChange: (option: Option | null) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder = "Seçiniz",
  required = false,
  disabled = false,
  loading = false,
  icon,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputId = useMemo(() => id || name, [id, name]);
  const isFloating = useMemo(() => value !== null, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = useCallback(
    (option: Option) => {
      onChange(option);
      setIsOpen(false);
      setSearchTerm("");
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange(null);
    setSearchTerm("");
  }, [onChange]);

  const handleToggle = useCallback(() => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  }, [disabled, loading, isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8] w-full">
        {icon && <span className="text-2xl min-w-6 text-gray-400">{icon}</span>}

        <label
          htmlFor={inputId}
          className="relative w-full bg-zinc-100 rounded-sm cursor-pointer"
          onClick={handleToggle}
        >
          <div className="w-full outline-none pt-[8px] pb-[4px] px-2 peer bg-[#f9fafb] min-h-[24px] flex items-center">
            <span className={value ? "text-gray-900" : "text-transparent"}>
              {value ? value.name : placeholder}
            </span>
          </div>

          <span
            className={`absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 cursor-text text-[#9da4ae] text-sm transition-all
              peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:top-0.5 w-[calc(100%+30px)]
              ${
                isFloating
                  ? "text-[10px] !text-[#4d5761] !-top-2 ltr:!-left-6 rtl:!-right-6"
                  : ""
              }`}
          >
            <div className="flex justify-between items-center gap-2 w-full">
              <span className="pointer-events-none select-none px-1.5 bg-[#f9fafb]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </div>
          </span>
        </label>

        <IoChevronDownOutline
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sitePrimary focus:border-sitePrimary"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Sonuç bulunamadı
              </div>
            ) : (
              <>
                {value && (
                  <button
                    onClick={() => handleClear()}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Seçimi Temizle
                  </button>
                )}
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left px-3 py-2 text-sm hover:bg-gray-100
                      ${
                        value?.id === option.id
                          ? "bg-sitePrimary text-white hover:bg-sitePrimary"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {option.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
