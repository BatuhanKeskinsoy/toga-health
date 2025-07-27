import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProvidersSidebar";

interface DiseasesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string; country?: string; city?: string; district?: string }>;
}

export default async function DiseasesLayout({
  children,
  params,
}: DiseasesLayoutProps) {
  const { slug, country, city, district } = await params;

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <div className="flex max-lg:flex-col gap-4">
        <div className="lg:w-[320px] w-full">
          <ProvidersSidebar 
            diseaseSlug={slug}
            country={country}
            city={city}
            district={district}
          />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
