import React from 'react'

function ProvidersView() {
  return (
    <div className='container mx-auto px-4'>
      <div className="flex gap-4">
        <div className="w-[320px]">
          <div className="w-full h-[200px] bg-white rounded-md sticky top-0">
            Sidebar
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-[500px] bg-white rounded-md">
            Main
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProvidersView