module.exports = {
  apps: [{
    name: 'wishflow',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    },
    exec_mode: 'cluster',
    instances: 1
  }]
}