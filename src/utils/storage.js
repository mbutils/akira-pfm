// Storage utilities for persistent data
export const storage = {
  async get(key) {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.log('Key not found:', key);
      return null;
    }
  },
  
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  async delete(key) {
    try {
      await window.storage.delete(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};
