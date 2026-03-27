const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_QUALITY = 0.82;

type OptimizeImageOptions = {
  maxDimension?: number;
  quality?: number;
};

const shouldSkipOptimization = (file: File): boolean => {
  if (!file.type.startsWith("image/")) return true;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return true;
  return false;
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    image.src = objectUrl;
  });

const getResizedDimensions = (
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } => {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const ratio = width / height;
  if (ratio >= 1) {
    return { width: maxDimension, height: Math.round(maxDimension / ratio) };
  }

  return { width: Math.round(maxDimension * ratio), height: maxDimension };
};

const canvasToWebpFile = async (
  canvas: HTMLCanvasElement,
  originalFile: File,
  quality: number
): Promise<File | null> =>
  new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const filenameWithoutExt = originalFile.name.replace(/\.[^.]+$/, "");
        resolve(
          new File([blob], `${filenameWithoutExt}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          })
        );
      },
      "image/webp",
      quality
    );
  });

export const optimizeImageFileForUpload = async (
  file: File,
  options: OptimizeImageOptions = {}
): Promise<File> => {
  if (shouldSkipOptimization(file)) return file;

  try {
    const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
    const quality = options.quality ?? DEFAULT_QUALITY;
    const image = await loadImage(file);
    const { width, height } = getResizedDimensions(
      image.width,
      image.height,
      maxDimension
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);
    const optimizedFile = await canvasToWebpFile(canvas, file, quality);
    if (!optimizedFile) return file;

    // Keep original if conversion does not reduce size enough.
    if (optimizedFile.size >= file.size * 0.98) {
      return file;
    }

    return optimizedFile;
  } catch (error) {
    console.error("Image optimization failed, using original file:", error);
    return file;
  }
};

export const optimizeImagesForUpload = async (
  files: File[],
  options?: OptimizeImageOptions
): Promise<File[]> => Promise.all(files.map((file) => optimizeImageFileForUpload(file, options)));
