import CustomButton from "@/components/others/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { Link } from "@/i18n/navigation";
import { getStar } from "@/lib/functions/getStar";
import {
  IoCalendar,
  IoChatboxEllipses,
  IoHelpCircle,
  IoLocationSharp,
  IoLogoWhatsapp,
  IoBusiness,
} from "react-icons/io5";
import React from "react";
import Zoom from "react-medium-image-zoom";

// Global state için event sistemi
const triggerAppointmentAnimation = () => {
  window.dispatchEvent(new CustomEvent("triggerAppointmentAnimation"));
};

interface HospitalData {
  name: string;
  photo: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  description: string;
  phone: string;
  address: string;
}

interface DoctorData {
  name: string;
  photo: string;
  specialty: string;
  location: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  services: string[];
}

interface ProviderCardProps {
  onList?: boolean;
  isHospital?: boolean;
}

function ProviderCard({
  onList = false,
  isHospital = false,
}: ProviderCardProps) {
  // Hastane verileri
  const hospitalData: HospitalData = {
    name: "Özel Memorial Hastanesi",
    photo: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=1200&fit=crop&crop=center",
    location: "Türkiye / İstanbul / Şişli",
    rating: 4.2,
    reviewCount: 156,
    specialties: ["Kardiyoloji", "Nöroloji", "Onkoloji", "Ortopedi"],
    description: "Modern tıbbi cihazlar ve uzman kadrosuyla hizmet veren özel hastane",
    phone: "+90 212 555 0123",
    address: "Şişli Mahallesi, Hastane Caddesi No:123, Şişli/İstanbul"
  };

  // Doktor verileri
  const doctorData: DoctorData = {
    name: "Dr. Ahmet Yılmaz",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
    specialty: "Ortopedi",
    location: "Türkiye / İstanbul / Beşiktaş",
    hospital: "Özel DENTAŞEN Ağız ve Diş Sağlığı Polikliniği",
    rating: 3.6,
    reviewCount: 34,
    services: ["Ortodonti", "Invisalign", "Dijital Gülüş Tasarımı"]
  };

  const data = isHospital ? hospitalData : doctorData;

  return (
    <div className="flex flex-col w-full bg-white rounded-t-md">
      <div className="flex max-lg:flex-col justify-between gap-2 w-full">
        <div className="flex items-start gap-4 p-4 w-full">
          <div className="relative rounded-md overflow-hidden shadow-md shadow-gray-200 min-w-[140px] max-lg:min-w-[90px] group">
            <div className="relative lg:w-[140px] lg:h-[140px] w-[90px] h-[90px] overflow-hidden">
              <Zoom>
                <ProfilePhoto
                  name={data.name}
                  photo={data.photo}
                  size={140}
                  fontSize={40}
                  enableZoom={true}
                  responsiveSizes={{
                    desktop: 140,
                    mobile: 90,
                  }}
                  responsiveFontSizes={{
                    desktop: 40,
                    mobile: 30,
                  }}
                />
              </Zoom>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black/50 flex items-center justify-center origin-bottom scale-y-0 group-hover:scale-y-100 transition-all duration-300 select-none">
              <p className="text-white text-xs">
                <span className="font-bold">{isHospital ? "Hastane" : "3 Fotoğraf"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm w-full">
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{data.name}</h1>
                {isHospital && <IoBusiness className="text-sitePrimary" size={20} />}
              </div>
              {!isHospital && (
                <p className="text-sitePrimary font-medium opacity-70">
                  {(data as DoctorData).specialty}
                </p>
              )}
            </div>
            <div className="flex gap-0.5 items-center opacity-80">
              <IoLocationSharp size={16} />
              {data.location}
            </div>
            {!isHospital && (
              <Link
                href="/"
                title={(data as DoctorData).hospital}
                className="text-xs opacity-70 hover:text-sitePrimary transition-all duration-300 w-fit"
              >
                {(data as DoctorData).hospital}
              </Link>
            )}
            {isHospital && (
              <p className="text-xs opacity-70">
                {(data as HospitalData).description}
              </p>
            )}
            <div className="flex gap-2 items-center flex-wrap">
              {(isHospital ? (data as HospitalData).specialties : (data as DoctorData).services).map((item, index) => (
                <span key={index} className="text-xs opacity-70 px-2 py-1 bg-gray-100 rounded-md">
                  {item}
                </span>
              ))}
            </div>
            {isHospital && (
              <div className="flex flex-col gap-1 text-xs opacity-70">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Telefon:</span>
                  <span>{(data as HospitalData).phone}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="font-medium">Adres:</span>
                  <span>{(data as HospitalData).address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center p-4 h-fit gap-2 max-lg:w-full lg:min-w-max">
          <span className="text-2xl font-bold w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center select-none pointer-events-none">
            {data.rating}
          </span>
          <div className="flex flex-col items-center">
            <div className="flex gap-2 items-center">
              <div>
                {(() => {
                  const size = 20;
                  return (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 items-center min-w-max">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className={`relative min-w-[${size}px] w-[${size}px] h-[${size}px]`}
                          >
                            {getStar(index + 1, data.rating, size)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <span className="text-sm opacity-80 mt-2">{data.reviewCount} Değerlendirme</span>
          </div>
        </div>
      </div>
      <hr className="border-gray-100" />
      <div className="flex w-full gap-2 items-center justify-end p-3 text-sm overflow-x-auto">
        <CustomButton
          title="WhatsApp'tan Ulaşın"
          containerStyles="flex items-center gap-2 rounded-md bg-green-500 text-white px-4 py-2 min-w-max hover:opacity-80 transition-all duration-300"
          leftIcon={<IoLogoWhatsapp size={20} />}
        />
        <CustomButton
          title="Soru Sor"
          containerStyles="flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
          leftIcon={<IoHelpCircle size={20} />}
        />
        <CustomButton
          title="Mesaj Gönder"
          containerStyles="flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
          leftIcon={<IoChatboxEllipses size={20} />}
        />
        <CustomButton
          title="Randevu Oluştur"
          containerStyles="flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
          leftIcon={<IoCalendar size={20} />}
          handleClick={triggerAppointmentAnimation}
        />
      </div>
    </div>
  );
}

export default ProviderCard;
