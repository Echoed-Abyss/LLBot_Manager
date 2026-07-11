#!/bin/bash
set -e

echo "============================================================"
echo "  LLBot Manager — Cython + PyInstaller 构建 (Linux)"
echo "============================================================"

# 检查 Node.js 版本
echo ""
echo "[0.1/6] 检查 Node.js 版本..."
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ -z "$NODE_VERSION" ]; then
    echo "  [ERROR] Node.js 未安装，请安装 Node 22+"
    exit 1
elif [ "$NODE_MAJOR" -lt 20 ]; then
    echo "  [WARN] Node.js 版本过低: $NODE_VERSION (需要 >= 20)"
    echo "  尝试安装 Node 22..."
    apt-get update -qq
    apt-get install -y -qq ca-certificates curl gnupg > /dev/null
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg 2>/dev/null
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq nodejs > /dev/null
    NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    echo "  Node.js 已更新: $NODE_VERSION"
else
    echo "  Node.js 版本: $NODE_VERSION ✓"
fi

# 检查系统依赖
echo ""
echo "[0.2/6] 检查系统依赖..."
MISSING_DEPS=""
if ! command -v gcc &> /dev/null; then MISSING_DEPS="$MISSING_DEPS gcc"; fi
if ! command -v python3 &> /dev/null; then MISSING_DEPS="$MISSING_DEPS python3"; fi
if ! command -v python3-venv &> /dev/null 2>/dev/null && ! python3 -c "import venv" 2>/dev/null; then
    MISSING_DEPS="$MISSING_DEPS python3-venv"
fi

if [ -n "$MISSING_DEPS" ]; then
    echo "  缺少系统依赖，正在安装: $MISSING_DEPS"
    apt-get update -qq
    apt-get install -y -qq $MISSING_DEPS python3-pip python3-dev build-essential > /dev/null
    echo "  系统依赖安装完成"
else
    echo "  系统依赖已满足"
fi

# 安装 Core 依赖
echo ""
echo "[1/6] 安装 Core 依赖 (npm install)..."
if [ -d "Core" ] && [ -f "Core/package.json" ]; then
    cd Core
    npm install --no-audit --no-fund
    cd ..
    echo "  Core 依赖安装完成"
else
    echo "  [SKIP] Core 目录不存在，跳过"
fi

# 创建/验证虚拟环境
echo ""
echo "[2/6] 创建 Python 虚拟环境..."
if [ ! -d ".venv" ] || [ ! -f ".venv/bin/activate" ]; then
    echo "  正在创建虚拟环境..."
    rm -rf .venv  # 清理损坏的
    python3 -m venv .venv
    echo "  虚拟环境已创建: .venv/"
else
    echo "  虚拟环境已存在: .venv/"
fi

# 激活虚拟环境
source .venv/bin/activate
echo "  已激活虚拟环境"

# 安装 Python 依赖
echo ""
echo "[3/6] 安装 Python 构建依赖..."
pip install --quiet --upgrade pip
pip install --quiet cython pyinstaller setuptools fastapi "uvicorn[standard]" pydantic psutil
echo "  Python 依赖安装完成"

# Cython 编译
echo ""
echo "[4/6] Cython 编译（源码 → 原生机器码）..."
python compile_cython.py

# PyInstaller 打包
echo ""
echo "[5/6] PyInstaller 打包..."
python -m PyInstaller llbot_manager.spec --clean --noconfirm

# 清理
echo ""
echo "[6/6] 清理临时文件..."
rm -rf build

echo ""
echo "============================================================"
echo "  构建完成！"
echo "  输出: dist/llbot_manager/llbot_manager"
echo "============================================================"
echo ""
echo "直接运行:"
echo "  ./dist/llbot_manager/llbot_manager --host 0.0.0.0 --port 8080"
echo ""
echo "或使用虚拟环境中的 Python 运行源码:"
echo "  source .venv/bin/activate"
echo "  python run_manager.py --host 0.0.0.0 --port 8080"