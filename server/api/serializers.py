from rest_framework import serializers

from common.models import Player

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = (
            'id',
            'first_name',
            'last_name',
            'passing',
            'hands',
            'rushing',
            'receive_short',
            'receive_mid',
            'receive_deep',
            'blocking',
            'kicking',
            'pass_man',
            'pass_zone',
            'run_defense',
            'blitzing',
            )
