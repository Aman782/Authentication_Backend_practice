import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controllers.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

export {router as userRoute};