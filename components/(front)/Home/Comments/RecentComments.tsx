import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import SwiperWrapper from "../SwiperComponents";
import { getTranslations } from "next-intl/server";

interface RecentCommentsProps {
  comments: HomeComment[];
  locale: string;
}

export default async function RecentComments({
  comments,
  locale,
}: RecentCommentsProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left gap-3">
          <h2
            id="recent-comments-heading"
            className="text-2xl lg:text-3xl font-bold text-gray-900"
          >
            {t("Danışan Yorumları")}
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl">
            {t("Danışanlarımızın deneyimlerini okuyun")}
          </p>
        </div>
      </div>

      <SwiperWrapper type="comments" data={comments} locale={locale} />
    </div>
  );
}
