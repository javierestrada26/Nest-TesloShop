import 'multer';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  // Obtener extensión del archivo (ej: 'jpg') y del mimetype (ej: 'jpeg')
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
  const mimeExtension = file.mimetype.split('/')[1]?.toLowerCase() || '';

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  // Validar si la extensión del archivo o el mimetype son válidos
  if (
    validExtensions.includes(fileExtension) ||
    validExtensions.includes(mimeExtension)
  ) {
    return callback(null, true);
  }

  callback(null, false);
};