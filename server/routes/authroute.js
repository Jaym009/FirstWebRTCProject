import express from 'express';
import isLogin from '../middleware/isLogin.js';
import { Login, Logout, Register } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/login', Login);
router.post('/signup', Register);
router.post('/logout', isLogin, Logout);

export default router;