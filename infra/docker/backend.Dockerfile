FROM node:20-alpine AS builder
# 以 Node.js 20 的 Alpine Linux 版本作为基础镜像。


WORKDIR /app
# 设置容器内的工作目录，后续所有命令都在 /app 里执行。


COPY package*.json ./
RUN npm ci
# 先只复制 package.json 和 package-lock.json，再安装依赖。
# 这样利用 Docker 的层缓存：如果 package.json 没变，这一层直接用缓存，不重新 npm install，大幅加快构建速度。

# npm ci 比 npm install 更严格，严格按照 package-lock.json 安装，保证每次结果一致。


COPY . .
RUN npm run build
# 复制所有源码，执行 npm run build，把 TypeScript 编译成 JavaScript，输出到 dist/ 目录。

# 现在第一阶段（builder）已经准备好了编译后的代码和生产依赖，接下来第二阶段构建最终运行的镜像。
FROM node:20-alpine
# 第二阶段重新从干净的基础镜像开始，不带第一阶段的源码和开发依赖。

WORKDIR /app

ENV NODE_ENV=production
# 设置环境变量为 production，影响：日志级别、错误信息详细程度、某些库的行为。


COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
# 从第一阶段（builder）复制 package.json，只安装生产依赖（不装 devDependencies），镜像更小。


COPY --from=builder /app/dist ./dist
# 从第一阶段复制编译好的 dist/ 目录，这是真正要运行的代码。


EXPOSE 3000
CMD ["node", "dist/main"]
# EXPOSE 声明容器监听 3000 端口（文档用途）。
# CMD 是容器启动时执行的命令，直接用 node 运行编译后的入口文件。