@echo off
REM 开发预览：Vite 直接编译 src，改代码后刷新页面即可看到最新逻辑。
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set PORT=8765

where npm >nul 2>&1 || (
  echo [Divoom] 未找到 npm。请安装 Node.js 后在本目录执行: npm install
  pause
  exit /b 1
)

if not exist "%~dp0node_modules\vite\package.json" (
  echo [Divoom] 正在安装依赖 npm install ...
  call npm install
  if errorlevel 1 (
    echo [Divoom] npm install 失败。
    pause
    exit /b 1
  )
)

echo.
echo  [Divoom] 正在启动 Vite 开发服务器（端口 %PORT%）...
start "Divoom Vite dev" cmd /k "chcp 65001 >nul & cd /d %~dp0 & npm run dev -- --host 127.0.0.1 --port %PORT%"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
echo.
echo  [Divoom] 预览地址: http://127.0.0.1:%PORT%/
echo  Vite 在标题为「Divoom Vite dev」的窗口中运行，关闭该窗口即停止服务。
echo.
pause
endlocal
exit /b 0
