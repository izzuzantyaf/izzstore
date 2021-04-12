import { useEffect, useState } from "react"

const faker = require('faker/locale/id_ID')

function HomePage() {

  const [products, setProducts] = useState([])

  useEffect(() => {

    (async () => {
      const data = await fetch('https://izzstore.herokuapp.com/api/products')
        .then((res) => res.json())
        .then((data) => data)
      console.log(data)
      setProducts(data)
    })()

    const randomBtn = document.querySelector('button[name="randomize_input_product"]')

    randomBtn.addEventListener('click', () => {
      document.querySelector('input[name="name"]').value = faker.commerce.productName()
      document.querySelector('input[name="quantity"]').value = faker.datatype.number(20)
      document.querySelector('input[name="price"]').value = faker.datatype.number(100)
    })

    const addProductBtn = document.querySelector('button[name="add_product_btn"')
    addProductBtn.addEventListener('click', () => {

      const name = document.querySelector('input[name="name"]').value
      const quantity = parseInt(document.querySelector('input[name="quantity"]').value)
      const price = parseInt(document.querySelector('input[name="price"]').value)

      const newProduct = { name, quantity, price };

      (async () => {
        const response = await fetch('https://izzstore.herokuapp.com/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        })
          .then((res) => res.json())
          .catch((err) => { console.error(err) })

        setProducts(products => [...products, response.addedProduct])
      })()
    })

    return () => {
      randomBtn.removeEventListener('click', () => { })
      addProductBtn.removeEventListener('click', () => { })
    }
  }, [])

  return (
    <div>
      <div className="title">Store</div>
      <div className="product-list">
        {
          products.length ? products.map((product, index) => <p key={index}>{`${product.name} - ${product.quantity} - $${product.price}`}</p>) : 'Loading data...'
        }
      </div>
      <div>
        {/* <form action="" method="post"> */}
        <input type="text" name="name" placeholder="Product name" required />
        <input type="number" name="quantity" placeholder="Quantity" required />
        <input type="number" name="price" placeholder="Price" required />
        <button name="add_product_btn">Add</button>
        {/* </form> */}
        <button name="randomize_input_product">Randomize input</button>
      </div>
    </div>
  )
}

export default HomePage