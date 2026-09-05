@echo off
rem ============================================================
rem  Launcher XlerionStoryCreator (doble clic para iniciar)
rem  - Si el puerto preferido esta ocupado, busca otro libre
rem  - Inicia el sitio y lo abre en el navegador
rem  Uso: launcher.bat [puerto]   (por defecto 5173)
rem ============================================================
setlocal enabledelayedexpansion

set "PREFERRED=%~1"
if "%PREFERRED%"=="" set "PREFERRED=5173"

echo === XlerionStoryCreator Launcher ===
echo Buscando puerto libre desde %PREFERRED%...

set "PORT="
for /f "delims=" %%p in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=%PREFERRED%; $ranges=@($s,3000,4000,5000,8000,9000); foreach ($base in $ranges) { if ($base -eq $s) { $count=500 } else { $count=200 }; for ($i=0; $i -lt $count; $i++) { $p=$base+$i; $c=New-Object Net.Sockets.TcpClient; try { $c.Connect('127.0.0.1',$p); $c.Close(); continue } catch { $c.Close() }; $l=$null; try { $l=[Net.Sockets.TcpListener]::new([Net.IPAddress]::IPv6Loopback,$p); $l.Start(); $l.Stop(); Write-Output $p; exit 0 } catch { if ($l) { $l.Stop() } } } }; exit 1"') do set "PORT=%%p"

if "%PORT%"=="" (
  echo ERROR: no se encontro ningun puerto libre.
  pause
  exit /b 1
)

if not "%PORT%"=="%PREFERRED%" (
  echo Puerto %PREFERRED% ocupado. Usando puerto libre: %PORT%
) else (
  echo Usando puerto: %PORT%
)

cd /d "%~dp0"

where php >nul 2>nul
if %errorlevel%==0 (
  echo Iniciando servidor PHP...
  echo.
  echo ============================================================
  echo   Sitio abierto en:
  echo   http://localhost:%PORT%/index.html
  echo ============================================================
  echo.
  echo Abriendo navegador...
  echo Link copiado al portapapeles.
  echo http://localhost:%PORT%/index.html| clip
  start "" "http://localhost:%PORT%/index.html"
  php -S localhost:%PORT% router.php
  echo.
  echo Servidor detenido.
  pause
  exit /b 0
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo PHP no encontrado. Iniciando servidor estatico con Python...
  echo NOTA: sin PHP no funcionan publicar, calificaciones ni comentarios.
  echo.
  echo ============================================================
  echo   Sitio abierto en:
  echo   http://localhost:%PORT%/index.html
  echo ============================================================
  echo.
  echo Abriendo navegador...
  echo Link copiado al portapapeles.
  echo http://localhost:%PORT%/index.html| clip
  start "" "http://localhost:%PORT%/index.html"
  python -m http.server %PORT%
  echo.
  echo Servidor detenido.
  pause
  exit /b 0
)

echo ERROR: no se encontro php ni python en el PATH.
pause
exit /b 1
