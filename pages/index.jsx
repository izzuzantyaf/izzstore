import { useEffect, useState } from "react"

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

    return () => { }
  }, [])

  return (
    <div>
      <div className="title">Store</div>
      <div className="product-list">
        {
          products.length ? products.map((product, index) => <p key={index}>{`${product.name} - ${product.quantity} - $${product.price}`}</p>) : 'Loading data...'
        }
      </div>
    </div>
  )
}

export default HomePage