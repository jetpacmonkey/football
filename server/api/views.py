from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from common.models import Player
from draft.models import Draft

from api import serializers


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = serializers.PlayerSerializer


class DraftPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        drafterId = request.data.get('user', None)
        currentDrafter = obj.currentDrafter()
        return currentDrafter and currentDrafter.id == drafterId and request.user.id == drafterId


class DraftViewSet(viewsets.ModelViewSet):
    queryset = Draft.objects.all()
    serializer_class = serializers.DraftSerializer

    @detail_route(methods=('POST',), permission_classes=(DraftPermission,))
    def draft_player(self, request, pk):
        draft = self.get_object()
        type = request.data.get('type', None)
        player = get_object_or_404(draft.getAvailablePlayers(type), id=request.data.get('player', None))
        draft.draftPlayer(player, type)
        return Response({"status": "ok"})
