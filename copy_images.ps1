# Script para copiar as imagens do projeto Honda para a pasta assets do portfólio
$sourceDir = "C:\Users\samue\.gemini\antigravity\brain\3dc36273-c0e1-4af0-a910-03011c594a65"
$targetDir = "c:\Users\samue\Desktop\portifolio\assets"

# Garante que a pasta assets existe
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir
}

# Lista de arquivos de mídia da conversa
$files = @(
    "media__1780182706730.jpg",
    "media__1780182721055.jpg",
    "media__1780182722972.jpg",
    "media__1780182736505.jpg",
    "media__1780182745465.jpg"
)

for ($i = 0; $i -lt $files.Length; $i++) {
    $src = Join-Path $sourceDir $files[$i]
    $destName = "honda$($i + 1).jpg"
    $dest = Join-Path $targetDir $destName
    
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dest -Force
        Write-Host "Copiado: $($files[$i]) -> $destName"
    } else {
        Write-Warning "Arquivo não encontrado: $src"
    }
}
Write-Host "Cópia concluída!"
