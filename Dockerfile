# ─── Stage 1: Build ───────────────────────────────────────────────────────────
# @vitejs/plugin-react@5.1.4 requires node ^20.19.0 || >=22.12.0
# node:22-alpine 始终满足 >=22.12.0，是最安全的选择
FROM node:22-alpine AS builder

# 安装 pnpm v9（与 pnpm-lock.yaml lockfileVersion: '9.0' 严格对应）
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# 先复制依赖描述文件，充分利用 Docker 层缓存
# 只要 package.json / pnpm-lock.yaml 不变，install 层就不会重新执行
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# 复制全部源码
COPY . .

# 构建参数（可在 docker build --build-arg 或 GitHub Actions build-args 中覆盖）
ARG VITE_APP_MODE=prod
ARG VITE_API_BASE_URL=https://api.mintledger.app

ENV VITE_APP_MODE=$VITE_APP_MODE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
# 最终镜像只包含 nginx + dist 静态文件，不含 Node.js / 源码 / node_modules
FROM nginx:1.27-alpine AS runner

# 安装 curl（用于健康检查）并移除默认站点配置
RUN apk add --no-cache curl && rm /etc/nginx/conf.d/default.conf

# 注入自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/app.conf

# 从构建阶段拷贝产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 修正权限
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# 健康检查：/healthz 由 nginx.conf 定义
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
