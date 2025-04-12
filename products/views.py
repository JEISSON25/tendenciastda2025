from typing import Any

from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from products.models import Product
from products.serializers import ProductRequestSerializer, ProductDataSerializer
from products.services import ProductService


class ProductView(ViewSet):
    def __init__(self, **kwargs: Any):
        self.product_service = ProductService()
        super().__init__(**kwargs)
    @action(detail=False, methods=['get'], url_path="healthcheck")
    def healthcheck(self, request):
        return Response("Hello world" ,status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=ProductRequestSerializer, responses={201: ProductDataSerializer()})
    def create(self, request):
        product_request_serializer: ProductRequestSerializer = ProductRequestSerializer(data=request.data)
        if product_request_serializer.is_valid(raise_exception=True):
            product: Product = product_request_serializer.create(product_request_serializer.data)
            product_saved: Product = self.product_service.create_product(product)
            product_serializer: ProductDataSerializer = ProductDataSerializer(product_saved)
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(responses={200: ProductDataSerializer(),
                                    404: "{'error': 'Product not found'}"})
    def retrieve(self, request, pk=None):
        try:
            return Response(self.product_service.get_product_by_id(pk).to_dict(), status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                "error": "Product not found",
            },status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(responses={200: ProductDataSerializer(many=True)})
    def list(self, request):
        products = self.product_service.get_all_products()
        response = []
        for product in products:
            response.append(product.to_dict())

        return Response(response, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=ProductRequestSerializer, responses={200: ProductDataSerializer()})
    def update(self, request, pk=None):
        product_request_serializer: ProductRequestSerializer = ProductRequestSerializer(data=request.data)
        if product_request_serializer.is_valid(raise_exception=True):
            product: Product = product_request_serializer.create(product_request_serializer.data)
            product.id = pk
            product_saved: Product = self.product_service.update_product(product)
            return Response(product_saved.to_dict(), status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={200: "'message': 'This product has been deleted successfully'",
                                    404: "{'error': 'Product not found'}"})
    def destroy(self, request, pk=None):
        try:
            self.product_service.delete_product(pk)
            return Response({
                "message": "This product has been deleted successfully",
            },status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                "error": "Product not found",
            },status=status.HTTP_404_NOT_FOUND)

    http_method_names = ['get', 'post', 'put', 'patch', 'delete']