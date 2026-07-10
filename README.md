# LLBot Manager

LLBot 多实例管理器 —— 基于 Python + FastAPI 的 LLBot 多实例管理工具，支持 PMHQ 原生进程管理、自动下载、端口分配和代码保护。

## 功能

- **多实例管理**：同时管理多个 LLBot 实例，每个实例独立端口、配置和 PMHQ 进程
- **PMHQ 自动化**：原生 PMHQ 进程管理，自动从 GitHub 下载 PMHQ 二进制文件
- **RESTful API**：提供完整的 HTTP API，支持实例全生命周期管理
- **代码保护**：核心逻辑通过 Cython 编译为原生扩展模块（.pyd），配合 PyInstaller 打包
- **跨平台**：支持 Windows、Linux、macOS

## 快速开始

### Windows

1. 从 [Releases](https://github.com/Echoed-Abyss/LLBot_Manager/releases) 下载 `LLBot_Manager_Windows.zip`
2. 解压到任意目录
3. 运行 `dist/llbot_manager/llbot_manager.exe --port 9090`
4. 通过 API 创建并启动实例：

```bash
curl -X POST http://127.0.0.1:9090/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"name": "bot1"}'

curl -X POST http://127.0.0.1:9090/api/accounts/bot1/start
```

### Linux / macOS

```bash
git clone --recursive https://github.com/Echoed-Abyss/LLBot_Manager.git
cd LLBot_Manager
pip install fastapi uvicorn[standard] pydantic psutil
cd Core && npm install && cd ..
python run_manager.py --port 9090
```

## 目录结构

```
LLBot_Manager/
  dist/
    llbot_manager/          # 编译好的管理器（exe + _internal）
  Core/                     # LLBot 源码（git submodule -> LLOneBot/LuckyLilliaBot）
  app/                      # 文档站（Fumadocs / Next.js）
  content/docs/             # 文档内容（MDX）
  .github/workflows/        # GitHub Actions 自动构建部署
```

## 文档

文档站使用 [Fumadocs](https://fumadocs.dev/) 构建，推送到 main 分支后 GitHub Actions 自动构建并部署到 GitHub Pages。

## 相关项目

- [LLBot (LuckyLilliaBot)](https://github.com/LLOneBot/LuckyLilliaBot) — 协议端框架（Core 子模块）
- [PMHQ](https://github.com/linyuchen/PMHQ) — QQ 注入工具

## License

MIT
