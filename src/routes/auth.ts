import { Router } from 'express'
import { register, loginDiscovery, checkEmailExists } from '../controllers/auth.controller'
import { sendRecoveryCode, verifyRecoveryCode, resetPassword } from '../controllers/auth.controller'

const router = Router()


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     description: Cria um novo usuário na plataforma.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João
 *               lastName:
 *                 type: string
 *                 example: Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', register)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login do usuário
 *     description: Realiza o login do usuário e retorna um token JWT.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginDiscovery)

/**
 * @swagger
 * /api/v1/auth/check-email:
 *   post:
 *     summary: Verificar existência de email
 *     description: Verifica se o email já está cadastrado.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Email disponível ou já cadastrado
 */
router.post('/check-email', checkEmailExists)

/**
 * @swagger
 * /api/v1/auth/recovery/send:
 *   post:
 *     summary: Enviar código de recuperação
 *     description: Envia um código de recuperação de senha para o email informado.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Código enviado
 */
router.post('/recovery/send', sendRecoveryCode)

/**
 * @swagger
 * /api/v1/auth/recovery/verify:
 *   post:
 *     summary: Verificar código de recuperação
 *     description: Verifica se o código de recuperação enviado por email é válido.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               code:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Código válido
 *       400:
 *         description: Código inválido
 */
router.post('/recovery/verify', verifyRecoveryCode)

/**
 * @swagger
 * /api/v1/auth/recovery/reset:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha do usuário usando o código de recuperação.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               code:
 *                 type: string
 *                 example: 123456
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Código inválido ou dados incorretos
 */
router.post('/recovery/reset', resetPassword)

export default router