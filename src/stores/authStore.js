import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  isSignedUp: false, // Tracks if the user has signed up
  isEmailVerified: false, // Tracks if the email is verified
  userData: null, // Stores user data

  setSignedUp: (status) => set({ isSignedUp: status }),
  setEmailVerified: (status) => set({ isEmailVerified: status }),
  setUserData: (data) => set({ userData: data }),
  clearUserData: () => set({ userData: null }),

  // Utility to determine if the user can access a route
  canAccessRoute: (route) => {
    const { isSignedUp, isEmailVerified } = get();

    if (route === "/registration") {
      return !isSignedUp; // Allow if not signed up
    }
    if (route === "/registration/emailverify") {
      return isSignedUp && !isEmailVerified; // Allow if signed up but not verified
    }
    if (route === "/registration/personalinfo") {
      return isSignedUp && isEmailVerified; // Allow if signed up and verified
    }
    return false; // Deny by default
  },
}));  

export default useAuthStore;