import { SCENE_H, SCENE_W } from './detectionData';

/** The synthetic street scene, drawn with plain SVG shapes in a 640×400 coordinate space. */
export default function SceneArt() {
  return (
    <g aria-hidden>
      {/* sky and ground */}
      <rect x={0} y={0} width={SCENE_W} height={300} fill="#e0f2fe" />
      <rect x={0} y={300} width={SCENE_W} height={SCENE_H - 300} fill="#d9f99d" />
      <rect x={0} y={338} width={SCENE_W} height={4} fill="#a3a3a3" opacity={0.4} />

      {/* sun and cloud (the detector will mistake these for objects) */}
      <circle cx={80} cy={70} r={28} fill="#fde047" />
      <g fill="#ffffff">
        <circle cx={330} cy={80} r={22} />
        <circle cx={360} cy={66} r={28} />
        <circle cx={390} cy={82} r={20} />
        <rect x={326} y={80} width={68} height={22} rx={11} />
      </g>

      {/* bush */}
      <g fill="#65a30d">
        <circle cx={350} cy={330} r={20} />
        <circle cx={378} cy={322} r={24} />
        <circle cx={392} cy={334} r={14} />
      </g>

      {/* car */}
      <polygon points="100,277 126,250 200,250 228,277" fill="#93c5fd" stroke="#1e3a8a" strokeWidth={2} />
      <rect x={60} y={275} width={200} height={47} rx={10} fill="#3b82f6" stroke="#1e3a8a" strokeWidth={2} />
      <circle cx={105} cy={325} r={15} fill="#1f2937" />
      <circle cx={215} cy={325} r={15} fill="#1f2937" />
      <circle cx={105} cy={325} r={6} fill="#9ca3af" />
      <circle cx={215} cy={325} r={6} fill="#9ca3af" />

      {/* person */}
      <circle cx={290} cy={190} r={18} fill="#fcd9b6" stroke="#7c2d12" strokeWidth={2} />
      <rect x={272} y={208} width={36} height={72} rx={8} fill="#f43f5e" />
      <rect x={262} y={214} width={10} height={52} rx={5} fill="#f43f5e" />
      <rect x={308} y={214} width={10} height={52} rx={5} fill="#f43f5e" />
      <rect x={274} y={278} width={13} height={62} rx={4} fill="#334155" />
      <rect x={293} y={278} width={13} height={62} rx={4} fill="#334155" />

      {/* tree */}
      <rect x={473} y={230} width={24} height={110} fill="#92400e" />
      <g fill="#22c55e">
        <circle cx={485} cy={140} r={60} />
        <circle cx={450} cy={190} r={40} />
        <circle cx={520} cy={190} r={40} />
      </g>

      {/* dog */}
      <g fill="#b45309">
        <ellipse cx={600} cy={310} rx={28} ry={14} />
        <circle cx={628} cy={296} r={11} />
        <rect x={578} y={318} width={7} height={22} rx={3} />
        <rect x={612} y={318} width={7} height={22} rx={3} />
        <rect x={570} y={300} width={10} height={5} rx={2} />
      </g>
    </g>
  );
}
