import Image from "next/image";
import React from "react";
import { IoExpand } from "react-icons/io5";
import Zoom from "react-medium-image-zoom";

function Gallery() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Galeri</h3>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis,
          adipisci sit perferendis sint vero a quia expedita dolorem optio,
          consequuntur nulla, quaerat magni modi impedit rerum ea delectus
          maiores.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="relative w-full h-40 rounded-md overflow-hidden group"
          >
            <Zoom>
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face"
                alt="Gallery"
                fill
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </Zoom>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-sitePrimary/30 transition-all duration-300 pointer-events-none flex items-center justify-center">
              <IoExpand className="text-4xl text-white group-hover:scale-125 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h4 className="text-md font-medium text-gray-700">Video Galeri</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Video 1</span>
          </div>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Video 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
