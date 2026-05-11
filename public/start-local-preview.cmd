@echo off
REM See README.md -> "Windows: one-click launch (English)". Goes to repo root and runs Open-Editor.cmd.
chcp 65001 >nul
REM 在仓库根目录的 dist 上启动 HTTP 服务（勿在 public 目录下启动，否则无法打开打包后的页面）
cd /d "%~dp0.."
if not exist "Open-Editor.cmd" (
  echo [Divoom] Please double-click Open-Editor.cmd in the project root.
  pause
  exit /b 1
)
call "Open-Editor.cmd"
