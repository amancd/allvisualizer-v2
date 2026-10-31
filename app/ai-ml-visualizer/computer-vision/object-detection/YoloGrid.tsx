'use client';

import { useState } from 'react';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import SceneArt from './SceneArt';
import { CLASSES, CLASS_COLORS, GROUND_TRUTH, SCENE_H, SCENE_W } from './detectionData';

const BOXES_PER_CELL = 2;

/** YOLO-style grid: the cell containing an object's centre is responsible for predicting that object. */
export default function YoloGrid() {
  const [S, setS] = useState(5);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

  const cellW = SCENE_W / S;
  const cellH = SCENE_H / S;

  const targets = GROUND_TRUTH.map((gt) => {
    const cx = gt.x + gt.w / 2;
    const cy = gt.y + gt.h / 2;
    const col = Math.min(S - 1, Math.floor(cx / cellW));
    const row = Math.min(S - 1, Math.floor(cy / cellH));
    return {
      gt,
      cx,
      cy,
      row,
      col,
      tx: cx / cellW - col,
      ty: cy / cellH - row,
      tw: gt.w / SCENE_W,
      th: gt.h / SCENE_H,
    };
  });

  const sel = selected && selected.row < S && selected.col < S ? selected : null;
  const owner = sel ? targets.find((t) => t.row === sel.row && t.col === sel.col) : undefined;
  const depth = BOXES_PER_CELL * 5 + CLASSES.length;

  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toDrawingPoint(e, e.currentTarget);
    setSelected({ row: Math.min(S - 1, Math.floor(p.y / cellH)), col: Math.min(S - 1, Math.floor(p.x / cellW)) });
  };

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0 space-y-3">
          <svg
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            className={`${responsiveSurface} cursor-pointer rounded-lg border border-line-strong`}
            onPointerDown={pick}
            role="img"
            aria-label={`Scene divided into a ${S} by ${S} grid`}
          >
            <SceneArt />
            {targets.map((t) => (
              <rect
                key={t.gt.id}
                x={t.col * cellW}
                y={t.row * cellH}
                width={cellW}
                height={cellH}
                fill={CLASS_COLORS[t.gt.cls]}
                fillOpacity={0.28}
              />
            ))}
            {Array.from({ length: S + 1 }, (_, i) => (
              <g key={i} stroke="#111827" strokeOpacity={0.45} strokeWidth={1.5}>
                <line x1={i * cellW} y1={0} x2={i * cellW} y2={SCENE_H} />
                <line x1={0} y1={i * cellH} x2={SCENE_W} y2={i * cellH} />
              </g>
            ))}
            {targets.map((t) => (
              <g key={t.gt.id}>
                <rect x={t.gt.x} y={t.gt.y} width={t.gt.w} height={t.gt.h} fill="none" stroke={CLASS_COLORS[t.gt.cls]} strokeWidth={3} />
                <circle cx={t.cx} cy={t.cy} r={7} fill={CLASS_COLORS[t.gt.cls]} stroke="#ffffff" strokeWidth={2} />
              </g>
            ))}
            {sel && (
              <rect x={sel.col * cellW} y={sel.row * cellH} width={cellW} height={cellH} fill="none" stroke="#c026d3" strokeWidth={5} />
            )}
          </svg>
          <label className="block">
            <span className="flex justify-between text-sm text-ink-muted">
              <span>Grid size S</span>
              <span className="font-mono text-ink">
                {S} × {S}
              </span>
            </span>
            <input
              type="range"
              min={3}
              max={9}
              step={1}
              value={S}
              onChange={(e) => setS(Number(e.target.value))}
              className="mt-1 w-full accent-brand-600"
            />
          </label>
        </div>

        <div className="min-w-0 space-y-4 text-sm">
          <div className="rounded-lg border border-line bg-subtle p-3">
            <p className="text-ink-muted">Output tensor (B = {BOXES_PER_CELL} boxes per cell, C = {CLASSES.length} classes)</p>
            <p className="font-mono text-lg text-ink">
              S × S × (B·5 + C) = {S} × {S} × {depth} = {S * S * depth} numbers
            </p>
          </div>
          <div className="rounded-lg border border-line p-3">
            {sel ? (
              owner ? (
                <>
                  <p className="font-semibold text-ink">
                    Cell (row {sel.row}, col {sel.col}) is responsible for the {owner.gt.cls}.
                  </p>
                  <p className="mt-1 text-ink-muted">Its training target for one of its boxes:</p>
                  <p className="mt-1 break-words font-mono text-ink">
                    x = {owner.tx.toFixed(2)}, y = {owner.ty.toFixed(2)}, w = {owner.tw.toFixed(2)}, h = {owner.th.toFixed(2)}, objectness = 1,
                    class = {owner.gt.cls}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink">
                    Cell (row {sel.row}, col {sel.col}) contains no object centre.
                  </p>
                  <p className="mt-1 text-ink-muted">
                    It is trained to output objectness close to 0, even if part of an object overlaps it. Its box predictions are ignored.
                  </p>
                </>
              )
            ) : (
              <p className="text-ink-muted">Tap a grid cell to see what it is trained to predict.</p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-ink-muted">
                <tr>
                  <th className="py-1 pr-2 font-medium">Object</th>
                  <th className="py-1 pr-2 font-medium">Cell</th>
                  <th className="py-1 pr-2 text-right font-medium">x, y in cell</th>
                  <th className="py-1 text-right font-medium">w, h</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {targets.map((t) => (
                  <tr key={t.gt.id} className="border-t border-line">
                    <td className="py-1 pr-2">
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: CLASS_COLORS[t.gt.cls] }} />
                      {t.gt.cls}
                    </td>
                    <td className="py-1 pr-2 font-mono">
                      ({t.row}, {t.col})
                    </td>
                    <td className="py-1 pr-2 text-right font-mono">
                      {t.tx.toFixed(2)}, {t.ty.toFixed(2)}
                    </td>
                    <td className="py-1 text-right font-mono">
                      {t.tw.toFixed(2)}, {t.th.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-muted">
            x and y are the object centre relative to its cell (0 to 1); w and h are relative to the whole image. If two centres land in the
            same cell, that cell has to predict both, which is one reason YOLO uses several boxes per cell (and later versions use anchors).
          </p>
        </div>
      </div>
    </div>
  );
}
