# 🚀 Configuração de Deploy Automatizado

Este projeto inclui uma pipeline de CI/CD que automaticamente faz deploy no seu VPS sempre que você fizer push para a branch `main`.

## 📋 Pré-requisitos

1. **VPS Linux** com acesso SSH
2. **Git** instalado no VPS
3. **Node.js 22+** instalado no VPS
4. **npm** instalado no VPS
5. **Projeto clonado** no VPS

## 🔑 Configuração dos Secrets no GitHub

Vá em **Settings > Secrets and variables > Actions** no seu repositório GitHub e adicione os seguintes secrets:

### Secrets Obrigatórios:

| Nome | Descrição | Exemplo |
|------|-----------|---------|
| `VPS_HOST` | IP ou domínio do seu VPS | `192.168.1.100` ou `meusite.com` |
| `VPS_USERNAME` | Usuário SSH do VPS | `ubuntu`, `root`, `deploy` |
| `VPS_SSH_KEY` | Chave SSH privada | Conteúdo completo da chave privada |
| `VPS_PROJECT_PATH` | Caminho completo para o projeto no VPS | `/var/www/cultura-connect` |

### Secrets Opcionais:

| Nome | Descrição | Padrão |
|------|-----------|--------|
| `VPS_PORT` | Porta SSH customizada | `22` |
| `VPS_BACKUP_PATH` | Diretório para backups | `/tmp/cultura-connect-backups` |

## 🔧 Configuração da Chave SSH

### 1. Gerar chave SSH (se não tiver):

```bash
ssh-keygen -t rsa -b 4096 -C "deploy@cultura-connect"
```

### 2. Copiar chave pública para o VPS:

```bash
ssh-copy-id usuario@seu-vps.com
```

### 3. Adicionar chave privada no GitHub:

```bash
# Mostrar a chave privada
cat ~/.ssh/id_rsa

# Copie TODO o conteúdo (incluindo -----BEGIN/END-----) e cole no secret VPS_SSH_KEY
```

## 📁 Configuração do VPS

### 1. Clonar o repositório no VPS:

```bash
# Navegue para o diretório web (exemplo: /var/www)
cd /var/www

# Clone o repositório
git clone https://github.com/CulturaConnect/cultura-connect.git

# Entre no diretório
cd cultura-connect

# Instale as dependências
npm ci

# Faça o primeiro build
npm run build
```

### 2. Configurar permissões:

```bash
# Dar permissões adequadas
sudo chown -R www-data:www-data /var/www/cultura-connect
chmod -R 755 /var/www/cultura-connect
```

### 3. Configurar servidor web (Nginx):

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    root /var/www/cultura-connect/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
    
    # Compressão
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔄 Como Funciona

1. **Push para main** → Trigger da pipeline
2. **Testes e Build** → Verifica se o código compila
3. **Deploy SSH** → Conecta no VPS e executa:
   - 📦 Backup da versão atual
   - 📥 Git pull das mudanças
   - 📦 Instala/atualiza dependências se necessário
   - 🔨 Build do projeto
   - 🔄 Reinicia serviços (se configurado)

## ⚙️ Personalizações

### Reiniciar serviços automaticamente:

Descomente as linhas necessárias no arquivo `.github/workflows/deploy.yml`:

```yaml
# Para Nginx
sudo systemctl reload nginx

# Para PM2
pm2 restart all

# Para Apache
sudo systemctl reload apache2

# Para Docker
docker-compose restart web
```

### Executar deploy manual:

1. Vá em **Actions** no GitHub
2. Selecione **Deploy to VPS**
3. Clique em **Run workflow**

## 🛠️ Troubleshooting

### Erro de conexão SSH:

- Verifique se a chave SSH está correta
- Confirme o IP/hostname do VPS
- Teste a conexão manual: `ssh usuario@vps`

### Erro de permissões:

```bash
# No VPS, ajustar permissões
sudo chown -R $USER:$USER /var/www/cultura-connect
chmod -R 755 /var/www/cultura-connect
```

### Build falhou:

- Verifique se o Node.js está instalado no VPS
- Confirme se as dependências foram instaladas
- Teste o build manual: `npm run build`

## 📊 Monitoramento

Os logs da pipeline ficam disponíveis em:
- **GitHub Actions** → **Actions** tab → Workflow runs

O deploy inclui informações úteis:
- ✅ Status do deploy
- 📊 Estatísticas do build
- 🔗 Commit deployado
- ⏰ Horário do deploy

## 🚨 Rollback

Se algo der errado, você pode fazer rollback:

```bash
# No VPS, restaurar backup anterior
cd /var/www/cultura-connect
cp -r /tmp/cultura-connect-backups/dist_backup_[DATA] dist/
```

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no GitHub Actions
2. Teste a conexão SSH manualmente
3. Confirme as permissões no VPS
4. Verifique se todos os serviços estão funcionando