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
    const addProductForm = new FormData(addBtnEl.parentElement)
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
        console.log(response)
        setProducts(products => [...products, response.addedProduct])
      })()
  }

  function editProduct(editBtnEl) {
    // show cancel and save button
    editBtnEl.parentElement.querySelector('button.cancel_product_btn').classList.toggle('hidden')
    editBtnEl.parentElement.querySelector('button.save_product_btn').classList.toggle('hidden')
    // show edit product field
    editBtnEl.parentElement.querySelector('.edit_product_form').classList.replace('hidden', 'grid')
    // hide current product data
    editBtnEl.parentElement.querySelector('.product_name').classList.toggle('hidden')
    editBtnEl.parentElement.querySelector('.product_quantity').classList.toggle('hidden')
    editBtnEl.parentElement.querySelector('.product_price').classList.toggle('hidden')
    // hide edit button
    editBtnEl.classList.toggle('hidden')
    // hide delete button
    editBtnEl.parentElement.querySelector('button.delete_product_btn').classList.toggle('hidden')
  }

  function cancelEditProduct(cancelBtnEl) {
    // hide cancel and save button
    cancelBtnEl.classList.toggle('hidden')
    cancelBtnEl.parentElement.querySelector('button.save_product_btn').classList.toggle('hidden')
    // hide edit product field
    cancelBtnEl.parentElement.querySelector('.edit_product_form').classList.replace('grid', 'hidden')
    // show current product data
    cancelBtnEl.parentElement.querySelector('.product_name').classList.toggle('hidden')
    cancelBtnEl.parentElement.querySelector('.product_quantity').classList.toggle('hidden')
    cancelBtnEl.parentElement.querySelector('.product_price').classList.toggle('hidden')
    // show edit button
    cancelBtnEl.parentElement.querySelector('button.edit_product_btn').classList.toggle('hidden')
    // show delete button
    cancelBtnEl.parentElement.querySelector('button.delete_product_btn').classList.toggle('hidden')
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
        console.log(response)
      })()
  }

  useEffect(() => {

    ; (async () => {
      // fetch products data from api
      const data = await
        fetch('https://izzstore.herokuapp.com/api/products')
          .then((res) => res.json())
      setProducts(data)
    })()

    return () => { }
  }, [])

  return (
    <div className="homepage p-6 text-sm">
      <div className="space-y-6 container mx-auto max-w-screen-md">
        <div className="title font-black text-3xl">Store</div>

        <div className="input_product_section grid grid-cols-12 gap-2">
          <form action="" method="post" className="add_product_form col-span-full grid grid-cols-12 gap-2">
            <button name="randomize_input_product" className="col-start-9 col-span-2 text-blue-500 rounded-md py-1" type="button" onClick={e => randomizeProduct(e.target)}>Random</button>
            <button name="add_product_btn" className="bg-blue-500 text-white font-bold rounded-md px-3 py-1 col-start-11 col-span-2" type="button" onClick={e => addNewProduct(e.target)}>Add</button>
            <input type="text" name="name" className="px-1 border rounded col-span-8" placeholder="Product name" required />
            <input type="number" name="quantity" className="px-1 border rounded col-span-2" placeholder="Quantity" required />
            <input type="number" name="price" className="px-1 border rounded col-span-2" placeholder="Price" required />
          </form>
        </div>

        <div className="product-list space-y-3">
          {
            products.length ? products.map((product, index) =>
              <div key={index} className="grid grid-cols-12 gap-2">
                <input type="hidden" className="product_id" value={product.id} />

                <form className="edit_product_form col-span-10 hidden grid-cols-10 gap-2">
                  <input type="text" className="border rounded px-1 col-span-6" name="name" placeholder="Product name" defaultValue={product.name} required />
                  <input type="number" className="border rounded px-1 col-span-2" name="quantity" placeholder="Quantity" defaultValue={product.quantity} required />
                  <input type="number" className="border rounded px-1 col-span-2" name="price" placeholder="Price" defaultValue={product.price} required />
                </form>

                <div className="product_name col-span-6">
                  {`${index + 1}. ${product.name}`}
                </div>
                <div className="product_quantity col-span-2">
                  {product.quantity}
                </div>
                <div className="product_price col-span-2">
                  {`$${product.price}`}
                </div>

                <button className="cancel_product_btn col-span-1 hidden" onClick={(e) => cancelEditProduct(e.target)}>x</button>
                <button className="save_product_btn col-span-1 hidden text-green-500" onClick={(e) => updateProduct(e.target)}>save</button>
                <button className="edit_product_btn col-span-1 text-blue-500" onClick={(e) => editProduct(e.target)}>edit</button>
                <button className="delete_product_btn col-span-1 text-red-500" type="button" onClick={(e) => deleteProduct(e.target)}>del</button>
              </div>) : 'Loading data...'
          }
        </div>

      </div>
    </div>
  )
}

export default HomePage