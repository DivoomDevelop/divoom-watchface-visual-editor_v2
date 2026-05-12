@echo off
REM Usage: see README.md section "Windows: one-click launch (English)".
REM
REM 重要：若仓库里已经有 dist 文件夹，本脚本默认不会再执行 npm run build，
REM 浏览器会一直打开「上次构建」的静态文件；在 Cursor / Git 里改了 src 之后，
REM 必须先重新构建，否则看不到最新界面逻辑。
REM   - 强制重新打包并预览:  Open-Editor.cmd rebuild
REM   - 开发时热更新（推荐）: 运行 Open-Editor-Dev.cmd，或手动 npm run dev
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set PORT=8765
set "DISTDIR=%~dp0dist"
set "FORCE_BUILD=0"
if /i "%~1"=="rebuild" set "FORCE_BUILD=1"
if /i "%~1"=="build" set "FORCE_BUILD=1"

if "%FORCE_BUILD%"=="1" (
  where npm >nul 2>&1 || (
    echo [Divoom] 已请求重新构建，但未找到 npm。请安装 Node.js 后再试。
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
      echo [Divoom] 未找到 dist，且系统 PATH 中无 npm。请先安装 Node.js，并在本目录执行:
      echo   npm install ^&^& npm run build
      echo 或将已构建的 dist 文件夹放在本脚本同一目录下。
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

if exist "%~dp0node_modules\vite\package.json" (
  echo [Divoom] 未检测到 Python，使用 Vite 预览（端口 %PORT%）...
  cd /d "%~dp0"
  start "Divoom HTTP" /min cmd /k "chcp 65001 >nul & title Divoom Vite %PORT% & npm run preview -- --host 127.0.0.1 --port %PORT%"
  goto :open_browser
)

echo [Divoom] 错误：未找到 Python（py / python / python3），也未安装 node_modules。
echo 请任选其一：安装 Python 3 并加入 PATH；或在本目录运行 npm install。
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
