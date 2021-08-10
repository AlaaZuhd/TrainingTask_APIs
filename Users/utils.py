import datetime
import os
import smtplib
import ssl
from datetime import timedelta

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.urls import reverse
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import AuthenticationFailed
from six import text_type
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from rest_framework.authtoken.models import Token
import SimpleFacebook
import json


# handling the login view
from SimpleFacebook import settings


class ObtainNewToken(ObtainAuthToken):

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        #serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            #if not created:
            token.delete()
            if(user.is_active):
                token = Token.objects.create(user=user)
                token.save()
                #is_expired, token = token_expire_handler(token)
                print("hi")
            response_data = {'token': token.key, 'expires_in': str(expires_in(token))}
            return HttpResponse(json.dumps(response_data), content_type="application/json")
        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
obtain_new_token = ObtainNewToken.as_view()

def expires_in(token):

    a_datetime = token.created #datetime.datetime(2010, 1, 1)
    added_seconds = datetime.timedelta(0, settings.TOKEN_EXPIRED_AFTER_SECONDS)
    new_datetime = a_datetime + added_seconds
    # print("new date: " + str(new_datetime))
    # time_elapsed = timezone.now() - token.created
    # print("time elapsed: " + str(time_elapsed))
    # print("expire time in sec: " + str(settings.TOKEN_EXPIRED_AFTER_SECONDS))
    # print("dt: " + str(timedelta(seconds=settings.TOKEN_EXPIRED_AFTER_SECONDS)))
    # print("token created: " + str(token.created))
    # left_time = timedelta(seconds=settings.TOKEN_EXPIRED_AFTER_SECONDS) - time_elapsed
    left_time = new_datetime - a_datetime
    print("left time: " + str(left_time))
    return left_time

# # token checker if token expired or not
# def is_token_expired(token):
#     return expires_in(token) < timedelta(seconds = 0)
#
# def token_expire_handler(token):
#     is_expired = is_token_expired(token)
#     if is_expired:
#         token.delete()
#         token = Token.objects.create(user=token.user)
#     return is_expired, token


class AppTokenGenerator(PasswordResetTokenGenerator):

    def _make_hash_value(self, user, timestamp):
        return (text_type(user.is_active) + text_type(user.pk) + text_type(timestamp))

user_activation_token = AppTokenGenerator()


def createActivationLink(new_user, request):
    current_site = get_current_site(request)
    from django.contrib.auth.tokens import PasswordResetTokenGenerator

    t = PasswordResetTokenGenerator
    email_body = {
        'user': new_user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(new_user.pk)),
        'token': user_activation_token.make_token(new_user),
        #'token': tokens.PasswordResetTokenGenerator.make_token(user=new_user),
        #'token': PasswordResetTokenGenerator.make_token(user= new_user),

    }
    link = reverse('activate', kwargs={
        'uidb64': email_body['uid'], 'token': email_body['token']})
    activate_url = 'http://' + current_site.domain + link
    return activate_url



def sendActivationLinkThroughEmail(new_user, request):

    activate_url = createActivationLink(new_user=new_user, request=request)
    data = {
        "email": new_user.email,
        "user name": new_user.user_name,
        "birth date": new_user.birth_date,
        "activation link": activate_url
    }
    email_subject = 'Activate your account'
    email = EmailMessage(
        subject=email_subject,
        body='Hi ' + new_user.user_name + ', Please the link below to activate your account \n' + activate_url,
        from_email="te8390433@gmail.com",
        to=[new_user.email, ],
    )
    #email.attach_file('C:/Users/AlaaZ/Desktop/Note1.txt')
    email.send(fail_silently= False)
    return data


    # message = 'Hi ' + new_user.user_name + ', Please click on the link below to activate your account \n' + activate_url
    #
    # port = 587  # For starttls
    # smtp_server = "smtp.gmail.com"
    # sender_email = SimpleFacebook.settings.EMAIL_HOST_USER
    # print(sender_email)
    # receiver_email = new_user.email
    # password = SimpleFacebook.settings.EMAIL_HOST_PASSWORD
    # print(password)
    # print(os.environ)
    # context = ssl.create_default_context()
    # with smtplib.SMTP(smtp_server, port) as server:
    #     server.ehlo()  # Can be omitted
    #     server.starttls(context=context)
    #     server.ehlo()  # Can be omitted
    #     server.login(sender_email, password)
    #     server.sendmail(sender_email, receiver_email, message)


    # import socket
    # socket.getaddrinfo('localhost', 8000)
    # from django.core.mail import send_mail
    # send_mail(subject=email.subject, message=email.body, from_email=email.from_email, recipient_list=email.to, fail_silently = False)
    # #email.send()

    # import smtplib
    # Server = smtplib.SMTP_SSL('smtp.gmail.com', 587)
    # Server = smtplib.SMTP('smtp.gmail.com', 465)
    # Server.login("te8390433@gmail.com", "test@123321")
    # Server.starttls()
    # Server.login("te8390433@gmail.com", "test@123321")
    # msg = 'Hi ' + new_user.user_name + ', Please the link below to activate your account \n' + activate_url
    # Server.sendmail(new_user.email, "te8390433@gmail.com", msg)
    # print("email send succesfully")  # Just for confirmation
    # Server.quit()

    # s = smtplib.SMTP(Server, 587)
    # s.ehlo()
    # s.starttls()
    # print("hhhi")
    # s.login("te8390433@gmail.com", "test@123321")
    # s.sendmail("te8390433@gmail.com", new_user.email, msg)
    # s.quit()
