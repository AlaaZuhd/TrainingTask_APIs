import sys

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser

# Create your models here.
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _

# for token authentication
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class CreateUdateDates(models.Model):
    updated_date = models.DateTimeField(auto_now= True, editable= False, null= True)
    create_date = models.DateTimeField(auto_now_add= True, editable= False, null= True)
    class Meta:
        abstract = True

class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        #if CustomUser.objects.filter(email= email):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        if(not user.is_superuser):
            user.is_active = False
        try:
            user.save()
        except Exception:
            raise Exception("invalid email")
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        try:
            return self.create_user(email, password, **extra_fields)
        except Exception:
            raise Exception("invalid email")


class CustomUser(AbstractBaseUser, PermissionsMixin, CreateUdateDates):
    birth_date = models.DateField(editable= True, blank= True, default='2001-7-2')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default= False)
    email = models.EmailField(max_length= 200, unique= True, blank= False)
    # create_date = models.DateTimeField(auto_now_add= True, editable= False)
    # updated_date = models.DateTimeField(auto_now= True, editable= False)
    user_name = models.CharField(max_length=200, blank=False, default='default user name')
    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def create(self, validated_data):
        try:
            return CustomUser.objects.create_user(**validated_data)
        except Exception:
            raise ("Invalid email3")


# @receiver(post_save, sender= settings.AUTH_USER_MODEL)
# def create_auth_token(sender, instance= None, created= False, **kwargs):
#     if (created):
#         Token.objects.create(user= instance)
