"""
LLBot Manager — 便捷启动脚本

用法：
    python run_manager.py                    # 默认启动
    python run_manager.py --host 0.0.0.0     # 监听所有接口
    python run_manager.py --port 9090        # 自定义端口
    python run_manager.py --llbot-entry "node dist/llbot.js"  # 自定义入口
"""

import sys
from pathlib import Path

# 将 llbot_manager 加入路径
sys.path.insert(0, str(Path(__file__).parent))

from llbot_manager.main import main

if __name__ == "__main__":
    main()
