from django.urls import path
from Users import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

from Users.utils import obtain_new_token

urlpatterns = format_suffix_patterns([

    path('users/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('login', obtain_new_token , name= "login"),
    path('logout', views.Logout.as_view(), name="logout"),
    path('check-token', views.CheckToken.as_view(), name="check-token"),
    path('activate/<uidb64>/<token>',
         views.ActivateAccountView.as_view(), name='activate'),

    # path('users/create', views.CustomUserCreate.as_view(), name= 'user-create'),
    #path(r'^users/(?P<pk>\d+)/$', views.CustomUserDetailMe.as_view(), name='users-me'),
    #path('users/me/', views.Try, name= 'oh'),
    #path('users/<int:pk>/', views.UserViewSet, name= "yarab"),
    #path('users/me', views.CustomUserDetail.as_view(), name='users-me'),
    #path('users/me/', views.Try),
    ##path('users/me/', views.CurrentUserView.as_view()),
    ##path('users/me/', views.Me.as_view()),
    ####path('users/<int:pk>/', views.CustomUserDetail.as_view(), name= 'user-detail'),
    ####path('users/<int:pk>/', views.UserViewSet, name='user-detail'),
])


