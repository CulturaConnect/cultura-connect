# 🔑 Configuração Rápida dos Secrets

## Copie e cole estes comandos para configurar os secrets rapidamente:

### 1. Configure suas variáveis:

```bash
# Substitua pelos seus valores reais
VPS_HOST="192.168.1.100"           # IP ou domínio do seu VPS
VPS_USERNAME="ubuntu"               # Usuário SSH
VPS_PROJECT_PATH="/var/www/cultura-connect"  # Caminho do projeto no VPS
VPS_PORT="22"                      # Porta SSH (opcional, padrão é 22)
```

### 2. Gere a chave SSH (se não tiver):

```bash
ssh-keygen -t rsa -b 4096 -C "deploy-cultura-connect" -f ~/.ssh/cultura-connect-deploy
```

### 3. Copie a chave pública para o VPS:

```bash
ssh-copy-id -i ~/.ssh/cultura-connect-deploy.pub $VPS_USERNAME@$VPS_HOST
```

### 4. Teste a conexão:

```bash
ssh -i ~/.ssh/cultura-connect-deploy $VPS_USERNAME@$VPS_HOST
```

### 5. Configure o projeto no VPS:

```bash
# Execute no VPS
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/CulturaConnect/cultura-connect.git
sudo chown -R $USER:$USER cultura-connect
cd cultura-connect
npm ci
npm run build
```

### 6. Obtenha a chave privada para o GitHub:

```bash
cat ~/.ssh/cultura-connect-deploy
```

### 7. Adicione os secrets no GitHub:

Vá em: **Settings > Secrets and variables > Actions**

- `VPS_HOST`: Seu IP/domínio
- `VPS_USERNAME`: Seu usuário SSH
- `VPS_SSH_KEY`: Conteúdo completo da chave privada (incluindo BEGIN/END)
- `VPS_PROJECT_PATH`: `/var/www/cultura-connect`
- `VPS_PORT`: `22` (opcional)

## ✅ Checklist de Verificação:

- [ ] VPS com Linux funcionando
- [ ] Node.js 18+ instalado no VPS
- [ ] Git instalado no VPS
- [ ] Projeto clonado no VPS
- [ ] Chave SSH configurada
- [ ] Conexão SSH testada
- [ ] Secrets configurados no GitHub
- [ ] Primeiro build manual executado no VPS

## 🚀 Teste o Deploy:

1. Faça uma alteração no código
2. Commit e push para `main`
3. Acompanhe em **GitHub Actions**

## 🛠️ Comandos Úteis:

```bash
# Testar build local
npm run build

# Testar deploy local
./scripts/test-deploy.sh

# Ver logs do servidor web
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Reiniciar nginx
sudo systemctl restart nginx

# Ver status dos serviços
sudo systemctl status nginx
```