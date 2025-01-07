// stores/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isSignedUp: false, // Tracks if the user has signed up
  isEmailSent: false, // Tracks if the email has been sent
  isVerified: false, // Tracks if the email is verified
  isEmailVerified: false, // Tracks if the email is verified

  setSignedUp: () => set({ isSignedUp: true }),
  setEmailSent: () => set({ isEmailSent: true }),
  setVerified: () => set({ isVerified: true }),


userData: null,
  setUserData: (userData) => set({ userData }),
  clearUserData: () => set({ userData: null }),
  setEmailVerified: (isVerified) => set({ isEmailVerified: isVerified }),
}));

export default useAuthStore; 
