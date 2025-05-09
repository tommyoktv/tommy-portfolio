# Panduan Deployment Portfolio

## Langkah-langkah Deploy ke GitHub Pages

1. Buat repository baru di GitHub
   - Buka github.com
   - Klik "New repository"
   - Beri nama "portfolio" atau "tommyoktv.github.io"
   - Set sebagai Public
   - Create repository

2. Upload project ke GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tommyoktv/portfolio.git
   git push -u origin main
   ```

3. Aktifkan GitHub Pages
   - Buka repository settings
   - Scroll ke bagian "GitHub Pages"
   - Pilih branch "main"
   - Save

Website akan live di: https://tommyoktv.github.io/portfolio

## Custom Domain (Opsional)

1. Beli domain (contoh: dari Niagahoster/Hostinger)
2. Tambah file CNAME berisi domain kamu
3. Setup DNS di provider domain:
   - Type: CNAME
   - Name: www
   - Value: tommyoktv.github.io
