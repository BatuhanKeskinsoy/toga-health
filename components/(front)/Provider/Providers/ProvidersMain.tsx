import React from 'react';

interface ProvidersMainProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
}

function ProvidersMain({ diseaseSlug, country, city, district, locale = "tr" }: ProvidersMainProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Provider listesi burada render edilecek */}
      <div className="text-center text-gray-500 py-8">
        {diseaseSlug ? `${diseaseSlug} için sağlayıcılar` : 'Sağlayıcılar'}
        {country && ` - ${country}`}
        {city && ` - ${city}`}
        {district && ` - ${district}`}
      </div>
    </div>
  );
}

export default ProvidersMain;