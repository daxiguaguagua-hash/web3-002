#!/bin/bash
# =============================================================================
# MintLedger — EC2 Ubuntu 服务器初始化脚本
# 运行: chmod +x setup-ec2.sh && sudo bash setup-ec2.sh
# =============================================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

echo "============================================"
echo "  MintLedger EC2 初始化  —  $(date)"
echo "============================================"

# ── 1. 更新系统 ──────────────────────────────────
log "更新系统..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. 安装 Docker ───────────────────────────────
log "安装 Docker..."
if command -v docker &>/dev/null; then
  warn "Docker 已存在: $(docker --version)"
else
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
  log "Docker 安装完成: $(docker --version)"
fi

# ── 3. 创建部署用户 ──────────────────────────────
DEPLOY_USER="deployer"
id "$DEPLOY_USER" &>/dev/null && warn "用户 $DEPLOY_USER 已存在" || useradd -m -s /bin/bash "$DEPLOY_USER"
usermod -aG docker "$DEPLOY_USER"
log "$DEPLOY_USER 已加入 docker 组"

# ── 4. 配置 SSH 目录 ─────────────────────────────
SSH_DIR="/home/$DEPLOY_USER/.ssh"
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"
touch "$SSH_DIR/authorized_keys"
chmod 600 "$SSH_DIR/authorized_keys"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$SSH_DIR"

# ── 5. 防火墙 ────────────────────────────────────
log "配置 UFW..."
if command -v ufw &>/dev/null; then
  ufw --force reset
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp  comment 'SSH'
  ufw allow 80/tcp  comment 'HTTP'
  ufw allow 443/tcp comment 'HTTPS'
  ufw --force enable
fi

# ── 6. Docker 日志限制（防磁盘爆满）─────────────
log "配置 Docker 日志轮转..."
cat > /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
JSON
systemctl reload docker

# ── 7. 安装常用工具 ──────────────────────────────
apt-get install -y -qq curl wget git htop

# ── 完成 ─────────────────────────────────────────
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo 'your-ec2-ip')
echo ""
echo "============================================"
log "初始化完成！接下来："
echo ""
echo "  1. 生成 SSH 密钥对（本地执行）："
echo "     ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/mintledger_deploy"
echo ""
echo "  2. 将公钥写入 EC2："
echo "     ssh ubuntu@${PUBLIC_IP} \\"
echo "       \"sudo -u deployer tee -a /home/deployer/.ssh/authorized_keys\" \\"
echo "       < ~/.ssh/mintledger_deploy.pub"
echo ""
echo "  3. 配置 GitHub Secrets："
echo "     EC2_HOST         = ${PUBLIC_IP}"
echo "     EC2_USERNAME     = deployer"
echo "     EC2_SSH_KEY      = (私钥内容，含 -----BEGIN/END 行)"
echo "     EC2_PORT         = 22"
echo "     VITE_API_BASE_URL= https://api.mintledger.app"
echo "============================================"
