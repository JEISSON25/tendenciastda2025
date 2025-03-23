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
