// Validasi & ekspor variabel .env di satu tempat
const wajib = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];
wajib.forEach((k) => {
  if (!process.env[k]) {
    console.error(`[ENV] Variabel ${k} belum diisi di file .env`);
    process.exit(1);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS || '',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  WA_POKDARWIS: process.env.WA_POKDARWIS || '',
  FRONTEND_URL: process.env.FRONTEND_URL || '*',
};
