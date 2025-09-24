import { Router } from 'express';
import { testEmailSystem, checkEmailProviders } from '../controllers/email-test.controller';

const router = Router();

/**
 * POST /api/email-test/send
 * Testa o envio de emails
 * Body: { email, name, testType? }
 */
router.post('/send', testEmailSystem);

/**
 * GET /api/email-test/providers
 * Verifica status dos provedores de email
 */
router.get('/providers', checkEmailProviders);

export default router;