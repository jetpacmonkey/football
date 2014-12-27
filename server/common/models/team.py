from django.db import models

from django.contrib.auth.models import User

from common.models import Base, Player

class Team(Base):
    name = models.CharField(max_length=128)
    owner = models.ForeignKey(User)
    offensive_players = models.ManyToManyField(Player, related_name="offense")
    defensive_players = models.ManyToManyField(Player, related_name="defense")
