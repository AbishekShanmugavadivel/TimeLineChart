import accessService from './accessService';

export const authService = {
  login: async (credentials) => {
    return accessService.verifyAccess(credentials.code || credentials.password);
  },
  refreshToken: async () => {
    return accessService.getStatus();
  },
  logout: async () => {
    return accessService.logout();
  },
  getMe: async () => {
    return accessService.getProfile();
  },
  updateProfile: async (profileData) => {
    return accessService.updateProfile(profileData);
  }
};

export default authService;
