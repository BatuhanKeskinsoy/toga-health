import React from 'react'

function Profile() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Profil Bilgileri</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <h4 className="text-md font-medium text-gray-700">Uzmanlık Alanları</h4>
        <div className="flex flex-wrap gap-2">
          <span className="bg-sitePrimary/10 text-sitePrimary px-3 py-1 rounded-full text-sm">Kardiyoloji</span>
          <span className="bg-sitePrimary/10 text-sitePrimary px-3 py-1 rounded-full text-sm">İç Hastalıkları</span>
          <span className="bg-sitePrimary/10 text-sitePrimary px-3 py-1 rounded-full text-sm">Acil Tıp</span>
        </div>
      </div>
    </div>
  )
}

export default Profile 