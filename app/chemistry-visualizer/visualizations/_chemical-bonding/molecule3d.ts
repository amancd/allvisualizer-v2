import { useCallback, useRef, useState } from 'react';
import { toDrawingPoint } from '@/lib/visualization';

export type Vec3 = [number, number, number];
export type Mat3 = [number, number, number, number, number, number, number, number, number];

export const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export function multiply(a: Mat3, b: Mat3): Mat3 {
  const out = new Array(9).fill(0) as Mat3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      out[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
    }
  }
  return out;
}

export function rotX(t: number): Mat3 {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [1, 0, 0, 0, c, -s, 0, s, c];
}

export function rotY(t: number): Mat3 {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

export function apply(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const length = (a: Vec3) => Math.sqrt(dot(a, a));
export const normalize = (a: Vec3): Vec3 => {
  const l = length(a);
  return l === 0 ? [0, 0, 0] : scale(a, 1 / l);
};

export function angleBetween(a: Vec3, b: Vec3) {
  const c = dot(normalize(a), normalize(b));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

export interface Projection {
  cx: number;
  cy: number;
  scale: number;
  camera: number;
}

export interface Projected {
  x: number;
  y: number;
  z: number;
  k: number;
}

export function project(v: Vec3, p: Projection): Projected {
  const k = p.camera / (p.camera - v[2]);
  return { x: p.cx + v[0] * p.scale * k, y: p.cy - v[1] * p.scale * k, z: v[2], k };
}

export function pyramidal(bondAngleDeg: number, count = 3, down = true): Vec3[] {
  const alpha = (bondAngleDeg * Math.PI) / 180;
  const cosT = Math.sqrt((1 + 2 * Math.cos(alpha)) / 3);
  const sinT = Math.sqrt(1 - cosT * cosT);
  const sign = down ? -1 : 1;
  return Array.from({ length: count }, (_, i) => {
    const phi = (i * 2 * Math.PI) / count;
    return [sinT * Math.sin(phi), sign * cosT, sinT * Math.cos(phi)] as Vec3;
  });
}

export const DEFAULT_VIEW: Mat3 = multiply(rotX(0.35), rotY(-0.5));

export function useDragRotation(initial: Mat3 = DEFAULT_VIEW) {
  const [rotation, setRotation] = useState<Mat3>(initial);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = toDrawingPoint(e, e.currentTarget);
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!last.current) return;
    const point = toDrawingPoint(e, e.currentTarget);
    const dx = point.x - last.current.x;
    const dy = point.y - last.current.y;
    last.current = point;
    setRotation((r) => multiply(multiply(rotY(dx * 0.012), rotX(dy * 0.012)), r));
  }, []);

  const end = useCallback(() => {
    last.current = null;
    setDragging(false);
  }, []);

  return {
    rotation,
    setRotation,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end },
  };
}
