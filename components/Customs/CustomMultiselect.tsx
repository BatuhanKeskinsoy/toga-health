"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import CustomCheckbox from "./CustomCheckbox";
import CustomButton from "./CustomButton";

interface Option {
  id: number;
  name: string;
  value: string;
  [key: string]: any;
}

interface CustomMultiselectProps {
  id: string;
  name: string;
  label: string;
  value: string[];
  options: Option[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const CustomMultiselect: React.FC<CustomMultiselectProps> = ({
  id,
  name,
  label,
  value = [],
  options,
  onChange,
  placeholder = "Seçiniz",
  required = false,
  disabled = false,
  loading = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const inputId = useMemo(() => id || name, [id, name]);
  const isFloating = useMemo(() => value.length > 0, [value]);

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

  // Dropdown açıldığında arama input'una focus ol
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = useMemo(() => {
    return options.filter((option) => value.includes(option.value));
  }, [options, value]);

  const handleToggle = (optionValue: string) => {
    if (disabled || loading) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
  };

  const handleRemove = useCallback(
    (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== optionValue));
    },
    [value, onChange]
  );

  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
  );

  const handleToggleDropdown = useCallback(() => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  }, [disabled, loading, isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8] w-full">
        <label
          htmlFor={inputId}
          className="relative w-full bg-zinc-100 rounded-sm cursor-pointer"
          onClick={handleToggleDropdown}
        >
          <div className="w-full outline-none pt-2 px-2 peer bg-[#f9fafb] flex items-center text-xs gap-2 flex-wrap">
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 w-full">
                {selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-sitePrimary/10 text-sitePrimary rounded-md text-[10px]"
                  >
                    <span>{option.name}</span>
                    <CustomButton
                      btnType="button"
                      handleClick={(e) => handleRemove(option.value, e)}
                      containerStyles="hover:bg-sitePrimary/20 rounded-full p-0.5 transition-colors"
                      aria-label="Kaldır"
                      leftIcon={<AiOutlineClose className="text-[10px]" />}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-transparent">{placeholder}</span>
            )}
          </div>

          <span
            className={`absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 cursor-text text-[#9da4ae] text-sm transition-all
              peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:top-0.5 w-[calc(100%+30px)]
              ${
                isFloating
                  ? `text-[10px] !text-[#4d5761] !-top-1 ltr:!-left-0 rtl:!-right-0`
                  : ""
              }`}
          >
            <div className="flex justify-between items-center gap-2 w-full cursor-pointer">
              <span className="pointer-events-none select-none px-1.5 bg-[#f9fafb]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-white transition-colors text-xs"
                  aria-label="Tümünü temizle"
                  title="Tümünü temizle"
                >
                  <AiOutlineClose />
                </button>
              )}
            </div>
          </span>
        </label>

        <IoChevronDownOutline
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
          <div className="relative border-b border-gray-200 h-12 w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full focus:outline-none focus:bg-gray-100 text-sm h-full px-4 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-0 top-0 h-full text-left px-4 py-2 text-sm bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <AiOutlineClose className="text-base" />
              </button>
            )}
          </div>

          <div className="max-h-40 lg:max-h-44 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Sonuç bulunamadı
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className={`
                      w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 border-b last:border-b-0 transition-colors flex items-center gap-2
                      ${
                        isSelected
                          ? "bg-sitePrimary/10 text-sitePrimary border-sitePrimary/20"
                          : "text-gray-900 border-gray-200"
                      }
                    `}
                  >
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        id={`${inputId}-${option.id}`}
                        label=""
                        checked={isSelected}
                        onChange={() => handleToggle(option.value)}
                        size="sm"
                      />
                    </div>
                    <span>{option.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiselect;

