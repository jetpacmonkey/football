from rest_framework import permissions
from rest_framework import viewsets

from common.models import Player

from draft.models import Draft

from api import serializers


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = serializers.PlayerSerializer


class DraftViewSet(viewsets.ModelViewSet):
    queryset = Draft.objects.all()
    serializer_class = serializers.DraftSerializer
