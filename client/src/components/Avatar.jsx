const hues = (name = '') =>
  [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;

/** Colourful initial-based avatar (no image needed) */
export default function Avatar({ name = 'anonymous', size = 'sm' }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const hue = hues(name);
  const style = {
    background: `linear-gradient(135deg, hsl(${hue} 88% 62%), hsl(${(hue + 55) % 360} 88% 56%))`,
  };

  return (
    <span className={`avatar ${size === 'lg' ? 'avatar-lg' : ''}`} style={style} aria-hidden="true">
      {initial}
    </span>
  );
}
