import { Router } from 'express';
import authenticateClient from '../middlewares/auth.middleware';
import { 
  validateImageUpload, 
  rateLimitUploads, 
  handleMulterErrors 
} from '../middlewares/upload.middleware';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  upload
} from '../controllers/profile.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Buscar perfil completo do usuário
 *     description: Retorna todos os dados do perfil do usuário autenticado, incluindo relacionamentos.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: João
 *                 lastName:
 *                   type: string
 *                   example: Silva
 *                 email:
 *                   type: string
 *                   example: joao@email.com
 *                 profileImageUrl:
 *                   type: string
 *                   nullable: true
 *                   example: /uploads/profiles/1/profile-1-1692345678901.jpg
 *                 interests:
 *                   type: object
 *                   description: Dados de interesses do usuário
 *                 education:
 *                   type: object
 *                   description: Dados educacionais do usuário
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/', authenticateClient, getProfile);

/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     summary: Atualizar dados do perfil
 *     description: Atualiza os dados básicos do perfil do usuário autenticado.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - country
 *               - phoneNumber
 *               - birthDate
 *               - gender
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: João
 *               lastName:
 *                 type: string
 *                 example: Silva
 *               country:
 *                 type: string
 *                 example: Brasil
 *               phoneNumber:
 *                 type: string
 *                 example: +5511999999999
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *               gender:
 *                 type: string
 *                 example: masculino
 *               customGender:
 *                 type: string
 *                 nullable: true
 *                 example: não binário
 *               location:
 *                 type: string
 *                 example: São Paulo, SP
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil atualizado com sucesso
 *                 user:
 *                   type: object
 *                   description: Dados atualizados do usuário
 *       400:
 *         description: Dados inválidos ou ausentes
 *       401:
 *         description: Não autorizado
 */
router.put('/', authenticateClient, updateProfile);

/**
 * @swagger
 * /api/v1/profile/image:
 *   post:
 *     summary: Upload de imagem de perfil
 *     description: Faz upload de uma nova imagem de perfil. Substitui a imagem anterior se existir.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem (JPEG, PNG, WebP, máx 5MB)
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem de perfil atualizada com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     profileImageUrl:
 *                       type: string
 *                       example: /uploads/profiles/1/profile-1-1692345678901.jpg
 *       400:
 *         description: Nenhuma imagem enviada ou formato inválido
 *       401:
 *         description: Não autorizado
 *       413:
 *         description: Arquivo muito grande (máx 5MB)
 */
router.post('/image', authenticateClient, rateLimitUploads, upload.single('image'), validateImageUpload, uploadProfileImage);

/**
 * @swagger
 * /api/v1/profile/image:
 *   delete:
 *     summary: Remover imagem de perfil
 *     description: Remove a imagem de perfil atual do usuário autenticado.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Imagem removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem de perfil removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não possui imagem de perfil
 */
router.delete('/image', authenticateClient, deleteProfileImage);

// Middleware de tratamento de erros do multer
router.use(handleMulterErrors);

export default router;
