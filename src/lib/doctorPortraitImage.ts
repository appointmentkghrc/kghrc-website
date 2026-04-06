import type { Area } from "react-easy-crop";

/** Width ÷ height — matches portrait headshot use (profile column, cards). */
export const DOCTOR_PORTRAIT_ASPECT = 3 / 4;

/** Output pixel size after crop (3:4). */
export const DOCTOR_PORTRAIT_OUTPUT_WIDTH = 900;
export const DOCTOR_PORTRAIT_OUTPUT_HEIGHT = 1200;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = src;
  });
}

/** Renders the cropped region to a fixed-size canvas and returns a WebP file. */
export async function getCroppedPortraitFile(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  outputHeight: number,
  filenameBase: string
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not encode image"));
          return;
        }
        const safe = filenameBase.replace(/[^\w\-]+/g, "-").slice(0, 80) || "doctor-photo";
        resolve(
          new File([blob], `${safe}-doctor.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          })
        );
      },
      "image/webp",
      0.88
    );
  });
}
