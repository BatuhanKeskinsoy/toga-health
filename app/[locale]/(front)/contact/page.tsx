import Contact from '@/components/(front)/Contact/Contact';
import Breadcrumb from '@/components/others/Breadcrumb';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export default async function Page() {
  const t = await getTranslations();
  const breadcrumbs = [
    { title: t('İletişim'), slug: '/contact' },
  ];
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <Contact />
    </>
  );
}