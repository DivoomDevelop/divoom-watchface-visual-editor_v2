import { extFromAssetPath } from "./cdnAssets.js";

const DISPLAY_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

export function templateThumbnailSources(clockId, { previewDir, backgroundDir, appImageUrl = "", remoteUrl = "", remoteFirst = false }) {
  const fileId = Number(clockId) + 1;
  if (!Number.isFinite(fileId) || fileId <= 1) return [];
  const appExt = extFromAssetPath(appImageUrl);
  const appLocal = appImageUrl && DISPLAY_EXTENSIONS.includes(appExt)
    ? [`${previewDir}${fileId}.app${appExt}`] : [];
  const local = [
    ...DISPLAY_EXTENSIONS.map((ext) => `${previewDir}${fileId}${ext}`),
    ...DISPLAY_EXTENSIONS.map((ext) => `${backgroundDir}${fileId}${ext}`)
  ];
  const remote = String(remoteUrl || "").trim();
  return remote
    ? [...appLocal, ...(remoteFirst ? [remote, ...local] : [...local, remote])]
    : [...appLocal, ...local];
}

export function setTemplateThumbnail(img, sources) {
  if (!sources.length) return;
  let index = 0;
  img.onerror = () => {
    index += 1;
    if (index < sources.length) img.src = sources[index];
    else {
      img.onerror = null;
      img.remove();
    }
  };
  img.src = sources[0];
}
