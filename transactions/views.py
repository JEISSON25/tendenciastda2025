from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.response import Response

from transactions.models import Transaction
from transactions.serializers import TransactionRequestSerializer, TransactionDataSerializer
from transactions.services import TransactionService


# Create your views here.

class TransactionViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.transaction_service = TransactionService()

    @swagger_auto_schema(request_body=TransactionRequestSerializer, responses={201: TransactionDataSerializer()})
    def create(self, request):
        transaction_request_serializer: TransactionRequestSerializer = TransactionRequestSerializer(data=request.data)
        if transaction_request_serializer.is_valid(raise_exception=True):
            transaction, products_per_transaction = transaction_request_serializer.create(transaction_request_serializer.data)
            transaction_saved: Transaction = self.transaction_service.create_transaction(transaction, products_per_transaction)
            transaction_serializer: TransactionDataSerializer = TransactionDataSerializer(transaction_saved)
            return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(responses={200: TransactionDataSerializer(),
                                    404: "{'error': 'Transaction not found'}"})
    def retrieve(self, request, pk=None):
        try:
            return Response(self.transaction_service.get_transactions_by_id(pk).to_dict(), status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response({
                "error": "Transaction not found",
            },status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(responses={200: TransactionDataSerializer(many=True)})
    def list(self, request):
        transactions = self.transaction_service.get_all_transactions()
        response = []
        for transaction in transactions:
            response.append(transaction.to_dict())

        return Response(response, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=TransactionRequestSerializer, responses={200: TransactionDataSerializer()})
    def update(self, request, pk=None):
        transaction_request_serializer: TransactionRequestSerializer = TransactionRequestSerializer(data=request.data)
        if transaction_request_serializer.is_valid(raise_exception=True):
            transaction, _ = transaction_request_serializer.create(transaction_request_serializer.data)
            transaction.id = pk
            transaction_saved: Transaction = self.transaction_service.update_transaction(transaction)
            return Response(transaction_saved.to_dict(), status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={200: "'message': 'This Transaction has been deleted successfully'",
                                    404: "{'error': 'Transaction not found'}"})
    def destroy(self, request, pk=None):
        try:
            self.transaction_service.delete_transaction(pk)
            return Response({
                "message": "This transaction has been deleted successfully",
            },status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response({
                "error": "Transaction not found",
            },status=status.HTTP_404_NOT_FOUND)

    http_method_names = ['get', 'post', 'put', 'patch', 'delete']