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
        unique_together = (('draft', 'player', 'type'), ('draft', 'number'))
        ordering = ['number']


class Draft(Base):
    TYPE_2WAY = '2'
    TYPE_1WAY = '1'
    TYPE_CLONE = 'C'

    TYPE_CHOICES = (
        (TYPE_2WAY, '2-way players'),
        (TYPE_1WAY, '1-way players'),
        (TYPE_CLONE, 'Cloned 1-way players'),  # offense and defensive versions of the same player can be taken
    )
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    drafters = models.ManyToManyField(User, through=Drafter)
    draftees = models.ManyToManyField(Player, through=Draftee)
    numDrafted = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return "{name} ({num} players drafted)".format(name=self.name, num=self.numDrafted)

    def addDrafter(self, user):
        drafter = Drafter()
        drafter.draft = self
        drafter.user = user
        drafter.position = self.drafters.reverse()[0].position + 1
        self.drafters.add(drafter)

    def getAvailablePlayers(self, type=None):
        all = Player.objects.all()
        if self.type in (TYPE_1WAY, TYPE_2WAY):
            all = all.exclude(id__in=self.draftees())
        elif self.type == TYPE_CLONE:
            if type:
                all = all.exclude(
                    id__in=self.draftees.filter(type=Draftee.TYPE_OFFENSE) |
                        self.draftees.filter(type=Draftee.TYPE_DEFENSE))
            else:
                all = all.exclude(id__in=self.draftees.filter(type))
        return all


    def currentDrafter(self):
        numDrafters = self.drafters.count()
        curPos = self.numDrafted % numDrafters
        curRound = self.numDrafted // numDrafters
        if curRound % 2:
            # odd round (0-indexed), reverse order
            return self.drafters.reverse()[curPos]
        else:
            return self.drafters.all()[curPos]

    def draftPlayer(self, player, type=None):
        if not self.getAvailablePlayers(type).filter(id=player.id).exists():
            raise "Player can't be drafted"
        draftee = Draftee()
        draftee.draft = self
        draftee.user = self.currentDrafter()
        draftee.player = player
        self.draftees.add(draftee)
        self.numDrafted = self.numDrafted + 1
        self.save()

