import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../models/user", () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

import { getUser, login } from "../user";
import { User } from "../../models/user";

const createMockResponse = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return {
    res: { json, status } as unknown as Response,
    json,
    status,
  };
};

describe("User controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getUser responde con la lista de usuarios", async () => {
    const req = {} as Request;
    const { res, json } = createMockResponse();

    (User.findAll as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: "Test User" },
    ]);

    await getUser(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith([{ id: 1, name: "Test User" }]);
  });

  it("login devuelve token cuando credenciales son correctas", async () => {
    const req = {
      body: {
        email: "test@mail.com",
        password: "123456",
      },
    } as Request;
    const { res, json, status } = createMockResponse();

    (User.findOne as jest.Mock).mockResolvedValueOnce({
      email: "test@mail.com",
      password: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce("fake-jwt-token");

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "test@mail.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed-password");
    expect(jwt.sign).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ token: "fake-jwt-token" });
  });

  it("login responde 400 si el usuario no existe", async () => {
    const req = {
      body: {
        email: "noexiste@mail.com",
        password: "123456",
      },
    } as Request;
    const { res, json, status } = createMockResponse();

    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    await login(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      msg: "Usuario no existe con email: noexiste@mail.com",
    });
  });

  it("login responde 400 si la contraseña es incorrecta", async () => {
    const req = {
      body: {
        email: "test@mail.com",
        password: "incorrecta",
      },
    } as Request;
    const { res, json, status } = createMockResponse();

    (User.findOne as jest.Mock).mockResolvedValueOnce({
      email: "test@mail.com",
      password: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await login(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      msg: "Password incorrecta incorrecta",
    });
  });
});
