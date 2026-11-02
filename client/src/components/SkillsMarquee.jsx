const TONES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Infinite horizontal band of coloured skill chips.
 * The list is rendered twice so the CSS translate animation loops seamlessly.
 */
export default function SkillsMarquee({ items = [] }) {
  if (!items.length) return null;

  const row = items.map((skill, index) => (
    <span key={`${skill}-${index}`} className={`marquee-chip ${TONES[index % TONES.length]}`}>
      {skill}
    </span>
  ));

  return (
    <div className="marquee" aria-label="Skills">
      <div className="marquee-track">
        {row}
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {row}
        </span>
      </div>
    </div>
  );
}
