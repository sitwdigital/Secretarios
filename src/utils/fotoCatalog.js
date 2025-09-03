    // src/utils/fotoCatalog.js
// Carrega T-O-D-A-S as imagens da pasta, já com URL que o <img> entende
const imported = import.meta.glob('../assets/fotos/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  as: 'url',
});

// normaliza "Orléans Brandão" -> "orleans-brandao"
export function slugifyNome(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // tira acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')      // troca tudo por hífen
    .replace(/(^-|-$)/g, '');         // trim de hífens
}

// cria um mapa: { "orleans-brandao": "blob:http.../orleans-brandao.jpg", ... }
const imageMap = {};
for (const path in imported) {
  const url = imported[path];
  const file = path.split('/').pop();          // ex: "orleans-brandao.jpg"
  const base = file.replace(/\.[^.]+$/, '');   // "orleans-brandao"
  imageMap[base] = url;
}

// Aliases opcionais (nomes “estranhos” => arquivo)
// ex.: "franca-do-macaquinho" usa a mesma foto de "franca"
const ALIASES = {
  'franca-do-macaquinho': 'franca',
  'lucilea-goncalves': 'lucilea',
};

export function fotoPorNome(nome) {
  if (!nome) return null;
  const key = slugifyNome(nome);
  const alias = ALIASES[key];
  return imageMap[alias || key] || null;
}