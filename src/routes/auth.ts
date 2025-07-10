import { Router } from 'express'
import { register, loginDiscovery, checkEmailExists } from '../controllers/auth.controller'
import { sendRecoveryCode, verifyRecoveryCode, resetPassword } from '../controllers/auth.controller'

const router = Router()

router.post('/register', register)
router.post('/login', loginDiscovery)

router.post('/check-email', checkEmailExists)

router.post('/recovery/send', sendRecoveryCode)
router.post('/recovery/verify', verifyRecoveryCode)
router.post('/recovery/reset', resetPassword)

export default router