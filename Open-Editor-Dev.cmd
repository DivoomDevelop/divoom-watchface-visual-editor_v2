@echo off
REM 开发预览：Vite 直接编译 src，改代码后刷新页面即可看到最新逻辑。
REM 若本机无 npm 或无 node_modules，将尽力通过 winget 安装 Node、再执行 npm install。
chcp 65001 >nul
setlocal EnableExtensions
cd /d "%~dp0"
set PORT=8765

if exist "%~dp0package.json" (
  call :ensure_npm
  if errorlevel 1 (
    pause
    exit /b 1
  )
  call :ensure_node_modules
  if errorlevel 1 (
    pause
    exit /b 1
  )
) else (
  echo [Divoom] 未找到 package.json。
  pause
  exit /b 1
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

:ensure_npm
where npm >nul 2>&1 && exit /b 0
echo [Divoom] 未检测到 npm。尝试通过 winget 安装 Node.js LTS...
where winget >nul 2>&1 || (
  echo [Divoom] 无 winget，请从 https://nodejs.org 安装 Node.js LTS。
  exit /b 1
)
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
call :refresh_nodejs_path
where npm >nul 2>&1 && exit /b 0
echo [Divoom] 请关闭本窗口后重新运行本脚本。
exit /b 1

:ensure_node_modules
if exist "%~dp0node_modules\vite\package.json" exit /b 0
echo [Divoom] 正在执行 npm install...
cd /d "%~dp0"
call npm install
if errorlevel 1 exit /b 1
exit /b 0

:refresh_nodejs_path
if exist "%ProgramFiles%\nodejs\npm.cmd" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
for /d %%D in ("%LocalAppData%\Programs\nodejs*") do if exist "%%~D\npm.cmd" set "PATH=%%~D;%PATH%"
exit /b 0
