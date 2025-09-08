/**
 * Utility functions for the Todo App
 */

export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isStorageAvailable,
  getStorageInfo,
} from './storage'

export {
  isValidTaskCategory,
  validateTask,
  validateTasks,
  sanitizeTask,
  createTask,
  generateTaskId,
  updateTask,
} from './taskValidation'
