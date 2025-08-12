import { useEffect, useState } from 'react';
import RankingGanhoSeguidores from '../components/sections/RankingGanhoSeguidores';
import RankingInstagram from '../components/sections/RankingInstagram';
import RankingInstagram2 from '../components/sections/RankingInstagram2';
import RankingFacebook from '../components/sections/RankingFacebook';
import RankingTwitter from '../components/sections/RankingTwitter';
import CoverRelatorioImage from '../assets/cover_Relatorio.svg';
import EndPageRelatorioImage from '../assets/endpage_Relatorio.svg';

const Print = () => {
  const [dados, setDados] = useState(null);

  // Detecta modo preview pela URL (?preview=1)
  const isPreview = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('preview');
    } catch {
      return false;
    }
  })();

  // Carrega os dados (querystring > localStorage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        setDados(JSON.parse(decodeURIComponent(data)));
        return;
      } catch (_) {}
    }
    const local = localStorage.getItem('relatorioRedes');
    if (local) {
      try {
        setDados(JSON.parse(local));
      } catch (_) {}
    }
  }, []);

  // Aguarda imagens + fontes + layout estabilizar antes de sinalizar pro Puppeteer
  useEffect(() => {
    if (!dados) return;

    const markReady = () => {
      const el = document.getElementById('pdf-ready');
      if (el) el.classList.remove('hidden');
    };

    const waitImages = async () => {
      try {
        const container = document.getElementById('pdf-content');
        if (!container) return markReady();

        const imgs = Array.from(container.querySelectorAll('img'));
        const promises = imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) {
            return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
          }
          return new Promise((resolve) => {
            const cleanup = () => {
              img.removeEventListener('load', onload);
              img.removeEventListener('error', onerror);
            };
            const onload = () => {
              cleanup();
              if (img.decode) {
                img.decode().catch(() => {}).finally(resolve);
              } else {
                resolve();
              }
            };
            const onerror = () => {
              cleanup();
              resolve();
            };
            img.addEventListener('load', onload, { once: true });
            img.addEventListener('error', onerror, { once: true });
          });
        });

        // Espera imagens e fontes (importante pra altura final dos cards)
        await Promise.all(promises);
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch {}
        }

        // um “tic” pra layout assentar
        await new Promise((r) => setTimeout(r, 120));
        window.scrollTo(0, 0);

        // Faz o auto-fit e libera o puppeteer
        autoFitSections();
        markReady();

        // Em preview, refaz ao redimensionar (com debounce simples)
        if (isPreview) {
          let _t;
          const onResize = () => {
            clearTimeout(_t);
            _t = setTimeout(() => autoFitSections(), 80);
          };
          window.addEventListener('resize', onResize);
          return () => window.removeEventListener('resize', onResize);
        }
      } catch {
        markReady();
      }
    };

    waitImages();
  }, [dados]); // eslint-disable-line

  // --------- Auto-fit por seção ----------
  const autoFitSections = () => {
    const wraps = document.querySelectorAll('.print-fit-wrap');
    wraps.forEach((wrap) => {
      const target = wrap.querySelector('.print-fit-target');
      if (!target) return;

      // limpa transform e classes de aperto
      target.style.transform = 'none';
      target.classList.remove('print-tighter', 'print-tight');

      // Se a página sinalizou “apertar” de saída, aplica aqui
      // data-tight="1" -> print-tight | "2" -> print-tight + print-tighter
      const tightLevel = target.dataset.tight;
      if (tightLevel === '1') {
        target.classList.add('print-tight');
      } else if (tightLevel === '2') {
        target.classList.add('print-tight', 'print-tighter');
      }

      // mede tamanho "natural" do conteúdo (já com eventual “aperto” inicial)
      const w0 = target.scrollWidth;
      const h0 = target.scrollHeight;
      const vw = wrap.clientWidth;
      const vh = wrap.clientHeight;

      // 1) tenta preencher a LARGURA
      let scale = vw / w0;

      // depois de escalar por largura, a altura cabe?
      if (h0 * scale > vh) {
        // aplica um aperto leve e reavalia
        if (!target.classList.contains('print-tight')) {
          target.classList.add('print-tight');
        }
        const w1 = target.scrollWidth;
        const h1 = target.scrollHeight;
        scale = vw / w1;

        if (h1 * scale > vh) {
          // aplica um aperto extra e reavalia
          if (!target.classList.contains('print-tighter')) {
            target.classList.add('print-tighter');
          }
          const w2 = target.scrollWidth;
          const h2 = target.scrollHeight;
          scale = vw / w2;

          if (h2 * scale > vh) {
            // ainda grande: cai para fit-height (sem centralizar)
            scale = vh / h2;
          }
        }
      }

      // cola no topo/esquerda (sem margens laterais “visuais”)
      target.style.transform = `scale(${scale})`;
    });
  };

  if (!dados) return <p className="text-center mt-10">Carregando relatório...</p>;

  return (
    <div id="pdf-content" className={`bg-white text-black ${isPreview ? 'preview' : ''}`}>

      {/* Página 1: Capa – sangria total */}
      <section className="print-page">
        <img src={CoverRelatorioImage} alt="Capa" className="print-full-bleed" />
      </section>

      {/* Página 2: Ganho de seguidores */}
      <section className="print-page">
        <div className="print-fit-wrap">
          <div className="print-fit-target">
            <RankingGanhoSeguidores dados={dados.rankingGanho} modoPrint />
          </div>
        </div>
      </section>

      {/* Página 3: Instagram 1 */}
      <section className="print-page">
        <div className="print-fit-wrap">
          <div className="print-fit-target footer-safe-20mm" data-tight="2">
            <RankingInstagram dados={dados.instagram} modoPrint />
          </div>
        </div>
      </section>

      {/* Página 4: Instagram 2 */}
      <section className="print-page">
        <div className="print-fit-wrap">
          <div className="print-fit-target footer-safe-12mm" data-tight="2">
            <RankingInstagram2 dados={dados.instagram} modoPrint />
          </div>
        </div>
      </section>

      {/* Página 5: Facebook */}
      <section className="print-page">
        <div className="print-fit-wrap">
          <div className="print-fit-target footer-safe-14mm" data-tight="2">
            <RankingFacebook dados={dados.facebook} modoPrint />
          </div>
        </div>
      </section>

      {/* Página 6: Twitter (naturalmente mais curto; o fit preenche a largura) */}
      <section className="print-page">
        <div className="print-fit-wrap">
          <div className="print-fit-target">
            <RankingTwitter dados={dados.twitter} modoPrint />
          </div>
        </div>
      </section>

      {/* Página 7: Endpage – sangria total */}
      <section className="print-page">
        <img src={EndPageRelatorioImage} alt="Fim" className="print-full-bleed" />
      </section>

      {/* Sinalizador pro Puppeteer */}
      <div id="pdf-ready" className="hidden" />
    </div>
  );
};

export default Print;
