from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.id == request.user.id


class IsSuperuser(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print(str(request.user.is_superuser) + "\n\n")
        return request.user.is_superuser

class IsPermissionProvided(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if(request.method == 'POST' or request.method in SAFE_METHODS): # get, options, head, retrieve
            return True
        else: # delete, update
            return obj.owner.id == request.user.id



