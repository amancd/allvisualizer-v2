import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
