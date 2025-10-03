import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, lastname, email, password, credencial } = req.body;

  const user = await User.findOne({
    where: { [Op.or]: { email: email, credencial: credencial } },
  });

  if (user) {
    return res.status(400).json({
      msg: `Usuario ya existe con email: ${email} o crecencial ${credencial}`,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      lastname: lastname,
      email: email,
      password: passwordHash,
    });
    return res.json({
      msg: `User ${name} ${lastname} created successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      msg: `Existe un error al crear un usuario con el nombre ${name} ${lastname}`,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json({
      msg: `Usuario no existe con email: ${email}`,
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return res.status(400).json({
      msg: `Password incorrecta ${password}`,
    });
  }

  const token = jwt.sign(
    { email: email },
    process.env.SECRET_KEY || `Jdz237797TH1dp7zjFzM`
    //{ expiresIn: "100000" }
  );

  return res.json({ token });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  User.destroy({
    where: { id: id },
  });

  res.json({
    msg: `User ${id} deleted successfully`,
  });
};

export const getUser = async (_req: Request, res: Response) => {
  const listUser = await User.findAll();
  res.json(listUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lastname, email, rol } = req.body;

  User.update(
    {
      name: name,
      lastname: lastname,
      email: email,
      rol: rol,
    },
    {
      where: { id: id },
    }
  );

  res.json({
    msg: `User ${id} updated successfully`,
  });
};

export const loadUser = async (req: Request, res: Response) => {
  try {
    // 1. Obtener el token del encabezado de autorización
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No se proporcionó token de autenticación",
      });
    }

    // 2. Verificar y decodificar el token
    const decoded: any = jwt.verify(
      token,
      process.env.SECRET_KEY || "Jdz237797TH1dp7zjFzM"
    );

    // 3. Buscar al usuario por el email del token
    const user = await User.findOne({
      where: { email: decoded.email },
      attributes: { exclude: ["password"] }, // No devolver la contraseña
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // 4. Devolver la información del usuario
    const userData = user.get({ plain: true });

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error al cargar el usuario:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }
    return res
      .status(500)
      .json({ msg: "Error del servidor al cargar el usuario" });
  }
};
