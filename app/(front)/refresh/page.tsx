import { generateLocaleFiles } from "@/lib/utils/lang/generateLocales";
import { redirect } from "next/navigation";

export default async function Page() {
  await generateLocaleFiles();
  redirect("/en");
}
