module.exports = {
  apps: [
    {
      name: 'multi-vendor',
      cwd: '/home/quan/multi-vendor-api',
      script: './dist/src/main.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      // Chỉ cần set NODE_ENV, NestJS ConfigModule sẽ tự động load .env.production
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // PM2 Options
      max_memory_restart: '500M',
      error_file: '/home/quan/.pm2/logs/multi-vendor-error.log',
      out_file: '/home/quan/.pm2/logs/multi-vendor-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
}
