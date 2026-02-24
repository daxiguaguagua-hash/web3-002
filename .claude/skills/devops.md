# DevOps Deployment Skill — MintLedger

你是 DevOps 部署专家，熟悉 Docker + GitHub Actions + AWS EC2 的完整部署流程。

## 技术栈

- **前端构建**：Node.js 22 + pnpm v9 + Vite 6
- **容器化**：Docker 多阶段构建，nginx:1.26-alpine 服务静态文件
- **CI/CD**：GitHub Actions，推送到 GHCR（GitHub Container Registry）
- **服务器**：AWS EC2 Ubuntu，deployer 用户运行容器

---

## 已知坑与解决方案

### 1. Node.js 版本必须用 22
`@vitejs/plugin-react@5.x` 的 engine 要求是 `^20.19.0 || >=22.12.0`。
`node:20-alpine` 拉到的实际版本可能是 20.11.x，不满足下限，构建直接报错。
**✅ 解决**：Dockerfile 固定使用 `node:22-alpine`。

### 2. pnpm 版本必须锁定到 v9
`pnpm-lock.yaml` 的 `lockfileVersion: '9.0'` 对应 pnpm v9。
如果 corepack 拉到 v10 会导致锁文件格式不兼容。
**✅ 解决**：`corepack prepare pnpm@9 --activate`。

### 3. nginx alpine 没有 curl
健康检查需要 curl，但 nginx:alpine 默认只有 wget，而 wget 在某些场景下行为不一致。
**✅ 解决**：在 Dockerfile runner 阶段加 `apk add --no-cache curl`，健康检查统一用 curl。

### 4. EC2 公钥粘贴容易出错
手动复制粘贴公钥时，`0`（数字零）和 `O`（字母O）极易混淆，导致 SSH 永远拒绝连接。
**✅ 解决**：用命令写入公钥，不要手动粘贴：
```bash
ssh-keygen -y -f ~/.ssh/私钥文件  # 先输出正确公钥
echo "公钥内容" >> ~/.ssh/authorized_keys
```
验证公钥指纹是否一致：
```bash
ssh-keygen -y -f ~/.ssh/私钥文件  # 本地
cat ~/.ssh/authorized_keys         # 服务器
# 对比两者内容是否完全一致
```

### 5. deployer 用户必须先初始化
GitHub Actions 用 `deployer` 用户 SSH 登录，但这个用户需要手动跑 `setup-ec2.sh` 创建。
没跑脚本直接触发流水线，SSH 会立刻失败。
**✅ 解决**：按顺序操作：
1. 先 SSH 进 EC2（用 ubuntu 用户）
2. 传并运行 `setup-ec2.sh`
3. 把公钥写入 `/home/deployer/.ssh/authorized_keys`
4. 再触发流水线

### 6. ubuntu 用户也需要加入 docker 组
`setup-ec2.sh` 只把 deployer 加入了 docker 组，ubuntu 用户默认没有 docker 权限。
**✅ 解决**：
```bash
sudo usermod -aG docker ubuntu
# 退出重新登录后生效
```

### 7. 健康检查 start-period 和循环时间要匹配
Docker 的 `--health-start-period=30s` 表示容器启动后 30 秒内不判定为 unhealthy。
如果流水线的循环等待时间不够长，会在 start-period 结束前就超时报错。
**✅ 解决**：用 `until` 循环替代固定次数循环，最多等 120 秒，一旦 healthy 立刻继续：
```bash
SECONDS=0
until [ "$(docker inspect --format='{{.State.Health.Status}}' "$NEW")" = "healthy" ]; do
  if [ $SECONDS -ge 120 ]; then
    echo "❌ 健康检查超时，回滚"
    docker stop "$NEW" && docker rm "$NEW"
    exit 1
  fi
  echo "  等待中... ${SECONDS}s / 120s"
  sleep 3
done
```

### 8. 端口冲突导致新容器启动失败
流水线先启动新容器再停旧容器，如果旧容器还在占用 80 端口，新容器会报 `port is already allocated`。
**✅ 解决**：先停所有占用目标端口的容器，再启动新容器：
```bash
OLD_CONTAINERS=$(docker ps -q --filter "publish=80" || true)
if [ -n "$OLD_CONTAINERS" ]; then
  docker stop $OLD_CONTAINERS && docker rm $OLD_CONTAINERS
fi
```

### 9. EC2 安全组必须同时开放 22 和 80
AWS 安全组默认只开了 22（SSH），HTTP 的 80 端口需要手动添加入站规则。
如果只开 80 忘记保留 22，SSH 会断开。
**✅ 解决**：入站规则同时保留：
- SSH TCP 22 0.0.0.0/0
- HTTP TCP 80 0.0.0.0/0

---

## 标准部署流程

```
1. 本地生成 SSH 密钥对
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/mintledger_deploy

2. SSH 进 EC2（ubuntu 用户）
   ssh -i ~/.ssh/ubuntu_key ubuntu@EC2_IP

3. 运行初始化脚本
   sudo bash ~/setup-ec2.sh

4. 写入 deployer 公钥
   echo "公钥内容" > /home/deployer/.ssh/authorized_keys

5. 配置 GitHub Secrets
   EC2_HOST / EC2_USERNAME=deployer / EC2_SSH_KEY / EC2_PORT=22 / VITE_API_BASE_URL

6. git push → Actions 自动构建部署
```

## 使用方式
/devops 或 /devops --debug
