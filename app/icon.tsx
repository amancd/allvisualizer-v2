import { ImageResponse } from 'next/og';
import { BrandIcon } from '@/components/layout/brand';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Browser tab favicon. */
export default function Icon() {
  return new ImageResponse(<BrandIcon size={size.width} radius={8} />, size);
}
