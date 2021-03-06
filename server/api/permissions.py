from rest_framework import permissions

class CanDraft(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        currentDrafter = obj.currentDrafter()
        return currentDrafter and currentDrafter.id == request.user.id


class IsDraftOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and obj.owner == request.user


class IsPredraft(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.state == obj.STATE_PREDRAFT


class IsDraftOwnerOrReadOnly(IsDraftOwner):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return super(IsDraftOwnerOrReadOnly, self).has_object_permission(request, view, obj)
