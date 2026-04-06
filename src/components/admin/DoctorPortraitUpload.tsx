"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useUploadThing } from "@/lib/uploadthing";
import {
  DOCTOR_PORTRAIT_ASPECT,
  DOCTOR_PORTRAIT_OUTPUT_HEIGHT,
  DOCTOR_PORTRAIT_OUTPUT_WIDTH,
  getCroppedPortraitFile,
} from "@/lib/doctorPortraitImage";

type DoctorPortraitUploadProps = {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
};

export default function DoctorPortraitUpload({
  imageUrl,
  onImageUrlChange,
}: DoctorPortraitUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const pendingFilenameRef = useRef("doctor-photo");

  const { startUpload, isUploading } = useUploadThing("doctorImage", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) onImageUrlChange(url);
    },
    onUploadError: (e) => {
      alert(`Upload Error: ${e.message}`);
    },
  });

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const revokeAndCloseCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCropOpen(false);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }
    pendingFilenameRef.current = file.name.replace(/\.[^.]+$/, "") || "doctor-photo";
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCropOpen(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    e.target.value = "";
  };

  const confirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      alert("Adjust the crop area, then confirm.");
      return;
    }
    try {
      const file = await getCroppedPortraitFile(
        imageSrc,
        croppedAreaPixels,
        DOCTOR_PORTRAIT_OUTPUT_WIDTH,
        DOCTOR_PORTRAIT_OUTPUT_HEIGHT,
        pendingFilenameRef.current
      );
      revokeAndCloseCrop();
      await startUpload([file]);
    } catch (err) {
      console.error(err);
      alert("Could not crop or upload the image. Try another file.");
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickFile}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading…" : "Choose photo"}
        </button>
        <span className="text-xs text-gray-500">
          Portrait {DOCTOR_PORTRAIT_OUTPUT_WIDTH}×{DOCTOR_PORTRAIT_OUTPUT_HEIGHT}px (3:4) — drag to
          position, then confirm
        </span>
      </div>

      {imageUrl ? (
        <div className="mt-2 h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover object-top" />
        </div>
      ) : null}

      {cropOpen && imageSrc ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-gray-900">Crop portrait</p>
                <p className="text-sm text-gray-600 mt-1">
                  Drag to reposition. Use the slider to zoom. The frame stays 3:4 like on the public
                  profile.
                </p>
              </div>
              <button
                type="button"
                onClick={revokeAndCloseCrop}
                className="text-gray-500 hover:text-gray-800 p-1"
                aria-label="Close"
              >
                <i className="fas fa-times text-lg" />
              </button>
            </div>

            <div className="relative w-full h-[min(55vh,420px)] rounded-lg overflow-hidden bg-neutral-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={DOCTOR_PORTRAIT_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={false}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={revokeAndCloseCrop}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmCrop()}
                disabled={isUploading || !croppedAreaPixels}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading…" : "Use this crop"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
