"use client";

function GalleryHeader() {
  return (
    <section className="relative h-[420px] flex items-center justify-center text-white">
      <div
        className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url(https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg)",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-semibold mb-6">Latest Gallery</h1>
        <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
          HOME › GALLERY
        </div>
      </div>
    </section>
  );
}

function GalleryGrid() {
  const images = [
    "https://validthemes.net/site-template/medihub/assets/img/gallery/1.jpg",
    "https://validthemes.net/site-template/medihub/assets/img/gallery/2.jpg",
    "https://validthemes.net/site-template/medihub/assets/img/gallery/3.jpg",
    "https://validthemes.net/site-template/medihub/assets/img/gallery/4.jpg",
    "https://validthemes.net/site-template/medihub/assets/img/gallery/5.jpg",
    "https://validthemes.net/site-template/medihub/assets/img/gallery/6.jpg",
  ];

  return (
    <section className="bg-white -mt-24 pt-24 pb-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Category tabs bar */}
        <div className="flex justify-center mt-12 mb-12">
          <div className="inline-flex items-center gap-6 border border-gray-200 px-8 py-3 bg-white shadow-sm">
            {["All", "Development", "Consulting", "Finance", "Branding", "Capital"].map(
              (label, index) => (
                <button
                  key={label}
                  type="button"
                  className={`text-xs md:text-sm font-medium tracking-wide uppercase ${
                    index === 0
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((src, index) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-2xl shadow-md bg-gray-100"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium tracking-wide">
                  View Photo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  return (
    <div>
      <GalleryHeader />
      <GalleryGrid />
    </div>
  );
}

