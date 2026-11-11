import { useContent } from '../../content/ContentProvider';

export const GallerySection = () => {
  const { gallery } = useContent();
  if (gallery.images.length === 0) return null;

  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <h2 className="section-title">{gallery.title}</h2>
        <ul className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
          {gallery.images.map((image) => (
            <li key={image.id} className="aspect-square overflow-hidden rounded-xl bg-line">
              <img src={image.url} alt={image.alt} width={600} height={600} loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
