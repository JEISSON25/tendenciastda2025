from django.db import models

# Create your models here.
from django.db import models

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()

    class Meta:
        db_table = 'products'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'subcategory': self.subcategory,
            'price': self.price,
            'quantity': self.quantity,
        }
    
class Client(models.Model):
    id = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=100) 
    last_name = models.CharField(max_length=100) 
    ssn = models.CharField(max_length=20, unique=True)  
    email = models.EmailField(max_length=255, unique=True)  
    phone = models.CharField(max_length=15, blank=True, null=True)  
    address = models.TextField(blank=True, null=True)   
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    class Meta:
        db_table = 'clients' 

    def to_dict(self):
        
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'ssn': self.cedula,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }