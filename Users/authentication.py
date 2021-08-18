# from rest_framework.authentication import TokenAuthentication
# from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
#
# # DEFAULT_AUTHENTICATION_CLASSES
# from Users.utils import token_expire_handler
#
#
# class ExpiringTokenAuthentication(TokenAuthentication):
#     """
#     If token is expired then it will be removed
#     and new one with different key will be created
#     """
#
#     def authenticate_credentials(self, key):
#         try:
#             token = Token.objects.get(key=key)
#         except Token.DoesNotExist:
#             raise AuthenticationFailed("Invalid Token")
#
#         if not token.user.is_active:
#             raise AuthenticationFailed("User is not active")
#
#         is_expired, token = token_expire_handler(token)
#         if is_expired:
#             raise AuthenticationFailed("The Token is expired, please login again to obtain a new token")
#
#         return (token.user, token)
import datetime

import pytz
from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from datetime import timedelta

from SimpleFacebook import settings


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        # This is required for the time comparison
        utc_now = datetime.datetime.utcnow()
        utc_now = utc_now.replace(tzinfo=pytz.utc)
        # print("seee thins: " + str(utc_now - timedelta(seconds=settings.TOKEN_EXPIRED_AFTER_SECONDS)))
        if token.created < utc_now - timedelta(seconds=settings.TOKEN_EXPIRED_AFTER_SECONDS):
            raise AuthenticationFailed('Token has expired')
        return token.user, token
