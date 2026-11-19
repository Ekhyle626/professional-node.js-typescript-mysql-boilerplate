import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../dto/user.dto';

const router = Router();
const userController = new UserController();

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;