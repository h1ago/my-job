export const logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${new Date().toLocaleString()} - ${message}`);
  },

  success: (message: string): void => {
    console.log(`[SUCESSO] ${new Date().toLocaleString()} - ✅ ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`[AVISO] ${new Date().toLocaleString()} - ⚠️ ${message}`);
  },

  error: (message: string, error?: any): void => {
    console.error(`[ERRO] ${new Date().toLocaleString()} - ❌ ${message}`);
    if (error) console.error(error);
  },

  clear: (): void => {
    console.clear();
  },
};
