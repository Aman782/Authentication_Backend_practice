import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controllers.js';
import { validateJWT_Token } from '../middlewares/authentication.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(validateJWT_Token, logoutUser);

export {router as userRoute};