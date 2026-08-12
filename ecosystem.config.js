module.exports = {
  apps: [
    {
      name: 'pentapeaks',
      script: 'node',
      // In standalone mode, the entry point is server.js inside .next/standalone
      args: '.next/standalone/server.js',
      instances: 'max', // Run in cluster mode based on available CPUs
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/pm2/error.log',
      out_file: 'logs/pm2/out.log',
      merge_logs: true,
      time: true
    }
  ]
};
