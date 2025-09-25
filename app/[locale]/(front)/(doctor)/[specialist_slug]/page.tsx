import { redirect } from 'next/navigation';
import { getDoctorDetail } from '@/lib/services/provider/doctor';
import { notFound } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/utils/getLocalizedUrl';

export const dynamic = "force-dynamic";

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

    // Doğru URL'ye redirect et
    const redirectUrl = getLocalizedUrl(`/${specialist_slug}/${doctor.doctor_info.specialty?.slug}`, locale);
    
    redirect(redirectUrl);
  } catch (error) {
    notFound();
  }
}

export default Page;
