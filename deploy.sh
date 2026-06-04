#!/bin/bash
# Secretarios — Deploy Script
# Compila o frontend, envia os arquivos necessários e reinicia o serviço no VPS.

set -e

VPS_KEY="$HOME/.ssh/id_rsa_scope_deploy"
VPS_USER="root"
VPS_IP="162.240.151.36"
VPS_PORT="22022"
VPS_DIR="/home/wwsitw/apps/secretarios"
PORT="7000"

echo "=========================================================="
echo " 🚀 Iniciando o Deploy do Secretarios..."
echo "=========================================================="

echo "[1/5] Compilando o frontend React..."
npm run build

echo "[2/5] Compactando arquivos para o deploy..."
tar -czf secretarios_deploy.tar.gz dist server package.json package-lock.json .env

echo "[3/5] Criando pasta de destino na VPS se não existir..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "$VPS_USER@$VPS_IP" "mkdir -p $VPS_DIR"

echo "[4/5] Enviando arquivos para o VPS via SCP..."
scp -i "$VPS_KEY" -P "$VPS_PORT" secretarios_deploy.tar.gz "$VPS_USER@$VPS_IP:$VPS_DIR/"

echo "[5/5] Extraindo e iniciando o servidor Node na VPS..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "$VPS_USER@$VPS_IP" << EOF
    cd "$VPS_DIR"

    echo "-> Extraindo arquivos de deploy..."
    tar -xzf secretarios_deploy.tar.gz
    rm secretarios_deploy.tar.gz

    echo "-> Instalando dependências de produção..."
    npm install --omit=dev

    echo "-> Ajustando permissões..."
    chown -R wwsitw:wwsitw "$VPS_DIR"

    echo "-> Parando qualquer processo rodando na porta $PORT..."
    fuser -k $PORT/tcp 2>/dev/null || true
    sleep 2

    echo "-> Iniciando o servidor Node na porta $PORT..."
    nohup node server/index.js > "$VPS_DIR/app.log" 2>&1 &
    sleep 3

    if fuser $PORT/tcp &>/dev/null; then
        echo "-> Servidor iniciado com sucesso na porta $PORT."
    else
        echo "ERRO: O processo não subiu. Verifique os logs em $VPS_DIR/app.log"
        exit 1
    fi
EOF

rm -f secretarios_deploy.tar.gz
echo "=========================================================="
echo " 🎉 Deploy Concluído com Sucesso!"
echo "=========================================================="
