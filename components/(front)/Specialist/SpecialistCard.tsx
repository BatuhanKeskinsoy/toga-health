import ProfilePhoto from '@/components/others/ProfilePhoto'
import React from 'react'

function SpecialistCard() {
  return (
    <div className="flex max-lg:flex-col w-full justify-between bg-white rounded-md shadow-lg shadow-gray-200">
      <div className="flex items-center gap-4 p-4">
        <div className="relative rounded-md overflow-hidden group">
          <ProfilePhoto size={120} name="Ahmet Yılmaz" fontSize={36} />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-black/50 flex items-center justify-center origin-bottom scale-y-0 group-hover:scale-y-100 transition-all duration-300 select-none">
            <p className="text-white text-xs">
              <span className="font-bold">3 Fotoğraf</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-col gap-0">
            <h1 className="text-xl font-semibold">Dr. Ahmet Yılmaz</h1>
            <p className="text-sitePrimary font-medium opacity-70">Ortopedi</p>
          </div>
          <p className="opacity-90">Türkiye / İstanbul / Beşiktaş</p>
          <p className="text-xs opacity-70">Özel DENTAŞEN Ağız ve Diş Sağlığı Polikliniği</p>
        </div>
      </div>
      <div className='flex flex-col items-end gap-1  p-4'>
        <span>4.9</span>
        <span>100 Değerlendirme</span>
        <span>100 Değerlendirme</span>
      </div>
    </div>
  )
}

export default SpecialistCard