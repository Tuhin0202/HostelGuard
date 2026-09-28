import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const sourceImage = path.join(process.cwd(), 'public', 'logo.jpg');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(sourceImage)) {
    console.error('Source image not found:', sourceImage);
    return;
  }

  const image = await Jimp.read(sourceImage);
  
  const img192 = image.clone();
  img192.resize({ w: 192, h: 192 });
  await img192.write(path.join(publicDir, 'icon-192x192.png'));
  console.log('Generated icon-192x192.png');
  
  const img512 = image.clone();
  img512.resize({ w: 512, h: 512 });
  await img512.write(path.join(publicDir, 'icon-512x512.png'));
  console.log('Generated icon-512x512.png');
  
  const imgMaskable = image.clone();
  imgMaskable.resize({ w: 512, h: 512 });
  await imgMaskable.write(path.join(publicDir, 'icon-maskable-512x512.png'));
  console.log('Generated icon-maskable-512x512.png');
}

generateIcons().catch(console.error);
