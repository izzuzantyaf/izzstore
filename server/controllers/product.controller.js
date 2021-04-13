const db = require('../config/database')
const faker = require('faker')
faker.locale = 'id_ID'

exports.createProduct = async (req, res) => {
  const { name, quantity, price } = req.body
  // const name = faker.commerce.name()
  // const quantity = faker.datatype.number(20)
  // const price = faker.commerce.price(5, 100)

  const response = await db.query('INSERT INTO products (name, quantity, price) VALUES ($1, $2, $3) RETURNING id, name, quantity, price', [name, quantity, price])

  console.log(response)

  res.status(201).send({
    message: 'Product added successfully!',
    addedProduct: response.rows[0],
  })
}

exports.listAllProducts = async (req, res) => {
  const response = await db.query('SELECT * FROM products ORDER BY name ASC')
  res.status(200).send(response.rows)
}

exports.findProductById = async (req, res) => {
  const productId = parseInt(req.params.id)
  const response = await db.query('SELECT * FROM products WHERE id = $1', [productId])
  res.status(200).send(response.rows)
}

exports.updateProductById = async (req, res) => {
  const productId = parseInt(req.params.id)
  const { name, quantity, price } = req.body

  await db.query(
    "UPDATE products SET name = $1, quantity = $2, price = $3 WHERE id = $4",
    [name, quantity, price, productId]
  )

  res.status(200).send({ message: "Product Updated Successfully!" })
}

exports.deleteProductById = async (req, res) => {
  const productId = parseInt(req.params.id)
  await db.query('DELETE FROM products WHERE id = $1', [productId])

  res.status(200).send({ message: 'Product deleted successfully!', productId })
}