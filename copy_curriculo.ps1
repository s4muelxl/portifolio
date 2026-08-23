# Script para copiar o currículo PDF para a pasta assets do portfólio
$src = "C:\Users\samue\Desktop\assets portifolio\curriculo_samuel_alves_dev_v2.pdf"
$destDir = "c:\Users\samue\Desktop\portifolio\assets"
$destFile = "c:\Users\samue\Desktop\portifolio\assets\curriculo_samuel_alves_dev_v2.pdf"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
}

if (Test-Path $src) {
    Copy-Item -Path $src -Destination $destFile -Force
    Write-Host "Currículo copiado com sucesso para $destFile!" -ForegroundColor Green
} else {
    Write-Warning "Arquivo de currículo não encontrado em: $src"
}
