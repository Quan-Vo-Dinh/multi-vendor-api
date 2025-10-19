module.exports = {
  apps: [
    {
      name: 'multi-vendor',
      cwd: '/var/www/multi-vendor',
      script: 'dist/src/main.js', // chạy trực tiếp file build
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
