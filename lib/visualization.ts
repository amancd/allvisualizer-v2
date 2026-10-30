/**
 * Helpers for responsive visualizations.
 *
 * Canvases and SVGs are drawn in a fixed coordinate space (e.g. 800×400) and
 * scaled to fit the screen with CSS (`w-full h-auto`). Pointer events arrive in
 * screen pixels, so convert them before using them as drawing coordinates.
 */

type PointerLike = { clientX: number; clientY: number };

/**
 * Converts a mouse/pointer/touch position into the element's drawing coordinates.
 *
 * - <canvas>: uses the canvas's width/height attributes.
 * - <svg>: uses its viewBox.
 *
 *   const { x, y } = toDrawingPoint(e, canvasRef.current);
 */
export function toDrawingPoint(event: PointerLike, element: HTMLCanvasElement | SVGSVGElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  let width = rect.width;
  let height = rect.height;

  if (element instanceof HTMLCanvasElement) {
    width = element.width;
    height = element.height;
  } else {
    const box = element.viewBox.baseVal;
    if (box && box.width && box.height) {
      width = box.width;
      height = box.height;
    }
  }

  return {
    x: ((event.clientX - rect.left) / rect.width) * width,
    y: ((event.clientY - rect.top) / rect.height) * height,
  };
}

/**
 * Class names for a drawing surface that scales with its container while keeping its aspect ratio.
 * Add `touch-none` as well if the surface is draggable, so touch drags don't scroll the page.
 */
export const responsiveSurface = 'block h-auto w-full max-w-full';
