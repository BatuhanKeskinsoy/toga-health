import React from "react";
import SearchBar from "@/components/(front)/Search/SearchBar";
import { getServerLocationData } from "@/lib/utils/getServerLocation";

async function Banner() {
  const initialLocation = await getServerLocationData();
  return (
    <div className="relative flex items-center justify-center py-24 min-h-[600px] bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Premium Arkaplan Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_50%)]"></div>

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-sitePrimary/8 rounded-2xl rotate-12 shadow-lg backdrop-blur-sm border border-sitePrimary/10">
        <div className="w-full h-full flex items-center justify-center text-sitePrimary/40">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>

      <div className="absolute top-40 right-32 w-12 h-12 bg-sitePrimary/6 rounded-xl -rotate-6 shadow-md backdrop-blur-sm border border-sitePrimary/8">
        <div className="w-full h-full flex items-center justify-center text-sitePrimary/30">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-32 left-32 w-14 h-14 bg-sitePrimary/7 rounded-2xl rotate-45 shadow-lg backdrop-blur-sm border border-sitePrimary/12">
        <div className="w-full h-full flex items-center justify-center text-sitePrimary/35">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>

      {/* Elegant Floating Shapes */}
      <div className="absolute top-32 left-1/4 w-24 h-24 bg-gradient-to-br from-sitePrimary/10 to-transparent rounded-full blur-sm animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-gradient-to-tl from-sitePrimary/8 to-transparent rounded-full blur-md animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-16 w-20 h-20 bg-gradient-to-br from-sitePrimary/6 to-transparent rounded-full blur-sm animate-pulse delay-500"></div>

      {/* Premium Glassmorphism Cards */}
      <div className="absolute top-16 right-16 w-48 h-32 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl transform rotate-3"></div>
      <div className="absolute bottom-20 left-16 w-40 h-24 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg transform -rotate-2"></div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col gap-8 w-full justify-center items-center">  

          {/* Hero Title */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="text-slate-700">Sağlığınız İçin</span>{" "}
              <span className="bg-gradient-to-r from-sitePrimary/70 via-sitePrimary to-sitePrimary/70 bg-clip-text text-transparent">
                En İyisini
              </span>{" "}
              <span className="text-slate-700">Bulun</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
              Uzman doktorlar, modern hastaneler ve kaliteli sağlık hizmetleri
              için
              <span className="text-sitePrimary font-semibold">
                {" "}
                tek platform
              </span>
            </p>
          </div>

          {/* Search Section */}
          <div className="w-full mt-4 max-w-5xl">
            <SearchBar
              key="main-search-bar"
              initialLocation={initialLocation}
            />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-medium">Güvenli & Güvenilir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="font-medium">Uzman Doktorlar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-medium">7/24 Hizmet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
