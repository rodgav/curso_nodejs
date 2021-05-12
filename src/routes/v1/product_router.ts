import {Router} from "express";
import * as productsController from "../../controllers/v1/products_controller";
import {checkAuth, checkIp} from "../../middlewares/auth_middleware";
import {
    validateDelete,
    validateNewProductBody,
    validateProductNotify
} from "../../valdiators/productos_validator/v1/products_validator";
import {handleRequestErrors} from "../../middlewares/validator_middleware";

const router = Router();

router.get('', checkIp, checkAuth, productsController.getProducts);
router.get('/:productId', checkAuth, productsController.getProductById);
router.post('/create', checkAuth, validateNewProductBody, handleRequestErrors, productsController.createProduct);
router.put('/:productId', checkAuth, productsController.updateProduct);
router.patch('/:productId', checkAuth, productsController.partialUpdateProduct);
router.delete('/:productId', checkAuth, validateDelete, handleRequestErrors, productsController.deleteProductById);
router.post('/:productId/notify-client', checkAuth, validateProductNotify, handleRequestErrors, productsController.updateProductAndNotify);

export default router;