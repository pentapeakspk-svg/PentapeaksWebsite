module.exports = {
  apps: [
    {
      name: 'pentapeaks',
      script: 'node',
      // In standalone mode, the entry point is server.js inside .next/standalone
      args: '.next/standalone/server.js',
      instances: 1, // Run a single instance to avoid port conflicts
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ADMIN_USERNAME: 'admin@studentportal.pentapeaks.com',
        ADMINPASSWORD: '26@admin@20'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/pm2/error.log',
      out_file: 'logs/pm2/out.log',
      merge_logs: true,
      time: true
    }
  ]
};
