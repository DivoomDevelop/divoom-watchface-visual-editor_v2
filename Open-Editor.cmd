@echo off
REM Usage: see README.md section "Windows: one-click launch (English)".
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set PORT=8765
set "DISTDIR=%~dp0dist"

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
echo  [Divoom] 预览地址: http://127.0.0.1:%PORT%/
echo  浏览器即将打开。HTTP 服务在最小化窗口中运行，关闭该窗口即可停止服务。
echo.
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
pause
endlocal
exit /b 0
