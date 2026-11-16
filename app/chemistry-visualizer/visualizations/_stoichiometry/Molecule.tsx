import { ELEMENTS, formulaSegments, type Composition } from './chem';

interface PlacedAtom {
  el: string;
  x: number;
  y: number;
  r: number;
}

export interface MoleculeLayout {
  atoms: PlacedAtom[];
  width: number;
  height: number;
}

const HEAVY_R = 10;
const H_R = 7;
const radiusOf = (el: string) => (el === 'H' ? H_R : HEAVY_R);

const cache = new Map<string, MoleculeLayout>();

export function moleculeLayout(comp: Composition): MoleculeLayout {
  const key = JSON.stringify(comp);
  const hit = cache.get(key);
  if (hit) return hit;

  const atoms: string[] = Object.entries(comp).flatMap(([el, n]) => Array.from({ length: n }, () => el));
  let placed: PlacedAtom[];
  const singles = Object.entries(comp).filter(([el, n]) => n === 1 && el !== 'H');
  const preferred = singles.filter(([el]) => el !== 'O');
  const center = (preferred.length ? preferred[preferred.length - 1] : singles[0])?.[0];

  if (atoms.length === 1) {
    placed = [{ el: atoms[0], x: 0, y: 0, r: radiusOf(atoms[0]) }];
  } else if (center && atoms.length <= 7) {
    const ring = [...atoms];
    ring.splice(ring.indexOf(center), 1);
    const bent = ring.length === 2 && (center === 'O' || center === 'S');
    placed = [{ el: center, x: 0, y: 0, r: radiusOf(center) }];
    ring.forEach((el, i) => {
      const angle = bent ? Math.PI / 2 + (i === 0 ? -1 : 1) * ((104.5 / 2) * Math.PI) / 180 : (2 * Math.PI * i) / ring.length;
      const d = radiusOf(center) + radiusOf(el) - 3;
      placed.push({ el, x: d * Math.cos(angle), y: d * Math.sin(angle), r: radiusOf(el) });
    });
  } else {
    const cols = Math.ceil(Math.sqrt(atoms.length));
    const ordered = [...atoms].sort((a, b) => (a === 'H' ? 1 : 0) - (b === 'H' ? 1 : 0));
    placed = ordered.map((el, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return { el, x: col * 16 + (row % 2) * 8, y: row * 14, r: radiusOf(el) };
    });
  }

  const minX = Math.min(...placed.map((a) => a.x - a.r));
  const maxX = Math.max(...placed.map((a) => a.x + a.r));
  const minY = Math.min(...placed.map((a) => a.y - a.r));
  const maxY = Math.max(...placed.map((a) => a.y + a.r));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const layout = {
    atoms: placed.map((a) => ({ ...a, x: a.x - cx, y: a.y - cy })),
    width: maxX - minX,
    height: maxY - minY,
  };
  cache.set(key, layout);
  return layout;
}

interface GlyphProps {
  comp: Composition;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  ring?: string;
  labels?: boolean;
}

export function MoleculeGlyph({ comp, x, y, scale = 1, opacity = 1, ring, labels = true }: GlyphProps) {
  const layout = moleculeLayout(comp);
  const pad = 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {ring && (
        <rect
          x={-layout.width / 2 - pad}
          y={-layout.height / 2 - pad}
          width={layout.width + pad * 2}
          height={layout.height + pad * 2}
          rx={8}
          fill="none"
          stroke={ring}
          strokeWidth={2.5 / scale}
          strokeDasharray={`${5 / scale} ${3 / scale}`}
        />
      )}
      {layout.atoms.map((a, i) => {
        const info = ELEMENTS[a.el];
        return (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r={a.r} fill={info.color} stroke="#0f172a" strokeOpacity={0.35} strokeWidth={1} />
            {labels && (
              <text
                x={a.x}
                y={a.y}
                dy="0.35em"
                textAnchor="middle"
                fontSize={a.el.length > 1 ? a.r * 0.85 : a.r * 1.05}
                fontWeight={700}
                fill={info.text}
              >
                {a.el}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function MoleculeIcon({ comp, className = 'h-9 w-auto', title }: { comp: Composition; className?: string; title?: string }) {
  const layout = moleculeLayout(comp);
  const w = layout.width + 4;
  const h = layout.height + 4;
  return (
    <svg viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`} className={className} role="img" aria-label={title}>
      <MoleculeGlyph comp={comp} x={0} y={0} />
    </svg>
  );
}

export function ChemFormula({ formula, className = '' }: { formula: string; className?: string }) {
  return (
    <span className={className}>
      {formulaSegments(formula).map((seg, i) => (seg.sub ? <sub key={i}>{seg.text}</sub> : <span key={i}>{seg.text}</span>))}
    </span>
  );
}

export function ElementSwatch({ el }: { el: string }) {
  return <span className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20" style={{ backgroundColor: ELEMENTS[el]?.color }} aria-hidden />;
}
