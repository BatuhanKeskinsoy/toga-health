import React from 'react'

function About() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Hakkında</h3>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Eğitim</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Tıp Fakültesi - İstanbul Üniversitesi (2010-2016)</li>
            <li>• Kardiyoloji Uzmanlığı - Hacettepe Üniversitesi (2016-2020)</li>
            <li>• İleri Kardiyoloji Eğitimi - Mayo Clinic (2021)</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Deneyim</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 8+ yıl kardiyoloji deneyimi</li>
            <li>• 5000+ başarılı hasta tedavisi</li>
            <li>• 50+ bilimsel makale yayını</li>
            <li>• Uluslararası kongrelerde sunum</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Uzmanlık Alanları</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Koroner Arter Hastalıkları</li>
            <li>• Kalp Yetmezliği</li>
            <li>• Ritim Bozuklukları</li>
            <li>• Hipertansiyon</li>
            <li>• Koroner Anjiyografi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About 