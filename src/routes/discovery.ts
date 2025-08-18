import { Router } from 'express'
import authenticateClient from '../middlewares/auth.middleware'

import { updateDiscoveryProgress, sendResume } from '../controllers/discovery.controller'

const router = Router()


/**
 * @swagger
 * /api/v1/discovery/questions/update:
 *   post:
 *     summary: Atualizar progresso do Discovery
 *     description: Atualiza o progresso do usuário nas perguntas do Discovery. Requer autenticação via token JWT.
 *     tags:
 *       - Discovery
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["resposta 1", "resposta 2", "resposta 3"]
 *     responses:
 *       200:
 *         description: Progresso atualizado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/questions/update', authenticateClient, updateDiscoveryProgress );

/**
 * @swagger
 * /api/v1/discovery/resume/send:
 *   post:
 *     summary: Enviar resumo do Discovery
 *     description: Gera e envia o resumo do progresso do usuário no Discovery. Requer autenticação via token JWT.
 *     tags:
 *       - Discovery
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 example: "Resumo gerado pelo sistema para o usuário."
 *     responses:
 *       200:
 *         description: Resumo enviado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/resume/send', authenticateClient, sendResume );

export default router