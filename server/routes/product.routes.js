const router = require('express-promise-router')()
const productController = require('../controllers/product.controller')

router.post('/products', productController.createProduct)
router.get('/products', productController.listAllProducts)
router.get('/products/:id', productController.findProductById)
router.put('/products/:id', productController.updateProductById)
router.delete('/products/:id', productController.deleteProductById)

module.exports = router