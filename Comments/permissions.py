import rest_framework
from rest_framework import permissions

class IsCommentOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print("owner: " + str(obj.owner.id) + "\n requester id:" + str(request.user.id))
        return obj.owner.id == request.user.id

class IsPostOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print("post owner:" + str(obj.post.owner.id))
        print("request id:" + str(request.user.id))
        return obj.post.owner.id == request.user.id




