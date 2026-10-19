import React, { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({ image, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = async (_, croppedAreaPixels) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = image;

    await new Promise((resolve) => (img.onload = resolve));

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      onCropDone(blob);
    }, "image/jpeg");
  };

  return (
    <div className="relative w-full h-64 bg-black">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}