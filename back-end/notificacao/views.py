from django.shortcuts import render
from .models import Email
from .serializers import EmailSerializer
from rest_framework import generics, status, mixins, viewsets
from rest_framework.viewsets import ModelViewSet

class EmailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Email.objects.all()
    serializer_class = EmailSerializer



# python manage.py makemigrations
# python manage.py migrate

