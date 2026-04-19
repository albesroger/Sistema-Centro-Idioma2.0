import type { Request, Response } from 'express';

// Mock the User model used by the controller
jest.mock('../../models/user', () => ({
  User: {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test User' }]),
  },
}));

import { getUser } from '../user';
import { User } from '../../models/user';

describe('User controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUser responde con la lista de usuarios', async () => {
    const req = {} as Request;
    const json = jest.fn();
    const res = { json } as unknown as Response;

    await getUser(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith([{ id: 1, name: 'Test User' }]);
  });
});
