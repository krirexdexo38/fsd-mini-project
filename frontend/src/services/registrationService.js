import api from './api';

export const registrationService = {
  // Register for an event
  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Cancel registration for an event
  cancelRegistration: async (eventId) => {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  },

  // Get current logged-in user's registrations
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  // Get participant roster for an event (Admin)
  getEventParticipants: async (eventId, params = {}) => {
    const response = await api.get(`/events/${eventId}/registrations`, { params });
    return response.data;
  },

  // Update participant attendance status (Admin)
  updateParticipantStatus: async (registrationId, status) => {
    const response = await api.patch(`/registrations/${registrationId}/status`, {
      status,
    });
    return response.data;
  },
};
