module.exports = {
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "ahorta_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 5432,
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "ahorta_test",
    "host": "127.0.0.1",
    "post": 5432,
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "username": "root",
    "password": null,
    "database": process.env.DATABASE_URL,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "dialectOptions": { "ssl": true }
  }
}
