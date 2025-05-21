import Tesseract from 'tesseract.js';
// import sharp from 'sharp';
import logger from '../setupPino';

// Match Image and your FrequentFlyerNumber input form for automated verification
export const ocrMatchFrequentFlyerNumber = async (ffn, mileagePic) => {
  const hexString = mileagePic.replace('\\x', '');
  const imageBuffer = Buffer.from(hexString, 'hex');

  // let isHeic = false;
  // // Check for HEIC (FTYP box)
  // if (imageBuffer.length >= 12) {
  //   const ftypBox = imageBuffer.slice(4, 8).toString('hex');
  //   const brand = imageBuffer.slice(8, 12).toString('hex');
  //   if (ftypBox === '66747970' && ['68656963', '6d696631', '6d736631'].includes(brand)) {
  //     isHeic = true;
  //     logger.debug('Detected HEIC image, brand:', brand);
  //   }
  // }
  // if (isHeic) {
  //   imageBuffer = await covertHEICToPNG(imageBuffer);
  // }
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
  // logger.debug(text);

  const regex = new RegExp(`\\b${ffn}\\b`);
  return Boolean(text.match(regex));
};

// const covertHEICToPNG = async (imageBuffer) => {
//   // Convert HEIC (or other formats) to PNG
//   return await sharp(imageBuffer)
//     .png() // Convert to PNG for Tesseract
//     .grayscale() // Optional: Improve OCR accuracy
//     .toBuffer();
// };
