module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      AWSRDS_EP: 'bedsidelamp.cwwncl1cgazu.us-east-2.rds.amazonaws.com',
      AWSRDS_PW: '1w0w2w1maz',
      PHOTON_ID: '3b0043000f47353136383631',
      PHOTON_TOKEN: '8eda98f7956ff8533969aa9a072d94f564487884'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
