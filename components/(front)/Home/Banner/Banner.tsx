import React from 'react'
import SearchBar from '@/components/(front)/Search/SearchBar'

function Banner() {
  return (
    <div className='flex items-center justify-center py-32'>
      <div className='container mx-auto px-4'>
        <div className="flex flex-col gap-6 w-full justify-center items-center">
          <div className='flex flex-col items-center gap-2'>
            <h1 className='text-4xl font-bold'>Arama Yapın</h1>
            <p className='text-gray-500'>Search for the best specialists, branches, diseases and hospitals</p>
          </div>
          <div className='lg:max-w-5xl w-full'>
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner