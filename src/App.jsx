import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/common/Footer';
import UploadRedes from './components/common/UploadRedes';

import RankingGanhoSeguidores from './components/sections/RankingGanhoSeguidores';
import RankingPerfisEngajados from './components/sections/RankingPerfisEngajados';
import SectionPublicacoes from './components/sections/SectionPublicacoes'; // 👈 import novo
import RankingInstagram from './components/sections/RankingInstagram';
import RankingInstagram2 from './components/sections/RankingInstagram2';
import RankingFacebook from './components/sections/RankingFacebook';
import RankingTwitter from './components/sections/RankingTwitter';

import CoverRelatorioImage from './assets/cover_Relatorio.svg';
import EndPageRelatorioImage from './assets/endpage_Relatorio.svg';

import ExportPDFButton from './components/common/ExportPDFButton';

const App = ({ modoPrint = false }) => {
  const [dadosExcel, setDadosExcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataUpload, setDataUpload] = useState(null);

  const sectionsRef = useRef([]);
  const endPageRef = useRef(null);

  // 🧹 Limpar chave antiga duplicada para liberar espaço no localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('relatorioSecretarias');
    } catch (e) {
      console.warn('Erro ao limpar chave antiga:', e);
    }
  }, []);

  const [historyList, setHistoryList] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  // 🧹 Limpar chave antiga duplicada para liberar espaço no localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('relatorioSecretarias');
    } catch (e) {
      console.warn('Erro ao limpar chave antiga:', e);
    }
  }, []);

  // 🔄 Carregar dados iniciais e histórico de relatórios
  useEffect(() => {
    if (modoPrint) return;

    const carregarDadosIniciais = async () => {
      setLoading(true);
      try {
        // Tenta buscar o último relatório do banco de dados MySQL
        const response = await fetch('api/latest');
        if (response.ok) {
          const data = await response.json();
          setDadosExcel(data);
          if (data.data_upload) {
            setDataUpload(new Date(data.data_upload));
          } else {
            setDataUpload(new Date());
          }
          console.log("✅ Último relatório carregado da VPS");
        } else {
          // Fallback se não houver dados no banco
          const dadosSalvos = localStorage.getItem('relatorioRedes');
          if (dadosSalvos) {
            setDadosExcel(JSON.parse(dadosSalvos));
            setDataUpload(new Date());
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar último relatório do banco, usando fallback local:", err);
        const dadosSalvos = localStorage.getItem('relatorioRedes');
        if (dadosSalvos) {
          setDadosExcel(JSON.parse(dadosSalvos));
          setDataUpload(new Date());
        }
      } finally {
        setLoading(false);
      }

      // Busca histórico de uploads para o dropdown
      try {
        const response = await fetch('api/history');
        if (response.ok) {
          const history = await response.json();
          setHistoryList(history);
        }
      } catch (err) {
        console.warn("Erro ao buscar histórico do banco:", err);
      }
    };

    carregarDadosIniciais();
  }, [modoPrint]);

  // 🔄 Ao fazer upload de uma nova planilha
  const handleUpload = (dados) => {
    setLoading(true);
    setTimeout(async () => {
      setDadosExcel(dados);
      setDataUpload(new Date());
      setLoading(false);
      setShowUpload(false);
      
      // Recarrega o seletor de histórico
      try {
        const response = await fetch('api/history');
        if (response.ok) {
          const history = await response.json();
          setHistoryList(history);
        }
      } catch (err) {
        console.warn("Erro ao recarregar histórico:", err);
      }
    }, 1000);
  };

  // 🔄 Ao selecionar um relatório do histórico
  const handleSelectReport = async (id) => {
    setLoading(true);
    try {
      let url = 'api/latest';
      if (id) {
        url = `api/report/${id}`;
        setSelectedReportId(id);
      } else {
        setSelectedReportId("");
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDadosExcel(data);
        if (data.data_upload) {
          setDataUpload(new Date(data.data_upload));
        } else {
          setDataUpload(new Date());
        }
      } else {
        alert("Não foi possível carregar o relatório.");
      }
    } catch (err) {
      console.error("Erro de rede ao carregar relatório:", err);
      alert("Erro de conexão ao carregar relatório.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Salvar dados no localStorage após upload (modo normal)
  useEffect(() => {
    if (!modoPrint && dadosExcel) {
      try {
        const dados = JSON.stringify(dadosExcel);
        localStorage.setItem('relatorioRedes', dados);
      } catch (e) {
        console.warn('Aviso: Limite do localStorage excedido ao salvar relatorioRedes:', e);
      }
    }
  }, [dadosExcel, modoPrint]);

  // 🖨 Carregar dados no modoPrint
  useEffect(() => {
    if (modoPrint) {
      try {
        const dadosSalvos = localStorage.getItem('relatorioRedes');
        if (dadosSalvos) {
          const parsed = JSON.parse(dadosSalvos);
          setDadosExcel(parsed);
          setDataUpload(new Date());
        }
      } catch (e) {
        console.error('Erro ao ler do localStorage no modo print:', e);
      }
    }
  }, [modoPrint]);

  if (modoPrint && !dadosExcel) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Carregando relatório...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen">
      {/* Barra de Histórico e Upload (Visível somente em produção, fora do print e quando há dados) */}
      {!modoPrint && dadosExcel && (
        <div className="bg-[#204181] border-b border-blue-900 py-3 px-4 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo do Header embutido para economizar espaço */}
            <div className="flex items-center gap-6">
              <span className="text-white text-lg font-bold tracking-wide">Secretários</span>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-200 uppercase font-semibold">Histórico:</span>
                <select
                  value={selectedReportId}
                  onChange={(e) => handleSelectReport(e.target.value)}
                  className="bg-blue-950 border border-blue-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer"
                >
                  <option value="">-- Último Relatório Salvo --</option>
                  {historyList.map((h) => (
                    <option key={h.id} value={h.id}>
                      Relatório de {new Date(h.data_upload).toLocaleDateString('pt-BR')} às {new Date(h.data_upload).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow"
              >
                {showUpload ? 'Ocultar Caixa de Upload' : 'Enviar Nova Planilha (Excel)'}
              </button>
            </div>
          </div>

          {showUpload && (
            <div className="max-w-md mx-auto mt-3 p-4 border border-blue-800 rounded-lg bg-blue-950 shadow-inner text-white">
              <h3 className="text-sm font-bold mb-2 text-blue-200">Upload de arquivo Excel (.xlsx)</h3>
              <UploadRedes setDados={handleUpload} />
            </div>
          )}
        </div>
      )}

      {!modoPrint && !dadosExcel && !loading && (
        <>
          <Header />
          <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-[#204181]">
              Nenhum dado cadastrado no banco de dados.
            </h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Envie a primeira planilha Excel (.xlsx) para popular o banco de dados e gerar o primeiro relatório.
            </p>
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border">
              <UploadRedes setDados={handleUpload} />
            </div>
          </main>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen text-blue-700">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <p className="text-lg font-semibold animate-pulse">Carregando dados...</p>
        </div>
      )}

      {!loading && dadosExcel && (
        <>
          {/* CAPA */}
          <div id="cover" className="relative w-full">
            <img
              src={CoverRelatorioImage}
              alt="Capa do Relatório"
              className="w-full object-cover mb-4"
            />
            {dataUpload && (
              <div className="absolute top-[500px] left-[80px] text-[30px] font-semibold text-[#0F1120]">
                {dataUpload.toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

          {/* SEÇÕES */}
          <section
            ref={(el) => (sectionsRef.current[0] = el)}
            id="ranking-top10"
            className="py-0"
          >
            <RankingGanhoSeguidores dados={dadosExcel.rankingGanho} />
          </section>

          <section
            ref={(el) => (sectionsRef.current[1] = el)}
            id="perfis-engajados"
            className="py-0"
          >
            <RankingPerfisEngajados dados={dadosExcel.perfisEngajados} />
          </section>

          {/* 👇 NOVA SEÇÃO PUBLICAÇÕES ENGAJADAS */}
          <section
            ref={(el) => (sectionsRef.current[2] = el)}
            id="publicacoes-engajadas"
            className="py-0"
          >
            <SectionPublicacoes dados={dadosExcel.publicacoesEngajadas} />
          </section>

          <section
            ref={(el) => (sectionsRef.current[3] = el)}
            id="instagram1"
            className="py-0"
          >
            <RankingInstagram dados={dadosExcel.instagram} />
          </section>

          <section
            ref={(el) => (sectionsRef.current[4] = el)}
            id="instagram2"
            className="py-0"
          >
            <RankingInstagram2 dados={dadosExcel.instagram} />
          </section>

          <section
            ref={(el) => (sectionsRef.current[5] = el)}
            id="facebook"
            className="py-0"
          >
            <RankingFacebook dados={dadosExcel.facebook} />
          </section>

          <section
            ref={(el) => (sectionsRef.current[6] = el)}
            id="twitter"
            className="py-0"
          >
            <RankingTwitter dados={dadosExcel.twitter} />
          </section>

          {/* ÚLTIMA PÁGINA */}
          <div ref={endPageRef} className="w-full">
            <img
              src={EndPageRelatorioImage}
              alt="Página Final"
              className="w-full object-cover"
            />
          </div>

          {/* BOTÃO DE EXPORTAÇÃO (React-PDF) */}
          {!modoPrint && (
            <div className="py-8 text-center bg-gray-100">
              <ExportPDFButton dados={dadosExcel} />
            </div>
          )}

          {!modoPrint && <Footer />}
        </>
      )}
    </div>
  );
};

export default App;