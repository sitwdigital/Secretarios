// src/utils/imgToBase64.js
export async function imgToBase64(url) {
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

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Erro ao converter imagem em Base64:", err);
    return null;
  }
}