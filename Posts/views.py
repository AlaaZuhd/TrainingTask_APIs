from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import Comments.views
from Comments.models import Comment
from Comments.serializers import CommentSerializer
from Users.serializers import CustomUserDisplaySerializer
from Posts.permissions import IsPermissionProvided
from rest_framework import generics, viewsets, status
from .serializers import PostSerializer
from .models import Post
from Users.models import CustomUser

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    #permissions_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated and IsPermissionProvided]

    @action(detail=True, methods=["post"])
    def comments(self, request, pk=None):
        print("here")
        Comments.views.CommentViewSet.create(self, request, pk)



class PostList(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permissions_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    #
    # def create(self, request, *args, **kwargs):
    #     Post.create(self, request.data)



    # def perform_create(self, serializer):
    #     serializer.save(owner= self.request.user)
#
class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated and IsPermissionProvided]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["POST", 'GET'])
    def comments(self, request, pk=None):
        if(request.method == 'POST'):
            data = Comments.views.CommentViewSet.create(self, request, pk)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            qs = Comment.objects.filter(post__id=pk)
            serializer = CommentSerializer(qs, many=True)
            return Response(serializer.data)

    def create(self, request): # any authenticated and active user can comment on any valid post (post owner is active)
        Post.create(self, request.user, request.data)
        request.data['owner id'] = request.user.id
        print("here")
        return Response(request.data, status=status.HTTP_201_CREATED)

    # @action(detail=True, methods=["GET"])
    # def comments(self, request, pk=None):
    #     qs = Comment.objects.filter(post__id= pk)
    #     serializer = CommentSerializer(qs, many=True)
    #     return Response(serializer.data)
    #





