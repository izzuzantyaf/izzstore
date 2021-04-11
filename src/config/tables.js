module.exports = {
  setupQueries: [
    'CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, quantity INTEGER NOT NULL, price NUMERIC(5,2));'
  ]
}