import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "artist" | "listener" | "producer";
  avatar?: string;
  isPremium: boolean;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: User["role"]) => boolean;
  logout: () => void;
  togglePremium: () => void;
}

type AuthStore = AuthState & AuthActions;

// Load persisted state
function loadPersistedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("musiclab_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("musiclab_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("musiclab_user");
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,

  login: (email: string, _password: string) => {
    // Mock login — always succeeds
    const user: User = {
      id: 1,
      name: email.split("@")[0],
      email,
      role: "producer",
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      isPremium: false,
    };
    persistUser(user);
    set({ user, isLoggedIn: true });
    return true;
  },

  signup: (name: string, email: string, _password: string, role: User["role"]) => {
    const user: User = {
      id: Date.now(),
      name,
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      isPremium: false,
    };
    persistUser(user);
    set({ user, isLoggedIn: true });
    return true;
  },

  logout: () => {
    persistUser(null);
    set({ user: null, isLoggedIn: false });
  },

  togglePremium: () => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, isPremium: !user.isPremium };
    persistUser(updated);
    set({ user: updated });
  },
}));

// Hydrate on client side
if (typeof window !== "undefined") {
  const stored = loadPersistedUser();
  if (stored) {
    useAuthStore.setState({ user: stored, isLoggedIn: true });
  }
}
