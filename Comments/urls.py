from django.urls import path
from Comments import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = format_suffix_patterns([
    #path('comments/', views.CommentList.as_view(), name= 'comment-list'),
    path('comments/me/', views.CommentList.as_view(), name='comment-list'),
    #path('comments/<int:pk>/', views.CommentDetail.as_view(), name='comment-detail'),
    #path("posts/<int:pk>/comments/", views.CommentList.as_view(), name= 'comment-list')
])
