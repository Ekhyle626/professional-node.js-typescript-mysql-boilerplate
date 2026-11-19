import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const result = await this.userService.getAllUsers(page, limit);
    res.status(200).json({
      success: true,
      data: result,
    });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });
}