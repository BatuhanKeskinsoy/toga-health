import { generateLocaleFiles } from "@/lib/utils/Lang/generateLocales";
import React from "react";

function page() {
  generateLocaleFiles();
  return null;
}

export default page;
