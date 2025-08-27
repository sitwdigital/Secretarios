// src/utils/imgToBase64.js
export async function imgToBase64(url, maxWidth = 800, quality = 0.8) {
  try {
    if (!url) return null;

    // Extrai ID do Drive
    const matchFile = url.match(/\/d\/([^/]+)\//);
    const matchParam = url.match(/id=([^&]+)/);
    const id = matchFile ? matchFile[1] : matchParam ? matchParam[1] : null;

    let proxiedUrl = url;
    if (id) {
      // 👉 passa pelo proxy para evitar CORS
      proxiedUrl = `http://localhost:4000/proxy?url=https://drive.google.com/uc?id=${id}`;
    }

    const res = await fetch(proxiedUrl);
    if (!res.ok) throw new Error(`Erro ao baixar imagem: ${res.status}`);

    const blob = await res.blob();
    const img = await createImageBitmap(blob);

    // 🔹 Calcula escala se a largura for maior que maxWidth
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 🔹 Exporta em JPEG comprimido
    return canvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.error("Erro ao converter imagem em Base64:", err);
    return null;
  }
}
