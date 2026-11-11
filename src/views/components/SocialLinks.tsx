import { Facebook, Instagram } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';

/** Social icons. A network only appears once its link is set in the admin area. */
export const SocialLinks = ({ className = '' }: { className?: string }) => {
  const { site } = useContent();
  const links = [
    { url: site.instagramUrl, label: 'Instagram', Icon: Instagram },
    { url: site.facebookUrl, label: 'Facebook', Icon: Facebook },
  ].filter((link) => link.url);
  if (links.length === 0) return null;

  return (
    <ul className={`flex gap-1 ${className}`}>
      {links.map(({ url, label, Icon }) => (
        <li key={label}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="icon-btn text-accent" aria-label={`${site.name} on ${label} (opens in a new tab)`}>
            <Icon size={24} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
};
