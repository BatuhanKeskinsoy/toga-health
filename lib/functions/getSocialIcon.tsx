import { ReactElement } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoYoutube } from "react-icons/io5";

export function getSocialIcon(name: string): ReactElement {
  switch (name) {
    case "facebook":
      return <IoLogoFacebook />;
    case "twitter":
      return <FaXTwitter />;
    case "instagram":
      return <IoLogoInstagram />;
    case "youtube":
      return <IoLogoYoutube />;
    case "linkedin":
      return <IoLogoLinkedin />;
    default:
      return null;
  }
}
