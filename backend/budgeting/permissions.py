from rest_framework import permissions

class IsGroupMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'group'):
            group = obj.group
        else:
            group = obj
        return request.user in group.members.all()