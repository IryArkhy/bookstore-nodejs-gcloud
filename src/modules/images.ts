import cloudinary from 'cloudinary';
import util from 'util';
import Multer from 'multer';

const maxSize = 2 * 1024 * 1024;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const memoryStorage = Multer.memoryStorage();

export const processFile = Multer({
  storage: memoryStorage,
  limits: {
    fileSize: maxSize,
  },
});

export const processFileMiddleware = util.promisify(processFile.single('file'));

export const uploadToCloudinary = async (
  fileString: string,
  format: string,
  fileName: string,
  publicID?: string,
): Promise<cloudinary.UploadApiResponse> => {
  const { uploader } = cloudinary.v2;

  const res = await uploader.upload(
    `data:image/${format};base64,${fileString}`,
    {
      filename_override: fileName,
      public_id: publicID,
      folder: 'bookstore-api',
    },
  );

  return res;
};
