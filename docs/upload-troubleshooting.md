# 🔧 Troubleshooting - Upload de Imagens

## ❌ Problemas Comuns

### "Nenhuma imagem foi enviada"
**Causa:** Campo `image` não foi enviado no multipart/form-data

**Solução:**
```bash
# ✅ Correto
curl -X POST http://localhost:3001/api/v1/profile/image \
  -H "Authorization: Bearer {token}" \
  -F "image=@minha-foto.jpg"

# ❌ Incorreto
curl -X POST http://localhost:3001/api/v1/profile/image \
  -H "Authorization: Bearer {token}" \
  -F "file=@minha-foto.jpg"
```

### "Tipo de arquivo não permitido"
**Causa:** Arquivo não é JPEG, PNG ou WebP

**Solução:**
- Converter imagem para formato suportado
- Verificar extensão do arquivo
- Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`

### "Arquivo muito grande"
**Causa:** Imagem excede 5MB

**Solução:**
```bash
# Reduzir tamanho com ImageMagick
convert input.jpg -quality 80 -resize 800x800> output.jpg

# Verificar tamanho do arquivo
ls -lh minha-foto.jpg
```

### "Arquivo não é uma imagem válida"
**Causa:** File signature (magic numbers) não corresponde ao MIME type

**Solução:**
- Verificar se arquivo não foi corrompido
- Recriar imagem em software confiável
- Evitar renomear extensões manualmente

### "Token inválido ou expirado"
**Causa:** JWT não foi enviado ou expirou

**Solução:**
```bash
# Fazer login novamente para obter novo token
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"senha123"}'
```

### "Muitas tentativas de upload"
**Causa:** Rate limiting ativado (>10 uploads em 15 minutos)

**Solução:**
- Aguardar 15 minutos
- Reduzir frequência de uploads
- Verificar se não há loop de uploads

---

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente Necessárias
```env
# Obrigatórias
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="seu_jwt_secret_complexo"
PORT=3001
```

### Permissões de Pasta
```bash
# Criar pasta de uploads com permissões corretas
mkdir -p uploads/profiles
chmod 755 uploads/
chmod 755 uploads/profiles/
```

### Storage em Produção
```bash
# Para deploy no Vercel - usar Vercel Blob
npm install @vercel/blob

# Para AWS S3
npm install aws-sdk @types/aws-sdk
```

---

## 🚨 Logs de Erro

### Padrões de Log para Debug

#### Upload bem-sucedido
```
[INFO] Upload successful: userId=123, file=profile-123-1692345678901.jpg, size=2.1MB
```

#### Arquivo rejeitado
```
[WARN] File rejected: userId=123, reason=invalid_mime_type, file=documento.pdf
```

#### Erro interno
```
[ERROR] Upload failed: userId=123, error=filesystem_error, details=Permission denied
```

### Verificação de Logs
```bash
# Logs do servidor
tail -f server.log | grep "upload"

# Verificar espaço em disco
df -h

# Verificar permissões de pasta
ls -la uploads/profiles/
```

---

## ⚡ Performance

### Otimizações Recomendadas

#### Cliente (Frontend)
```javascript
// Redimensionar antes do upload
function resizeImage(file, maxWidth = 800, quality = 0.8) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise(resolve => {
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

#### Servidor (Backend)
```typescript
// Adicionar compressão automática
import sharp from 'sharp';

const compressImage = async (inputPath: string, outputPath: string) => {
  await sharp(inputPath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .png({ quality: 80 })
    .toFile(outputPath);
};
```

---

## 🔐 Segurança Avançada

### Validações Extras
```typescript
// Verificar metadados EXIF maliciosos
import ExifReader from 'exifreader';

const validateImageMetadata = (buffer: Buffer): boolean => {
  try {
    const tags = ExifReader.load(buffer);
    // Verificar tags suspeitas
    return !tags.Software?.description?.includes('malware');
  } catch {
    return true; // Se não conseguir ler, permitir
  }
};
```

### Sandbox de Upload
```bash
# Executar validação em container isolado
docker run --rm -v /tmp/upload:/upload alpine:latest \
  sh -c "file /upload/image.jpg && echo 'Safe'"
```

---

## 📞 Suporte Técnico

### Informações para Reportar Bugs
1. **ID do usuário** que teve problema
2. **Timestamp** do erro
3. **Tamanho e formato** do arquivo
4. **Logs de erro** completos
5. **Steps to reproduce** o problema

### Contato
- **Issues:** GitHub Issues do repositório
- **Logs:** Sempre incluir logs relevantes
- **Screenshots:** Se for problema de UI
