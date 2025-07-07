import React from 'react'

function Services() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Sunulan Hizmetler</h3>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Kardiyoloji Muayenesi</h4>
          <p className="text-sm text-gray-600">Detaylı kalp sağlığı kontrolü ve değerlendirmesi</p>
        </div>
        
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">EKG Çekimi</h4>
          <p className="text-sm text-gray-600">Kalp ritmi ve fonksiyonlarının analizi</p>
        </div>
        
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Holter Monitör</h4>
          <p className="text-sm text-gray-600">24 saat kalp ritmi takibi</p>
        </div>
        
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Efor Testi</h4>
          <p className="text-sm text-gray-600">Egzersiz sırasında kalp performansı ölçümü</p>
        </div>
      </div>
    </div>
  )
}

export default Services 