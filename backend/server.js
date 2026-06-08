const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const dataFolder = path.join(__dirname, 'data');
const passwordsFile = path.join(dataFolder, 'passwords.json');
const usersFile = path.join(dataFolder, 'users.json');
const port = parseInt(process.env.PORT, 10) || 5600;
const jwtSecret = process.env.JWT_SECRET || 'vaultx-secret';

async function readJson(filePath, defaultValue) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return defaultValue;
    }
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function createToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
    expiresIn: '2h',
  });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = await readJson(usersFile, []);
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJson(usersFile, users);

  const token = createToken(newUser);
  res.status(201).json({
    token,
    user: {
      userId: newUser.id,
      email: newUser.email,
    },
  });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = await readJson(usersFile, []);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createToken(user);
  res.json({
    token,
    user: {
      userId: user.id,
      email: user.email,
    },
  });
});

app.post('/auth/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  const users = await readJson(usersFile, []);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await writeJson(usersFile, users);

  res.json({ message: 'Password updated successfully' });
});

app.get('/auth/validate', authMiddleware, (req, res) => {
  res.json({
    user: {
      userId: req.user.userId,
      email: req.user.email,
    },
  });
});

app.get('/passwords', authMiddleware, async (req, res) => {
  const passwords = await readJson(passwordsFile, []);
  const userPasswords = passwords.filter(
    (item) => item.userId === req.user.userId
  );
  res.json(userPasswords);
});

app.post('/passwords', authMiddleware, async (req, res) => {
  const { site, username, password } = req.body;
  if (!site || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const passwords = await readJson(passwordsFile, []);
  const newPassword = {
    id: Date.now().toString(),
    site,
    username,
    password,
    userId: req.user.userId,
    createdAt: new Date().toISOString(),
  };

  passwords.push(newPassword);
  await writeJson(passwordsFile, passwords);
  res.status(201).json(newPassword);
});

app.put('/passwords/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { site, username, password } = req.body;

  if (!site || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const passwords = await readJson(passwordsFile, []);
  const index = passwords.findIndex(
    (item) => item.id === id && item.userId === req.user.userId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Password not found' });
  }

  passwords[index] = {
    ...passwords[index],
    site,
    username,
    password,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(passwordsFile, passwords);
  res.json(passwords[index]);
});

app.delete('/passwords/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const passwords = await readJson(passwordsFile, []);
  const index = passwords.findIndex(
    (item) => item.id === id && item.userId === req.user.userId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Password not found' });
  }

  passwords.splice(index, 1);
  await writeJson(passwordsFile, passwords);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
