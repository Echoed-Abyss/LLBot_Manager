"""
Cython 编译脚本 — 将 llbot_manager 的 Python 源码编译为原生扩展模块

流程：
  1. 将 .py 复制为 .pyx（在 llbot_manager/ 目录中原地生成）
  2. 用 Cython 编译 .pyx → .c
  3. 用 setup.py 编译 .c → .pyd (Windows) / .so (Linux)
  4. 清理 .pyx 和 .c 文件，保留编译产物

编译后源码被编译为原生机器码，反编译极其困难。

用法：
  py compile_cython.py          # Windows
  python3 compile_cython.py     # Linux
"""

import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent
PKG_DIR = BASE_DIR / "llbot_manager"

# 需要编译的模块
MODULES = [
    "models",
    "port_manager",
    "core",
    "api",
    "main",
]


def cleanup_temp_files():
    """清理临时 .pyx 和 .c 文件"""
    for mod in MODULES:
        for ext in [".pyx", ".c"]:
            f = PKG_DIR / f"{mod}{ext}"
            if f.exists():
                f.unlink()


def main():
    print(f"{'='*50}")
    print(f"LLBot Manager — Cython 编译")
    print(f"Python: {sys.version}")
    print(f"{'='*50}")

    # 清理上次残留
    cleanup_temp_files()

    # ----------------------------------------------------------
    # Step 1: 复制 .py → .pyx
    # ----------------------------------------------------------
    print("\n[1/3] 复制源码为 .pyx ...")
    for mod in MODULES:
        py_src = PKG_DIR / f"{mod}.py"
        if not py_src.exists():
            print(f"  [SKIP] {mod}.py 不存在")
            continue
        pyx_dst = PKG_DIR / f"{mod}.pyx"
        shutil.copy2(str(py_src), str(pyx_dst))
        print(f"  {mod}.py -> {mod}.pyx")

    # ----------------------------------------------------------
    # Step 2+3: Cython 编译 + C 编译（一步完成）
    # ----------------------------------------------------------
    print("\n[2/3] Cython 编译为原生扩展 ...")

    setup_script = BASE_DIR / "_cython_build.py"
    ext_lines = []
    for mod in MODULES:
        ext_lines.append(
            f'    Extension("llbot_manager.{mod}", ["llbot_manager/{mod}.pyx"]),'
        )

    setup_content = f"""\
from setuptools import setup, Extension
from Cython.Build import cythonize

extensions = [
{chr(10).join(ext_lines)}
]

setup(
    name="llbot_manager_cython",
    ext_modules=cythonize(
        extensions,
        compiler_directives={{
            "language_level": "3",
            "boundscheck": False,
            "wraparound": False,
        }},
        quiet=True,
    ),
)
"""
    with open(setup_script, "w", encoding="utf-8") as f:
        f.write(setup_content)

    # 在项目根目录执行，确保 llbot_manager 包可被找到
    result = subprocess.run(
        [sys.executable, str(setup_script), "build_ext", "--inplace"],
        cwd=str(BASE_DIR),
        text=True,
    )

    if result.returncode != 0:
        print("[ERROR] 编译失败:")
        print(result.stderr[-2000:] if result.stderr else "")
        cleanup_temp_files()
        setup_script.unlink(missing_ok=True)
        sys.exit(1)

    # ----------------------------------------------------------
    # Step 3: 列出产物并清理
    # ----------------------------------------------------------
    print("\n[3/3] 编译产物:")
    compiled = []
    for mod in MODULES:
        found = False
        for f in PKG_DIR.iterdir():
            if f.suffix in (".pyd", ".so") and f.name.startswith(f"{mod}."):
                compiled.append(f.name)
                print(f"  llbot_manager/{f.name}")
                found = True
                break
        if not found:
            print(f"  [WARN] 未找到 {mod} 的编译产物")

    # 清理临时文件
    cleanup_temp_files()
    setup_script.unlink(missing_ok=True)

    # 清理 build/ 目录
    build_dir = BASE_DIR / "build"
    if build_dir.exists():
        shutil.rmtree(build_dir, ignore_errors=True)

    print(f"\n{'='*50}")
    print(f"编译完成！{len(compiled)} 个模块已编译为原生扩展")
    print(f"\n接下来运行 PyInstaller 打包：")
    if platform.system() == "Windows":
        print(f"  py -m PyInstaller llbot_manager.spec")
    else:
        print(f"  python3 -m PyInstaller llbot_manager.spec")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()