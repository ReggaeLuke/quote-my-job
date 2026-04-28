import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

const user = ref<User | null>(null);
const authReady = ref(false);

export const useAuth = () => {
  const { $auth } = useNuxtApp();

  // Set up the listener once, shared across all composable calls
  if (!authReady.value) {
    onAuthStateChanged($auth as any, (firebaseUser) => {
      user.value = firebaseUser;
      authReady.value = true;
    });
  }

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword($auth as any, email, password);

  const logout = () => signOut($auth as any);

  return { user, authReady, login, logout };
};
