import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add', userController.addUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/refresh', userController.refreshToken);
router.get('/me', verifyToken, userController.getMe);
router.get('/all', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUserInfo);
router.delete('/:id', userController.removeUser);

export default router;
