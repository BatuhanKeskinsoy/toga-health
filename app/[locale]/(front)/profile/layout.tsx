import type { Metadata } from "next";
import AuthenticatedLayout from "@/app/[locale]/(front)/profile/AuthenticationLayout";
import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const generals = await getGeneralSettings();
  return (
    <AuthenticatedLayout generals={generals}>
      <div className="container mx-auto px-4 w-full flex items-start max-lg:flex-col lg:gap-8 gap-4 lg:min-h-[calc(100vh-710px)] max-lg:pt-6">
        <aside className="w-full lg:max-w-[260px] lg:sticky lg:top-24">
          <ProfileSidebar />
        </aside>
        <hr className="lg:hidden w-full border-gray-200" />
        <main className="w-full">{children}</main>
      </div>
    </AuthenticatedLayout>
  );
}
