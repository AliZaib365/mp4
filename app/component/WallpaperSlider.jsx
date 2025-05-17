'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';

export default function WallpaperSlider() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await fetch('https://wpqualityapi.appsqueeze.com/api/mp4');
        if (!response.ok) {
          throw new Error('Failed to fetch wallpapers');
        }
        const data = await response.json();
        
        // Map the API response to match the expected format
        if (data.success && data.videos) {
          setWallpapers(data.videos.map((video, index) => ({
            id: index + 1,
            name: video.name,
            url: video.path,
            // You can add a poster URL here if available
            // poster: `https://example.com/posters/${video.name.replace('.mp4', '.jpg')}`
          })));
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-8xl px-4 py-16 bg-gradient-to-b from-gray-900 to-black mx-auto text-center">
        <div className="animate-pulse text-2xl text-purple-400">Loading premium wallpapers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-8xl px-4 py-16 bg-gradient-to-b from-gray-900 to-black mx-auto text-center">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-8xl px-4 py-16 bg-gradient-to-b from-gray-900 to-black mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Premium Visuals
        </h2>
        <p className="text-gray-300 text-xl">Immerse yourself in stunning 4K content</p>
      </div>
      
      {wallpapers.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{ 
            delay: 3500, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          loop
          spaceBetween={0}
          slidesPerView={1}
          className="relative group"
        >
          {wallpapers.map((item) => {
            const isVideo = item.url?.endsWith('.mp4');

            return (
              <SwiperSlide key={item.id}>
                <div className="mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-[70vh] bg-black transition-all duration-500 hover:shadow-purple-500/30">
                    {isVideo ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <video
                          src={item.url}
                          poster={item.poster}
                          className="w-full h-full object-contain"
                          muted
                          autoPlay
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <span className="text-white font-medium text-sm bg-black/70 px-3 py-2 rounded-lg backdrop-blur-sm">
                            ▶️ {item.name.replace('.mp4', '')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.url}
                          alt={`Wallpaper ${item.name}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <span className="text-white font-medium text-sm bg-black/70 px-3 py-2 rounded-lg backdrop-blur-sm">
                            🖼️ {item.name.replace('.mp4', '')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          
          <div className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600 hover:scale-110 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600 hover:scale-110 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Swiper>
      ) : (
        <div className="text-center text-gray-400 py-12">
          No wallpapers available at the moment.
        </div>
      )}
      
      <div className="mt-12 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform hover:-translate-y-1 text-lg">
          Explore Full Collection
        </button>
      </div>
    </div>
  );
}