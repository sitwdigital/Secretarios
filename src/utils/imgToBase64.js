export async function imgToBase64(url, maxWidth = 800, quality = 0.8) {
  try {
    if (!url) return null;

    // 1. Extração robusta do ID do Google Drive
    // Formatos: /file/d/ID/view, /uc?id=ID, /open?id=ID, /d/ID
    const driveRegex = /(?:id=|d\/|folders\/|file\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(driveRegex);
    const id = match ? match[1] : null;

    let targetUrl = url;
    if (id) {
      // Converte link do Drive para link de conteúdo direto (thumbnail/uc)
      targetUrl = `https://drive.google.com/uc?id=${id}`;
    }

    // 2. Escolha do Proxy baseado no ambiente
    // Local: http://localhost:4000/proxy
    // Produção (Vercel/Outros): /api/proxy-image ou /proxy no mesmo domínio
    const isLocal = window.location.hostname.includes("localhost");
    const proxyBase = isLocal ? "http://localhost:4000" : window.location.origin;
    const proxiedUrl = `${proxyBase}${isLocal ? "/proxy" : "/api/proxy-image"}?url=${encodeURIComponent(targetUrl)}`;

    console.log(`[imgToBase64] Convertendo: ${id ? "Drive ID: " + id : url}`);

    const res = await fetch(proxiedUrl);
    if (!res.ok) {
      throw new Error(`Falha no proxy (${res.status}): ${await res.text().catch(() => "")}`);
    }

    // 3. Validar se o retorno é realmente uma imagem
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("image")) {
      console.warn(`[imgToBase64] URL não retornou uma imagem válida (${contentType}):`, targetUrl);
      return null;
    }

    const blob = await res.blob();
    const img = await createImageBitmap(blob);

    // 4. Redimensionamento e Conversão para Base64
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg", quality);
    console.log(`[imgToBase64] Sucesso: ${targetUrl.substring(0, 50)}...`);
    return base64;
  } catch (err) {
    console.warn("[imgToBase64] Erro na conversão:", err.message);
    return null;
  }
}