import { Router } from 'express'
import authenticateClient from '../middlewares/auth.middleware'

import { updateDiscoveryProgress, sendResume } from '../controllers/discovery.controller'

const router = Router()

router.post('/questions/update', authenticateClient, updateDiscoveryProgress );
router.post('/resume/send', authenticateClient, sendResume );

export default router