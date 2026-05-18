@echo off
chcp 65001 >nul
REM Usage: see README.md section "Windows: one-click launch (English)".
REM
REM 重要：若仓库里已经有 dist 文件夹，本脚本默认不会再执行 npm run build，
REM 浏览器会一直打开「上次构建」的静态文件；在 Cursor / Git 里改了 src 之后，
REM 必须先重新构建，否则看不到最新界面逻辑。
REM   - 强制重新打包并预览:  Open-Editor.cmd rebuild
REM   - 开发时热更新（推荐）: 运行 Open-Editor-Dev.cmd，或手动 npm run dev
REM
REM 依赖：若本机无 npm / 无 node_modules / 无 Python，将尽力通过 winget 自动安装（需联网，可能弹出 UAC）。
setlocal EnableExtensions
cd /d "%~dp0"
set PORT=8765
set "DISTDIR=%~dp0dist"
set "FORCE_BUILD=0"
if /i "%~1"=="rebuild" set "FORCE_BUILD=1"
if /i "%~1"=="build" set "FORCE_BUILD=1"

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
)

if "%FORCE_BUILD%"=="1" (
  where npm >nul 2>&1 || (
    echo [Divoom] 已请求重新构建，但仍未找到 npm。
    pause
    exit /b 1
  )
  if not exist "%~dp0package.json" (
    echo [Divoom] 未找到 package.json，无法构建。
    pause
    exit /b 1
  )
  echo [Divoom] 正在执行 npm run build（强制刷新 dist^）...
  call npm run build
  if errorlevel 1 (
    echo [Divoom] 构建失败，请查看上方错误信息。
    pause
    exit /b 1
  )
  echo [Divoom] 构建完成。
)

if not exist "%DISTDIR%\index.html" (
  if exist "%~dp0package.json" (
    where npm >nul 2>&1 || (
      echo [Divoom] 未找到 npm，无法自动构建 dist。
      pause
      exit /b 1
    )
    echo [Divoom] 未检测到 dist，正在执行 npm run build...
    call npm run build
    if errorlevel 1 (
      echo [Divoom] 构建失败，请查看上方错误信息。
      pause
      exit /b 1
    )
  ) else (
    echo [Divoom] 未找到 dist\index.html，且当前目录无 package.json，无法自动构建。
    pause
    exit /b 1
  )
)

where py >nul 2>&1 && goto :serve_py
where python >nul 2>&1 && goto :serve_py
where python3 >nul 2>&1 && goto :serve_py

echo [Divoom] 未在 PATH 中找到 Python，尝试自动安装（winget）...
call :ensure_python
where py >nul 2>&1 && goto :serve_py
where python >nul 2>&1 && goto :serve_py
where python3 >nul 2>&1 && goto :serve_py

if exist "%~dp0node_modules\vite\package.json" (
  echo [Divoom] 使用 Vite 预览（端口 %PORT%）...
  cd /d "%~dp0"
  start "Divoom HTTP" /min cmd /k "chcp 65001 >nul & title Divoom Vite %PORT% & npm run preview -- --host 127.0.0.1 --port %PORT%"
  goto :open_browser
)

echo [Divoom] 错误：未找到 Python（py / python / python3），且 Vite 依赖仍未就绪。
echo 请关闭本窗口后重新打开再试一遍，或手动在「开始」菜单运行 Python 安装程序完成配置。
pause
exit /b 1

:serve_py
cd /d "%DISTDIR%"
where py >nul 2>&1 && (
  start "Divoom HTTP" /min cmd /k "chcp 65001 >nul & title Divoom 本地预览 %PORT% & py -m http.server %PORT%"
  goto :open_browser
)
where python >nul 2>&1 && (
  start "Divoom HTTP" /min cmd /k "chcp 65001 >nul & title Divoom 本地预览 %PORT% & python -m http.server %PORT%"
  goto :open_browser
)
start "Divoom HTTP" /min cmd /k "chcp 65001 >nul & title Divoom 本地预览 %PORT% & python3 -m http.server %PORT%"
goto :open_browser

