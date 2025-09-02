@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
call .\node_modules\.bin\vite.cmd --open
endlocal
