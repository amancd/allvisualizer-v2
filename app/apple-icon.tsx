import { ImageResponse } from 'next/og';
import { BrandIcon } from '@/components/layout/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iOS. iOS rounds the corners itself, so no radius here. */
export default function AppleIcon() {
  return new ImageResponse(<BrandIcon size={size.width} radius={0} />, size);
}
