// Shrinks photos in the browser before upload, so a multi-MB phone photo
// becomes a few hundred KB. Must stay in sync with MAX_BYTES in api/blog-upload.js.

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const TARGET_BYTES = 1.2 * 1024 * 1024; // aim lower than the hard limit

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export async function prepareImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("That file is not an image.");

  // GIFs are passed through untouched (re-encoding would kill the animation).
  if (file.type === "image/gif") {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("That GIF is over 2 MB. Shrink it first (for example on ezgif.com) or use a still image.");
    }
    return { blob: file, type: "image/gif" };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Could not read that image. Try a JPEG, PNG or WebP.");
  }

  let maxSide = 1600;
  let quality = 0.86;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let blob = await toBlob(canvas, "image/webp", quality);
    // Some browsers silently ignore WebP and hand back PNG; use JPEG instead then.
    if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", quality);

    if (blob && blob.size <= TARGET_BYTES) {
      bitmap.close?.();
      return { blob, type: blob.type };
    }
    quality = Math.max(0.5, quality - 0.1);
    maxSide = Math.round(maxSide * 0.85);
  }

  bitmap.close?.();
  throw new Error("Could not shrink that image enough. Try a smaller one.");
}

export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(blob);
  });

export const altFromFilename = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/[[\]()]/g, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .slice(0, 60) || "image";
