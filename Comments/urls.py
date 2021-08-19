from django.urls import path
from Comments import views
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    #path('comments/', views.CommentList.as_view(), name= 'comment-list'),
    # path('comments/me/', views.CommentList.as_view(), name='comment-list'),
    #path('comments/<int:pk>/', views.CommentDetail.as_view(), name='comment-detail'),
    # path("posts/<int:pk>/comments/", views.CommentList.as_view(), name= 'comment-list')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
