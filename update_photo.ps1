# Script para atualizar a foto de perfil do Samuel no portfólio
$src = "C:\Users\samue\.gemini\antigravity\brain\adc1a27a-85b9-48e3-9740-69a559804a16\media__1787509377530.png"
$dest = "c:\Users\samue\Desktop\portifolio\assets\Imagem.png"

if (Test-Path $src) {
    Copy-Item -Path $src -Destination $dest -Force
    Write-Host "Foto de perfil atualizada com sucesso!" -ForegroundColor Green
} else {
    Write-Warning "Imagem de origem não encontrada em: $src"
}