:open_browser
cd /d "%~dp0"
echo.
if "%FORCE_BUILD%"=="0" if exist "%DISTDIR%\index.html" (
  echo  [Divoom] 提示: 当前直接预览 dist。若刚修改过 src 但未执行构建，请关闭后运行:
  echo           Open-Editor.cmd rebuild
  echo.
)
echo  [Divoom] 预览地址: http://127.0.0.1:%PORT%/
echo  浏览器即将打开。HTTP 服务在最小化窗口中运行，关闭该窗口即可停止服务。
echo.
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
pause
endlocal
exit /b 0

REM ---------- 子程序：确保 npm 可用 ----------
:ensure_npm
where npm >nul 2>&1 && exit /b 0
echo [Divoom] 未检测到 npm（Node.js）。尝试通过 winget 安装 Node.js LTS...
echo       若弹出 UAC 或商店窗口，请按提示同意；安装完成后本脚本会刷新常见 PATH。
where winget >nul 2>&1 || (
  echo [Divoom] 当前系统无 winget。请从 https://nodejs.org 下载并安装 Node.js LTS，然后重新运行本脚本。
  exit /b 1
)
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
call :refresh_nodejs_path
where npm >nul 2>&1 && exit /b 0
echo [Divoom] 安装后仍未找到 npm。请关闭本 CMD 窗口，重新打开后再运行（或重启电脑）。
exit /b 1

REM ---------- 子程序：安装 npm 依赖 ----------
:ensure_node_modules
if exist "%~dp0node_modules\vite\package.json" exit /b 0
echo [Divoom] 未检测到 node_modules（Vite），正在执行 npm install...
echo       首次克隆仓库时可能需要几分钟，请稍候。
cd /d "%~dp0"
call npm install
if errorlevel 1 (
  echo [Divoom] npm install 失败。请检查网络与 Node 版本（建议 18+）。
  exit /b 1
)
exit /b 0

REM ---------- 子程序：尝试安装 Python（用于 http.server 预览）----------
:ensure_python
where py >nul 2>&1 && exit /b 0
where python >nul 2>&1 && exit /b 0
where python3 >nul 2>&1 && exit /b 0
where winget >nul 2>&1 || (
  echo [Divoom] 无 winget，无法自动安装 Python。可安装 Python 3 并勾选「Add to PATH」，或确保已执行 npm install 以使用 Vite 预览。
  exit /b 1
)
echo [Divoom] 尝试通过 winget 安装 Python 3.12（含启动器 py）...
winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
call :refresh_python_path
where py >nul 2>&1 && exit /b 0
where python >nul 2>&1 && exit /b 0
where python3 >nul 2>&1 && exit /b 0
exit /b 1

REM ---------- 将常见安装路径加入当前会话 PATH（安装后同窗口立即生效）----------
:refresh_nodejs_path
if exist "%ProgramFiles%\nodejs\npm.cmd" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
for /d %%D in ("%LocalAppData%\Programs\nodejs*") do if exist "%%~D\npm.cmd" set "PATH=%%~D;%PATH%"
exit /b 0

:refresh_python_path
if exist "%LocalAppData%\Programs\Python\Python312\python.exe" set "PATH=%LocalAppData%\Programs\Python\Python312;%PATH%"
if exist "%LocalAppData%\Programs\Python\Python311\python.exe" set "PATH=%LocalAppData%\Programs\Python\Python311;%PATH%"
if exist "%ProgramFiles%\Python312\python.exe" set "PATH=%ProgramFiles%\Python312;%PATH%"
if exist "%ProgramFiles%\Python311\python.exe" set "PATH=%ProgramFiles%\Python311;%PATH%"
if exist "%LocalAppData%\Microsoft\WindowsApps\python3.exe" set "PATH=%LocalAppData%\Microsoft\WindowsApps;%PATH%"
exit /b 0
