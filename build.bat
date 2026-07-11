@echo off
chcp 65001 >nul
echo ============================================================
echo   LLBot Manager — Cython + PyInstaller 构建 (Windows)
echo ============================================================

echo.
echo [1/4] 安装构建依赖...
py -m pip install cython pyinstaller setuptools fastapi uvicorn pydantic psutil --quiet

echo.
echo [2/4] Cython 编译（源码 → 原生机器码）...
py compile_cython.py
if %errorlevel% neq 0 (
    echo [ERROR] Cython 编译失败
    exit /b 1
)

echo.
echo [3/4] PyInstaller 打包...
py -m PyInstaller llbot_manager.spec --clean --noconfirm
if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller 打包失败
    exit /b 1
)

echo.
echo [4/4] 清理...
if exist build_cython rmdir /s /q build_cython
if exist build rmdir /s /q build

echo.
echo ============================================================
echo   构建完成！
echo   输出: dist\llbot_manager\llbot_manager.exe
echo ============================================================
echo.
echo 使用方式:
echo   dist\llbot_manager\llbot_manager.exe --host 0.0.0.0 --port 8080
echo.
pause