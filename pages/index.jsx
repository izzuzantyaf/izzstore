import { useEffect, useState } from "react"

const faker = require('faker/locale/id_ID')

function HomePage() {

  const [products, setProducts] = useState([])

  function randomizeProduct(randomBtnEl) {
    randomBtnEl.parentElement.querySelector('input[name="name"]').value = faker.commerce.productName()
    randomBtnEl.parentElement.querySelector('input[name="quantity"]').value = faker.datatype.number(20)
    randomBtnEl.parentElement.querySelector('input[name="price"]').value = faker.datatype.number(100)
    console.info('randomize product success')
  }

  function deleteProduct(deleteBtnEl) {
    const productId = parseInt(deleteBtnEl.parentElement.querySelector('input.product_id').value)
      ; (async () => {
        const response = await
          fetch('https://izzstore.herokuapp.com/api/products/' + productId, {
            method: 'DELETE',
          })
            .then(res => res.json())
        console.info(response)
        setProducts(() => products.filter(product => product.id !== response.productId))
      })()
  }

  function addNewProduct(addBtnEl) {
    const addProductForm = new FormData(document.querySelector('form.add_product_form'))
    const newProduct = {}
    for (let [key, value] of addProductForm.entries()) newProduct[key] = value

      ; (async () => {
        const response = await
          fetch('https://izzstore.herokuapp.com/api/products', {
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

  function editProduct(editBtnEl) {
    // show cancel and save button
    editBtnEl.parentElement.querySelector('button.cancel_product_btn').style.display = 'inline'
    editBtnEl.parentElement.querySelector('button.save_product_btn').style.display = 'inline'
    // show edit product field
    editBtnEl.parentElement.querySelector('.edit_product_form').style.display = 'inline'
    // hide current product data
    editBtnEl.parentElement.querySelector('.product_data').style.display = 'none'
    // hide edit button
    editBtnEl.style.display = 'none'
    // hide delete button
    editBtnEl.parentElement.querySelector('button.delete_product_btn').style.display = 'none'
  }

  function cancelEditProduct(cancelBtnEl) {
    // hide cancel and save button
    cancelBtnEl.style.display = 'none'
    cancelBtnEl.parentElement.querySelector('button.save_product_btn').style.display = 'none'
    // hide edit product field
    cancelBtnEl.parentElement.querySelector('.edit_product_form').style.display = 'none'
    // show current product data
    cancelBtnEl.parentElement.querySelector('.product_data').style.display = 'inline'
    // show edit button
    cancelBtnEl.parentElement.querySelector('button.edit_product_btn').style.display = 'inline'
    // show delete button
    cancelBtnEl.parentElement.querySelector('button.delete_product_btn').style.display = 'inline'
  }

  function updateProduct(saveBtnEl) {
    // catch prodcut id
    const productId = parseInt(saveBtnEl.parentElement.querySelector('input.product_id').value)
    // catch updated product value
    const editProductForm = new FormData(saveBtnEl.parentElement.querySelector('form.edit_product_form'))

    const newProduct = {
      id: productId,
    }
    for (let [key, value] of editProductForm.entries()) newProduct[key] = value

      ; (async () => {
        const response = await fetch('https://izzstore.herokuapp.com/api/products/' + productId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct),
        })
          .then(res => {
            setProducts(products => products.map(product => product.id === productId ? newProduct : product))
            cancelEditProduct(saveBtnEl.parentElement.querySelector('button.cancel_product_btn'))
            return res.json()
          })
          .catch(err => { console.error(err) })
        console.log(response)
      })()
  }

  useEffect(() => {

    ; (async () => {
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
              <form className="edit_product_form" style={{ display: 'none' }}>
                <input type="text" name="name" placeholder="Product name" defaultValue={product.name} required />
                <input type="number" name="quantity" placeholder="Quantity" defaultValue={product.quantity} required />
                <input type="number" name="price" placeholder="Price" defaultValue={product.price} required />
              </form>
              <p className="product_data" style={{ display: 'inline' }}>{`${index + 1}. ${product.name} - ${product.quantity} - $${product.price}`}</p>
              <button className="cancel_product_btn" style={{ display: 'none' }} onClick={(e) => { cancelEditProduct(e.target) }}>cancel</button>
              <button className="save_product_btn" style={{ display: 'none', color: 'green' }} onClick={(e) => { updateProduct(e.target) }}>save</button>
              <button className="edit_product_btn" style={{ display: 'inline', color: 'blue' }} onClick={(e) => { editProduct(e.target) }}>edit</button>
              <button style={{ display: 'inline', color: 'red' }} className="delete_product_btn" type="button" onClick={(e) => deleteProduct(e.target)}>delete</button>
            </div>) : 'Loading data...'
        }
      </div>
      <div>
        <form action="" method="post" className="add_product_form">
          <input type="text" name="name" placeholder="Product name" required />
          <input type="number" name="quantity" placeholder="Quantity" required />
          <input type="number" name="price" placeholder="Price" required />
          <button name="add_product_btn" type="button" onClick={addNewProduct}>Add</button>
        </form>
        <button name="randomize_input_product" type="button" onClick={e => randomizeProduct(e.target)}>Randomize input</button>
      </div>
    </div>
  )
}

export default HomePage