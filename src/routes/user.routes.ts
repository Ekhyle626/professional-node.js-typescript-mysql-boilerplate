import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../dto/user.dto';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.patch('/:id', authMiddleware, validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;