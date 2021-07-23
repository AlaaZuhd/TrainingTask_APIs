from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, viewsets
from .permissions import IsCommentOwner, IsPostOwner
from .serializers import CommentSerializer
from .models import Comment


class CommentViewSet(viewsets.ModelViewSet):
    #queryset = Comment.objects.filter(owner__is_active= True, post__owner__is_active= True, owner__id= self.request.user.id)
    serializer_class = CommentSerializer
    authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    permission_classes = [IsAuthenticated and (IsCommentOwner | IsPostOwner)]
    queryset = Comment.objects.all()

    def get_queryset(self):
        if(self.action == 'list'):
            print(self.request)
            return Comment.objects.filter(owner__is_active= True, post__owner__is_active= True, owner__id= self.request.user.id)
        return Comment.objects.filter(owner__is_active= True, post__owner__is_active= True)

# we need tthis one, since different permissions can be provided
    def get_permissions(self):
        if self.action == 'post':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update':
            permission_classes = [IsAuthenticated and IsCommentOwner]
        elif self.action == 'destroy' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated and (IsCommentOwner | IsPostOwner)]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_object(self):
        if self.kwargs.get('pk', None) == 'me':
            self.kwargs['pk'] = self.request.user.pk
        return super(CommentViewSet, self).get_object()

    def create(self, request, pk): # any authenticated and active user can comment on any valid post (post owner is active)
        Comment.create(self, request.user, pk, request.data)
        request.data['owner id'] = request.user.id
        request.data['post_id'] = pk
        return request.data




    #def retrieve(self, request, *args, **kwargs):# the logged in user (authenticated and active user) can only retrieve his/her comments


#
# class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
#     authentication_classes = [TokenAuthentication]
#     permissions_classes = [IsAuthenticated]
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer
#     #permission_classes = [IsPermissionProvided]
#
#     def update(self, request, *args, **kwargs):
#         return super().update(request, *args, **kwargs)
#
#
#     def destroy(self, request, *args, **kwargs):
#         return super().destroy(request, *args, **kwargs)
#
#
#
#
# # create anew comment, list my comment
# class CommentList(generics.ListCreateAPIView):
#
#     authentication_classes = [TokenAuthentication]
#     #permissions_classes = [IsAuthenticated]
#     #queryset = Comment.objects.filter(owner__is_active= True, post__owner__is_active= True, owner__id= self.request.user.id)
#     serializer_class = CommentSerializer
#
#
#     def get_queryset(self):
#         return Comment.objects.filter(owner__is_active= True, post__owner__is_active= True, owner__id= self.request.user.id)
#     #     #return Comment.objects.filter(owner__is_active= True, post__owner__is_active= True)
#     #     return .get_comments_quryset(self, self.request)
#     # def get_queryset(self):
#     #     return Comment.objects.get_queryset()
#
#     # def get_object(self):
#     #     if self.kwargs.get('pk', None) == 'me':
#     #         self.kwargs['pk'] = self.request.user.pk
#     #     return super(CommentList, self).get_object()
#
#     def create(self, request, *args, **kwargs): # any authenticated and active user can comment on any valid post (post owner is active)
#         request.data['pk'] = kwargs['pk']
#         comment= Comment.create(self, request.user, kwargs['pk'], request.data)
#         return Response(request.data, status=status.HTTP_201_CREATED)
#


