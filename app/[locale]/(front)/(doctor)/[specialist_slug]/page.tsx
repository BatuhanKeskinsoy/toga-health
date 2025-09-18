import { redirect } from 'next/navigation';
import { getDoctorDetail } from '@/lib/services/provider/doctor';
import { notFound } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/utils/getLocalizedUrl';

export const dynamic = "force-dynamic";

// Türkçe karakterleri normalize eden fonksiyon
const normalizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    specialist_slug: string;
  }>;
}) {
  const { locale, specialist_slug } = await params;

  // Doktor bilgisini API'den çek
  try {
    const response = await getDoctorDetail(specialist_slug);
    
    if (!response.status || !response.data) {
      notFound();
    }

    const doctor = response.data;

    // Doktor'un specialty bilgisini al ve slug'a çevir
    const branchSlug = normalizeSlug(doctor.doctor?.specialty?.name || 'genel');

    // Doğru URL'ye redirect et
    const redirectUrl = getLocalizedUrl(`/${specialist_slug}/${branchSlug}`, locale);
    
    redirect(redirectUrl);
  } catch (error) {
    notFound();
  }
}

export default Page;
