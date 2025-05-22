import Tesseract from 'tesseract.js';
import convert from 'heic-convert';
import logger from '../setupPino';

const isBufferHeic = (imageBuffer) => {
  let isHeic = false;
  // Check for HEIC (FTYP box)
  if (imageBuffer.length >= 12) {
    const ftypBox = imageBuffer.subarray(4, 8).toString('hex');
    const brand = imageBuffer.subarray(8, 12).toString('hex');
    if (ftypBox === '66747970' && ['68656963', '6d696631', '6d736631'].includes(brand)) {
      isHeic = true;
      logger.debug(`Detected HEIC image, brand:${brand}`);
    }
  }
  return isHeic;
};

// Match Image and your FrequentFlyerNumber input form for automated verification
export const ocrMatchFrequentFlyerNumber = async (ffn, mileagePic) => {
  const hexString = mileagePic.replace('\\x', '');
  let imageBuffer = Buffer.from(hexString, 'hex');

  if (isBufferHeic(imageBuffer)) {
    imageBuffer = await convert({ buffer: imageBuffer, format: 'PNG', quality: '0.9' });
  }
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
  logger.debug(`OCR Result Text: ${text}`);

  const regex = new RegExp(`\\b${ffn}\\b`);
  return Boolean(text.match(regex));
};
