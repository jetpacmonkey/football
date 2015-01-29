import json

from rest_framework import serializers

from django.contrib.auth.models import User
from common.models import Player
from draft.models import Draft

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player


class DraftersField(serializers.Field):
    def to_representation(self, obj):
        return list(obj.values_list('id', flat=True))


class DraftSerializer(serializers.ModelSerializer):
    drafters = DraftersField(read_only=True)

    class Meta:
        model = Draft
        fields = ('id', 'name', 'owner', 'state', 'type', 'drafters')
