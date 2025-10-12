export const wrapAsync = (fn) => {
  return async (args) => {
    try {
      await fn(args);
    } catch (error) {
      console.error('Error executing command:', error);
      process.exit(1);
    }
  };
};