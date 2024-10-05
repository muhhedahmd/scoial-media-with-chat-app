// pages/api/generate-blurhash.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fetch from 'node-fetch';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { imageUrl } = body;

  // Validate the imageUrl
  if (!imageUrl || typeof imageUrl !== 'string') {
    return NextResponse.json({
      error: 'Missing or invalid image URL',
    }, {
      status: 400,
    });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }
    const imageBuffer = await response.arrayBuffer();

    const blurredImage = await sharp(imageBuffer)
      .resize(100)  
      .blur(20)     
      .toBuffer();

    // Convert the blurred image buffer to a base64-encoded string to return as a response
    const base64Image = `data:image/jpeg;base64,${blurredImage.toString('base64')}`;

    return NextResponse.json({
      blurredImage: base64Image,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing the image:', error);
    return NextResponse.json({
  
      error: 'Failed to process the image',
    }, {
      status: 500,
    });
  }
};

// import sharp from 'sharp';
// import fetch from 'node-fetch';
// import { encode } from 'blurhash';
// import { NextRequest, NextResponse } from 'next/server';

// export const POST = async (req: NextRequest) => {
//   const body = await req.json();
//   const { imageUrl } = body;

//   // Validate the imageUrl
//   if (!imageUrl || typeof imageUrl !== 'string') {
//     return NextResponse.json({
//       error: 'Missing or invalid image URL',
//     }, {
//       status: 400,
//     });
//   }

//   try {
//     // Fetch the image from the URL
//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       throw new Error('Failed to fetch the image');
//     }
//     const imageBuffer = await response.buffer();

//     // Use sharp to resize the image and get raw pixel data
//     const { data, info } = await sharp(imageBuffer)
//       .raw()
//       .ensureAlpha()
//       .resize(32, 32)  // Resize for faster processing
//       .toBuffer({ resolveWithObject: true });

//     // Encode raw image data into a blurhash
//     const blurhash = encode(
//       new Uint8ClampedArray(data),
//       info.width,
//       info.height,
//       4,  // X components
//       4   // Y components
//     );

//     return NextResponse.json({
//       blurhash,  // Send the blurhash string instead of a base64 image
//     }, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error generating blurhash:', error);
//     return NextResponse.json({
//       error: 'Failed to generate blurhash',
//     }, {
//       status: 500,
//     });
//   }
// };
