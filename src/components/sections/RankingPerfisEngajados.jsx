// src/components/sections/RankingPerfisEngajados.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Função utilitária para gerar caminho da foto
const normalizarNome = (nome) =>
  nome
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-"); // espaços -> hífen

const getFotoPath = (nome) => `/fotos_secretarios/${normalizarNome(nome)}.jpg`;
const fallbackFoto = "/pdf-assets/instagram.png";

const RankingPerfisEngajados = ({ dados = [] }) => {
  const engajados = dados;

  return (
    <section className="bg-white rounded shadow-md overflow-hidden">
      {/* Header */}
      <div className="w-full">
        <img
          src="/src/assets/Perfismaisengajados.png"
          alt="Header Perfis Engajados"
          className="w-full"
        />
      </div>

      {/* Gráfico */}
      <div style={{ width: "100%", height: 420, padding: "1rem" }}>
        <h2 className="text-center text-lg font-semibold mb-4">
          Perfis mais engajados no Instagram
        </h2>
        <ResponsiveContainer>
          <BarChart
            data={engajados}
            margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
          >
            <XAxis
              dataKey="nome"
              angle={-20}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              dataKey="engajamento"
              type="number"
              tickFormatter={(v) => `${(v * 100).toFixed(2)}%`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v) => `${(v * 100).toFixed(2)}%`}
              labelFormatter={(label) => `Perfil: ${label}`}
            />

            <Bar dataKey="engajamento" fill="#F77737" radius={[6, 6, 0, 0]}>
              {/* Labels numéricos acima */}
              <LabelList
                dataKey="engajamento"
                formatter={(v) => `${(v * 100).toFixed(2)}%`}
                position="top"
                style={{ fontSize: 10, fill: "#333" }}
              />

              {/* Fotos acima das barras */}
              <LabelList
                dataKey="nome"
                content={(props) => {
                  const { x, y, width, value } = props;
                  if (!value) return null;
                  const fotoPath = getFotoPath(value);

                  return (
                    <image
                      href={fotoPath || fallbackFoto}
                      x={x + width / 2 - 12}
                      y={y - 35}
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%" }}
                    />
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="w-full">
        <img
          src="/pdf-assets/footer_Relatorio.png"
          alt="Footer"
          className="w-full"
        />
      </div>
    </section>
  );
};

export default RankingPerfisEngajados;
