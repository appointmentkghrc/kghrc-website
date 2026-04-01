import imageCompression from "browser-image-compression";

/** Resize/compress raster images before UploadThing upload (SVGs pass through unchanged). */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 0.65,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });

  const mime = compressed.type || "image/jpeg";
  return new File([compressed], file.name, {
    type: mime,
    lastModified: Date.now(),
  });
}
