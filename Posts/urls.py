from django.urls import path
from Posts import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = format_suffix_patterns([
    path('posts/', views.PostList.as_view(), name= 'posts-list'),
    path('posts/<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
])
