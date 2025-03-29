from django.test import TestCase, Client
from rest_framework import status


# Create your tests here.

class ProductTestCase(TestCase):
    def setUp(self):
        self.client = Client()


    def test_create_product_successfully(self):
        product_request: dict[str, object] = {
            "name": "Test Product",
            "category":"Test Category",
            "subcategory": "Test Sub Category",
            "price": '15000.00',
            "quantity": 5,
        }
        response = self.client.post("/api/products/", product_request, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertDictEqual(response.json(), {
            "id": 1,
            **product_request
        })
        
    def test_get_product_by_id_successfully(self):
        product = self.product_service.get_product_by_id(self.product.id)

        self.assertEqual(product.id, self.product.id)
        self.assertEqual(product.name, self.product.name)
        self.assertEqual(product.category, self.product.category)
        self.assertEqual(product.subcategory, self.product.subcategory)
        self.assertEqual(product.price, self.product.price)
        self.assertEqual(product.quantity, self.product.quantity)

    def test_get_all_products_successfully(self):
        product_2 = product.objects.create(
            name="Another Product",
            category="Another Category",
            subcategory="Another Subcategory",
            price=25000.00,
            quantity=15
        )

        products = self.product_service.get_all_products()
        self.assertEqual(len(products), 2)

    def test_update_product_successfully(self):
        updated_product = Product(
            id=self.product.id,
            name="Updated Product",
            category="Updated Category",
            subcategory="Updated Subcategory",
            price=20000.00,
            quantity=10
        )

        updated_product_instance = self.product_service.update_product(updated_product)

        self.assertEqual(updated_product_instance.name, "Updated Product")
        self.assertEqual(updated_product_instance.category, "Updated Category")

    def test_delete_product_successfully(self):
        product_id = self.Product.id
        self.product_service.delete_product(product_id)

        with self.assertRaises(Product.DoesNotExist):
            Product.objects.get(id=product_id)
