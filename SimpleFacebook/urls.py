"""SimpleFacebook URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from Posts.views import PostViewSet
from Users import views
from Comments.views import CommentViewSet
from rest_framework import routers


user_router = routers.DefaultRouter()
user_router.register('users', views.UserViewSet, basename='users')


post_router = routers.DefaultRouter()
post_router.register('posts', PostViewSet, basename='posts')


comment_router = routers.DefaultRouter()
comment_router.register('comments', CommentViewSet, basename='comments')

comment_router2 = routers.DefaultRouter()
comment_router2.register('posts/<int:pk>/comments', CommentViewSet, basename='comments')
#
# comment_router2 = routers.DefaultRouter()
# comment_router2.register('comments/', CommentViewSet, basename='comments')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Users.urls')),
    path('', include(user_router.urls)),
    #path('', include('Posts.urls')),
    path('', include(post_router.urls)),
    path('', include('Comments.urls')),
    path('', include(comment_router.urls)),
    path('', include(comment_router2.urls))
    #path('posts/<int:pk>/', include(comment_router.urls))

]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls'))

]