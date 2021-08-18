import json
import os
from django.contrib import messages
from django.contrib.auth import login, tokens
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.urls import reverse
from django.views import View
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from rest_framework.views import APIView

from SimpleFacebook import settings
from .utils import user_activation_token, createActivationLink, sendActivationLinkThroughEmail, ObtainNewToken
import SimpleFacebook.settings
from Users.models import CustomUser
from Users.serializers import CustomUserDisplaySerializer, CustomUserCreateSerializer, CustomUserUpdateSerializer
from Users.permissions import IsOwner, IsSuperuser
from rest_framework import viewsets
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from .serializers import CustomUserResetPasswordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
import smtplib, ssl


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(is_active=True)# update, list, retreive and destroy active users.
    #serializer_class = CustomUserDisplaySerializer
    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated and (IsOwner | IsSuperuser)]

    def get_serializer_class(self):
        if self.action == 'create':
            return CustomUserCreateSerializer
        elif self.action == 'update':
            return CustomUserUpdateSerializer
        else:
            return CustomUserDisplaySerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAuthenticated and IsSuperuser]
        elif self.action == 'post':
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated and (IsOwner | IsSuperuser)]
        return [permission() for permission in permission_classes]

    def get_object(self):
        if self.kwargs.get('pk', None) == 'me':
            self.kwargs['pk'] = self.request.user.pk
        return super(UserViewSet, self).get_object()

    def list(self, request, *args, **kwargs):
        if(request.user.is_superuser):
            return super().list(request, args, kwargs)
        else:
            return Response("You are not superuser so you don't have an access on these data")

    def create(self, request, *args, **kwargs):
        try:
            new_user = CustomUser.create(self, request.data)
        except Exception:
            return Response({"errorMessage": "Invalid email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        data= sendActivationLinkThroughEmail(new_user, request)
        messages.success(request, 'Account successfully created')
        return Response(data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response("user has been successfully deleted (deactivated) ", status=status.HTTP_204_NO_CONTENT)


# hadling the reset password view
class ChangePasswordView(generics.UpdateAPIView):

    serializer_class = CustomUserResetPasswordSerializer
    model = CustomUser
    permission_classes = [IsAuthenticated and (IsOwner)]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            if serializer.data.get('password') != serializer.data.get('confirm_password'):
                return Response({"no matching in paswwords, please try again"}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }
            return HttpResponse(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import datetime
import pytz
from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from datetime import timedelta

class CheckToken(APIView):

    def get(self, request, formate=None):
        utc_now = datetime.datetime.utcnow()
        utc_now = utc_now.replace(tzinfo=pytz.utc)
        print(request.META.get('HTTP_AUTHORIZATION'))

        authorization_header = request.META.get('HTTP_AUTHORIZATION').split(" ")
        if len(authorization_header) != 2:
            return HttpResponse({"message": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)
        token = Token.objects.get(key=authorization_header[1])
        print(token)
        if token.created > utc_now - timedelta(seconds=settings.TOKEN_EXPIRED_AFTER_SECONDS):
            return HttpResponse({"Token is valid"}, status=status.HTTP_200_OK)
        else:
            return HttpResponse({"message": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, formate=None):
        token, created = Token.objects.get_or_create(user=request.user)
        token.delete() # delete the token of the login user
        return HttpResponse("Logged out successfully", status=status.HTTP_200_OK)

class ActivateAccountView(View):

    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and user_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            login(request, user)
            return HttpResponse("User activated successfully", status= status.HTTP_200_OK)
            #return redirect('')
        else:
            # invalid link
            return HttpResponse("user is already active")



# class CustomUserCreate(generics.CreateAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = CustomUserSerializer
#
#     def post(self, request, *args, **kwargs):
#         new_user= CustomUser.create(self, request.data)
#         token= Token.objects.get(user= new_user).key
#         print(token)
#         return Response((request.data + '\n"Token": ' + str(token)), status=status.HTTP_201_CREATED)




# # Create your views here.
# class CustomUserCreate(generics.CreateAPIView):
#     #queryset = CustomUser.objects.all()
#     queryset = CustomUser.objects.filter(is_active= True) # no need for filteration since this query set will never be used in the create action
#     serializer_class = CustomUserSerializer
#     authentication_classes = [TokenAuthentication]
#
#     def get_permissions(self):
#         if (self.action == 'list'):
#             permission_classes = [IsAuthenticated and (IsSuperuser)]
#         else:
#             permission_clasess = [IsAuthenticated]
#
#     #permission_classes = [IsSuperuserForListOrPost]
#     def post(self, request, *args, **kwargs):
#         new_user = CustomUser.create(self, request.data)
#         token = Token.objects.get(user=new_user).key
#         print(token)
#         return Response(request.data, status=status.HTTP_201_CREATED)



# class VerificationView(View):
#     def get(self, request, uidb64, token):
#         try:
#             id = force_text(urlsafe_base64_decode(uidb64))
#             user = CustomUser.objects.get(pk=id)
#             if not user_activation_token.check_token(user, token):
#                 return redirect('activation-response'+'?message='+'User already activated')
#                 # response = {
#                 #     'status': 'success',
#                 #     'code': status.HTTP_200_OK,
#                 #     'message': 'user account already activated',
#                 #     'data': []
#                 # }
#                 # print("already")
#                 # return Response(response)
#             if user.is_active:
#                 return redirect('login')
#             user.is_active = True
#             user.save()
#             messages.success(request, 'Account activated successfully')
#             #return redirect('login')
#             print("stage 2")
#             response = {
#                 'Message': 'Activation done successfully'
#             }
#             return Response(response)
#         except Exception as ex:
#             pass
#         return redirect('login')
