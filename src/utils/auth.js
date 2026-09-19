// Local User Account Manager for grrmondays
const STORAGE_USER_KEY = 'grrmondays_user_account_v1';
const STORAGE_USERS_LIST_KEY = 'grrmondays_registered_users_v1';

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const registerUser = ({ username, email, password, avatarColor = '#10b981' }) => {
  const users = getRegisteredUsers();
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Check if username or email already exists
  const existingUser = users.find(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() || (cleanEmail && u.email.toLowerCase() === cleanEmail)
  );

  if (existingUser) {
    throw new Error('An account with this username or email already exists.');
  }

  const newUser = {
    id: 'user_' + Date.now(),
    username: cleanUsername,
    email: cleanEmail,
    password, // Stored locally
    avatarColor,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));

  // Auto-login new account
  const sessionUser = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    avatarColor: newUser.avatarColor,
    createdAt: newUser.createdAt,
  };
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(sessionUser));

  return sessionUser;
};

export const loginUser = ({ usernameOrEmail, password }) => {
  const users = getRegisteredUsers();
  const query = usernameOrEmail.trim().toLowerCase();

  const user = users.find(
    (u) =>
      (u.username.toLowerCase() === query || u.email.toLowerCase() === query) &&
      u.password === password
  );

  if (!user) {
    throw new Error('Invalid username/email or password.');
  }

  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarColor: user.avatarColor || '#10b981',
    createdAt: user.createdAt,
  };
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_USER_KEY);
};

export const updateCurrentProfile = (updates) => {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getRegisteredUsers();
  const updatedUser = { ...current, ...updates };

  const updatedList = users.map((u) => (u.id === current.id ? { ...u, ...updates } : u));
  localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(updatedList));
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};
