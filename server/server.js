import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Configurar dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_panini_2026_xYz';

// Resolver rutas de archivos con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, 'data', 'users.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Helpers para lectura y escritura de la base de datos JSON
function readUsersFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // Si el archivo no existe, crear directorio e inicializar vacío
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error al leer el archivo de usuarios:', error);
    return [];
  }
}

function writeUsersToFile(users) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir en el archivo de usuarios:', error);
    return false;
  }
}

// Middleware para verificar el Token JWT (Autenticación)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de seguridad.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Sesión inválida o expirada. Por favor, inicia sesión nuevamente.' });
    }
    req.userId = decoded.id;
    next();
  });
}

// 1. ENDPOINT: REGISTRO DE USUARIO (Crear Perfil)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Validación básica de campos
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos obligatorios (nombre de usuario, correo y contraseña) deben completarse.' });
    }

    const users = readUsersFromFile();

    // Validar si el correo ya existe
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado con otra cuenta.' });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo perfil de usuario
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar || '⚽',
      collection: {}, // estado vacío de láminas inicialmente
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersToFile(users);

    // Generar Token JWT (válido por 30 días)
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '30d' });

    // Devolver perfil sin la contraseña
    const { password: _, ...userProfile } = newUser;
    res.status(201).json({
      message: '¡Perfil de usuario creado con éxito! 🎉',
      token,
      profile: userProfile
    });

  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({ error: 'Error del servidor al procesar el registro.' });
  }
});

// 2. ENDPOINT: INICIO DE SESIÓN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Debes proporcionar el correo y la contraseña.' });
    }

    const users = readUsersFromFile();

    // Buscar al usuario
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'El correo electrónico o la contraseña son incorrectos.' });
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'El correo electrónico o la contraseña son incorrectos.' });
    }

    // Generar Token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Retornar perfil
    const { password: _, ...userProfile } = user;
    res.json({
      message: '¡Inicio de sesión exitoso! Bienvenido de vuelta ⚽',
      token,
      profile: userProfile
    });

  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({ error: 'Error del servidor al procesar el inicio de sesión.' });
  }
});

// 3. ENDPOINT: OBTENER PERFIL DE USUARIO (Protegido)
app.get('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const { password: _, ...userProfile } = user;
    res.json(userProfile);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error del servidor al obtener la información de perfil.' });
  }
});

// 4. ENDPOINT: ACTUALIZAR DATOS DE PERFIL (Protegido)
app.put('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const { username, avatar } = req.body;
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Actualizar campos permitidos
    if (username) users[userIndex].username = username;
    if (avatar) users[userIndex].avatar = avatar;

    writeUsersToFile(users);

    const { password: _, ...updatedProfile } = users[userIndex];
    res.json({
      message: '¡Datos de perfil actualizados correctamente! ⚙️',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar el perfil.' });
  }
});

// 5. ENDPOINT: SINCRONIZAR PROGRESO DEL ÁLBUM (Subir Colección) (Protegido)
app.post('/api/users/sync', authenticateToken, (req, res) => {
  try {
    const { collection } = req.body;

    if (!collection || typeof collection !== 'object') {
      return res.status(400).json({ error: 'Datos de colección inválidos o vacíos.' });
    }

    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Guardar el estado de la colección
    users[userIndex].collection = collection;
    writeUsersToFile(users);

    res.json({
      message: '¡Progreso del álbum sincronizado con éxito en la nube! ☁️',
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al sincronizar colección:', error);
    res.status(500).json({ error: 'Error del servidor al guardar el progreso.' });
  }
});

// 6. ENDPOINT: DESCARGAR PROGRESO DEL ÁLBUM (Bajar Colección) (Protegido)
app.get('/api/users/sync', authenticateToken, (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({
      collection: user.collection || {}
    });

  } catch (error) {
    console.error('Error al descargar sincronización:', error);
    res.status(500).json({ error: 'Error del servidor al descargar el progreso del álbum.' });
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 SERVIDOR DE CORRESPONDENCIA LEVANTADO CON ÉXITO`);
  console.log(`🌐 Servidor escuchando en: http://localhost:${PORT}`);
  console.log(`📁 Base de datos local: ${DATA_FILE_PATH}`);
  console.log(`===================================================`);
});
