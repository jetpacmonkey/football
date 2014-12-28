from django.db import models
from django.contrib.auth.models import User

from common.models import Base, Player

class Drafter(Base):
    draft = models.ForeignKey('Draft')
    user = models.ForeignKey(User)
    position = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('draft', 'position')
        ordering = ['position']

class Draftee(Base):
    TYPE_OFFENSE = 'O'
    TYPE_DEFENSE = 'D'
    TYPE_BOTH = 'B'

    TYPE_CHOICES = (
        (TYPE_OFFENSE, 'Offense'),
        (TYPE_DEFENSE, 'Defense'),
        (TYPE_BOTH, 'Both (2-way player)'),
    )

    draft = models.ForeignKey('Draft')
    user = models.ForeignKey(User)
    player = models.ForeignKey(Player)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    number = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('draft', 'player', 'type')


class Draft(Base):
    TYPE_2WAY = '2'
    TYPE_1WAY = '1'
    TYPE_CLONE = 'C'

    TYPE_CHOICES = (
        (TYPE_2WAY, '2-way players'),
        (TYPE_1WAY, '1-way players'),
        (TYPE_CLONE, 'Cloned 1-way players')
    )
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    drafters = models.ManyToManyField(User, through=Drafter)
    draftees = models.ManyToManyField(Player, through=Draftee)
