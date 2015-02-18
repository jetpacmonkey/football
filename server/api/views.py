from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import detail_route, api_view
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from common.models import Player
from draft.models import Draft

from api import serializers
from api import permissions as api_permissions


@api_view()
def session_info(request):
    return Response({
        "user": request.user.id
    })


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = serializers.PlayerSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer


class DraftViewSet(viewsets.ModelViewSet):
    queryset = Draft.objects.all()
    serializer_class = serializers.DraftSerializer
    permission_classes = (api_permissions.IsDraftOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @detail_route(methods=('POST',), permission_classes=(api_permissions.CanDraft,))
    def draft_player(self, request, pk):
        draft = self.get_object()
        type = request.data.get('type', None)
        player = get_object_or_404(draft.getAvailablePlayers(type), id=request.data.get('player', None))
        draft.draftPlayer(player, type)
        return Response({"status": "ok"})

    @detail_route(
        methods=('POST',),
        permission_classes=(api_permissions.IsDraftOwner, api_permissions.IsPredraft)
        )
    def add_drafter(self, request, pk):
        draft = self.get_object()
        userId = request.data.get('user', None)
        if hasattr(userId, "__iter__"):
            ids = userId
        else:
            ids = [userId]
        users = User.objects.filter(id__in=ids)
        for u in users:
            draft.addDrafter(u)
        return self.retrieve(request, pk)

    @detail_route(
        methods=('POST',),
        permission_classes=(api_permissions.IsDraftOwner, api_permissions.IsPredraft)
        )
    def remove_drafter(self, request, pk):
        draft = self.get_object()
        drafter = get_object_or_404(User, id=request.data.get('user', None))
        draft.removeDrafter(drafter)
        return self.retrieve(request, pk)

    @detail_route()
    def current_drafter(self, request, pk):
        draft = self.get_object()
        drafter = draft.currentDrafter()
        return Response({"user": drafter.id if drafter else None})

    @detail_route()
    def available_players(self, request, pk):
        draft = self.get_object()
        players = draft.getAvailablePlayers()
        return Response({"players": players.values_list('id', flat=True)})
