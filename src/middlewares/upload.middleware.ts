import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Validação de imagem de upload
export const validateImageUpload = (req: Request, res: Response, next: NextFunction): void => {
  // Verificar se há arquivo
  if (!req.file) {
    res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    return;
  }

  const file = req.file;

  // Validar MIME type
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(file.mimetype)) {
    res.status(400).json({ 
      error: "Tipo de arquivo não permitido. Apenas JPEG, PNG e WebP são aceitos." 
    });
    return;
  }

  // Validar tamanho (5MB = 5242880 bytes)
  if (file.size > 5 * 1024 * 1024) {
    res.status(400).json({ 
      error: "Arquivo muito grande. Tamanho máximo permitido: 5MB" 
    });
    return;
  }

  // Validar magic numbers (file signatures) para segurança adicional
  const buffer = file.buffer || require('fs').readFileSync(file.path);
  const isValidImage = validateFileSignature(buffer, file.mimetype);
  
  if (!isValidImage) {
    res.status(400).json({ 
      error: "Arquivo não é uma imagem válida ou foi corrompido" 
    });
    return;
  }

  // Sanitizar nome do arquivo
  const sanitizedName = sanitizeFileName(file.originalname);
  file.originalname = sanitizedName;

  next();
};

// Validar assinatura do arquivo para detectar arquivos maliciosos
function validateFileSignature(buffer: Buffer, mimetype: string): boolean {
  const signatures: { [key: string]: number[][] } = {
    'image/jpeg': [
      [0xFF, 0xD8, 0xFF], // JPEG
    ],
    'image/jpg': [
      [0xFF, 0xD8, 0xFF], // JPEG
    ],
    'image/png': [
      [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
    ],
    'image/webp': [
      [0x52, 0x49, 0x46, 0x46], // RIFF (WebP container)
    ]
  };

  const fileSignatures = signatures[mimetype];
  if (!fileSignatures) return false;

  return fileSignatures.some(signature => {
    if (buffer.length < signature.length) return false;
    
    return signature.every((byte, index) => {
      return buffer[index] === byte;
    });
  });
}

// Sanitizar nome do arquivo para prevenir path traversal
function sanitizeFileName(filename: string): string {
  // Remover caracteres perigosos
  const sanitized = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Substituir caracteres especiais
    .replace(/\.+/g, '.') // Remover múltiplos pontos
    .replace(/^\.+|\.+$/g, '') // Remover pontos no início e fim
    .substring(0, 100); // Limitar tamanho

  // Garantir que tem extensão
  if (!sanitized.includes('.')) {
    return sanitized + '.jpg';
  }

  return sanitized;
}

// Rate limiting para uploads (middleware simples)
const uploadAttempts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitUploads = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = (req as any).id || req.ip; // Usar ID do usuário ou IP
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxAttempts = 10; // Máximo 10 uploads por janela

  const userAttempts = uploadAttempts.get(clientId);

  if (!userAttempts || now > userAttempts.resetTime) {
    // Nova janela de tempo
    uploadAttempts.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    });
    next();
    return;
  }

  if (userAttempts.count >= maxAttempts) {
    res.status(429).json({ 
      error: "Muitas tentativas de upload. Tente novamente em alguns minutos." 
    });
    return;
  }

  // Incrementar contador
  userAttempts.count++;
  uploadAttempts.set(clientId, userAttempts);
  
  next();
};

// Middleware para tratar erros do multer
export const handleMulterErrors = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).json({ error: "Arquivo muito grande. Tamanho máximo: 5MB" });
        return;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({ error: "Muitos arquivos enviados" });
        return;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({ error: "Campo de arquivo inesperado" });
        return;
      default:
        res.status(400).json({ error: "Erro no upload do arquivo" });
        return;
    }
  }
  
  if (error.message.includes('Apenas arquivos de imagem')) {
    res.status(400).json({ error: error.message });
    return;
  }
  
  next(error);
};
