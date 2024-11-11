import { Request, Response, NextFunction } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import supabase from '../config/supabaseCLient';

jest.mock('../config/supabaseCLient');

describe('Auth Middleware', () => {
  const req = { headers: { authorization: 'Bearer token' } } as Request;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
  const next = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass when user is authenticated', async () => {
    const user = { id: '1' };  // Mock user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user } });

    await authMiddleware(req, res, next);

    expect(supabase.auth.getUser).toHaveBeenCalledWith('token');
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const reqWithoutToken = { headers: {} } as Request;

    await authMiddleware(reqWithoutToken, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 if token is invalid', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ error: 'Invalid token' });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});
