import api from './api';

export const eventService = {
  // Fetch events with query parameters (search, category, status, timeframe, sort, page)
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Fetch platform stats (homepage numbers)
  getEventStats: async () => {
    const response = await api.get('/events/stats');
    return response.data;
  },

  // Fetch single event details
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event (Admin)
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update existing event (Admin)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (Admin)
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Fetch admin dashboard stats
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
