import rest_framework
from rest_framework import permissions

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #print("owner: " + str(obj.id == request.user.id))
        return obj.id == request.user.id


class IsSuperuser(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        #print(str(request.user.is_superuser) + "\n\n")
        return request.user.is_superuser


class IsAuthenticated(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if(request.method == 'POST'):
            return True;
        else:
            return rest_framework.permissions.IsAuthenticated


class IsSuperuserForListOrPost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if(request.method == 'POST'):
            print(request.user.is_superuser)
            return True;
        else:
            print(request.user.is_superuser)
            return request.user.is_superuser




