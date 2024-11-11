import { Router } from 'express';
import { signup, login, logout, getSession, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh-token', refreshToken);

router.get('/session', getSession);



export default router;