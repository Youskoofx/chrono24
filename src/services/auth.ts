// Mock authentication service
// In a real application, this would be replaced with a proper authentication service like Supabase Auth

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@chronopneus.fr",
    name: "Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "user@chronopneus.fr",
    name: "Utilisateur",
    role: "user",
  },
];

// Mock authentication functions
export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find user by email
  const user = mockUsers.find((u) => u.email === email);

  // In a real app, you would verify the password hash here
  // For this mock, we'll accept any password for the mock users
  if (!user) {
    throw new Error("Identifiants incorrects");
  }

  // Store user in localStorage to persist session
  localStorage.setItem("chronopneus_user", JSON.stringify(user));

  return user;
};

export const logout = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Remove user from localStorage
  localStorage.removeItem("chronopneus_user");
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("chronopneus_user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

export const initialAuthState: AuthState = {
  user: getCurrentUser(),
  isAuthenticated: !!getCurrentUser(),
  isLoading: false,
  error: null,
};
