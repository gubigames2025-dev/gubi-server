import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = (req as any).id;
    const uploadDir = path.join(process.cwd(), 'uploads', 'profiles', userId.toString());
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).id;
    const ext = path.extname(file.originalname);
    cb(null, `profile-${userId}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceitar apenas imagens
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// GET /api/v1/profile - Buscar perfil completo
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: true,
        education: true,
        employment: true,
        skills: true,
        challenges: true,
        socioeconomic: true,
        completion: true,
        discoveryProgress: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Remover campos sensíveis
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// PUT /api/v1/profile - Atualizar dados do perfil
export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).id;
    const {
      name,
      lastName,
      country,
      phoneNumber,
      birthDate,
      gender,
      customGender,
      location
    } = req.body;

    // Validar dados obrigatórios
    if (!name || !lastName || !country || !phoneNumber || !birthDate || !gender || !location) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
        country,
        phoneNumber,
        birthDate: new Date(birthDate),
        gender,
        customGender,
        location
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        country: true,
        phoneNumber: true,
        birthDate: true,
        gender: true,
        customGender: true,
        location: true,
        profileImageUrl: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// POST /api/v1/profile/image - Upload de imagem de perfil
export const uploadProfileImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).id;

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    }

    // Construir URL da imagem
    const imageUrl = `/uploads/profiles/${userId}/${req.file.filename}`;

    // Buscar imagem anterior para deletar
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImageUrl: true }
    });

    // Atualizar usuário com nova imagem
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: imageUrl },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        profileImageUrl: true
      }
    });

    // Deletar imagem anterior se existir
    if (currentUser?.profileImageUrl) {
      const oldImagePath = path.join(process.cwd(), currentUser.profileImageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    return res.status(200).json({
      message: "Imagem de perfil atualizada com sucesso",
      user: updatedUser
    });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    
    // Deletar arquivo se houve erro
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// DELETE /api/v1/profile/image - Remover imagem de perfil
export const deleteProfileImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImageUrl: true }
    });

    if (!user?.profileImageUrl) {
      return res.status(404).json({ error: "Usuário não possui imagem de perfil" });
    }

    // Deletar arquivo físico
    const imagePath = path.join(process.cwd(), user.profileImageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Atualizar banco de dados
    await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: null }
    });

    return res.status(200).json({
      message: "Imagem de perfil removida com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
