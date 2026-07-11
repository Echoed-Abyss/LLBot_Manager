# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec — Cython + PyInstaller 打包配置
# 用法: py -m PyInstaller llbot_manager.spec

import os
import sys
import platform
from pathlib import Path

block_cipher = None

BASE_DIR = Path(SPECPATH)

# 收集 Cython 编译产物 + __init__.py（排除 .py 源码防止泄露）
_mgr = BASE_DIR / 'llbot_manager'
_datas = []
for _f in _mgr.iterdir():
    if _f.is_file() and _f.suffix in ('.pyd', '.so'):
        _datas.append((str(_f), 'llbot_manager'))
    elif _f.name == '__init__.py':
        _datas.append((str(_f), 'llbot_manager'))

a = Analysis(
    ['run_manager.py'],
    pathex=[str(BASE_DIR)],
    binaries=[],
    datas=_datas,
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'multipart',
        'psutil',
        'fastapi',
        'pydantic',
        'anyio._backends._asyncio',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'matplotlib',
        'numpy',
        'pandas',
        'PIL',
        'IPython',
        'jupyter',
        'notebook',
        'pytest',
    ],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='llbot_manager',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    # Windows 图标（可选）
    icon=str(BASE_DIR / 'icon.ico') if (BASE_DIR / 'icon.ico').exists() else None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='llbot_manager',
)