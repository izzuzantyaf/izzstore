import { useEffect, useState } from "react"

const faker = require('faker/locale/id_ID')

function HomePage() {

  const [products, setProducts] = useState([])

  function randomizeProduct() {
    document.querySelector('input[name="name"]').value = faker.commerce.productName()
    document.querySelector('input[name="quantity"]').value = faker.datatype.number(20)
    document.querySelector('input[name="price"]').value = faker.datatype.number(100)
    console.info('randomize product success')
  }

  function deleteProduct(deleteBtnEl) {
    const productId = parseInt(deleteBtnEl.parentElement.querySelector('input.product_id').value);
    (async () => {
      const response = await fetch('https://izzstore.herokuapp.com/api/products/' + productId, {
        method: 'DELETE',
      })
        .then(res => res.json())
      console.info(response)
      setProducts(products => products.filter(product => product.id !== response.productId))
    })()
  }

  function addNewProduct() {
    const newProduct = {
      name: document.querySelector('input[name="name"]').value,
      quantity: parseInt(document.querySelector('input[name="quantity"]').value),
      price: parseInt(document.querySelector('input[name="price"]').value),
    };

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

      console.log(response)

      setProducts(products => [...products, response.addedProduct])
    })()
  }

  useEffect(() => {

    (async () => {
      // show all products
      const data = await fetch('https://izzstore.herokuapp.com/api/products')
        .then((res) => res.json())
      setProducts(data)
    })()

    return () => { }
  }, [])

  return (
    <div>
      <div className="title">Store</div>
      <div className="product-list">
        {
          products.length ? products.map((product, index) =>
            <div key={index}>
              <input type="hidden" className="product_id" value={product.id} />
              <p style={{ display: 'inline' }}>{`${index + 1}. ${product.name} - ${product.quantity} - $${product.price}`}</p>
              <button style={{ display: 'inline', color: 'red' }} className="delete_product_btn" type="button" onClick={(e) => deleteProduct(e.target)}>delete</button>
            </div>) : 'Loading data...'
        }
      </div>
      <div>
        <form action="" method="post">
          <input type="text" name="name" placeholder="Product name" required />
          <input type="number" name="quantity" placeholder="Quantity" required />
          <input type="number" name="price" placeholder="Price" required />
          <button name="add_product_btn" type="button" onClick={addNewProduct}>Add</button>
        </form>
        <button name="randomize_input_product" type="button" onClick={randomizeProduct}>Randomize input</button>
      </div>
    </div>
  )
}

export default HomePage