import { Router } from 'express';
import { loginSchema } from '../validation.js';
import { AppError } from '../middleware/error.js';
import { authenticateAdmin, clearAuthCookie, setAuthCookie, signAdminToken } from '../services/auth.js';
import { requireAdmin } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (request, response, next) => {
  try {
    const { username, password } = loginSchema.parse(request.body);
    const admin = await authenticateAdmin(username, password);
    if (!admin) throw new AppError(401, 'INVALID_CREDENTIALS', '用户名或密码错误');
    setAuthCookie(response, admin);
    response.json({ data: { user: admin, token: signAdminToken(admin) } });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAdmin, (request, response) => {
  response.json({ data: request.admin });
});

authRouter.post('/logout', (_request, response) => {
  clearAuthCookie(response);
  response.status(204).send();
});
