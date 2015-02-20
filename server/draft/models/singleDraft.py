from django.db import models
from django.contrib.auth.models import User

from common.models import Base, Player

class Drafter(Base):
    draft = models.ForeignKey('Draft')
    user = models.ForeignKey(User)
    position = models.PositiveSmallIntegerField(default=0)

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
    PLAYER_TYPE_2WAY = '2'
    PLAYER_TYPE_1WAY = '1'
    PLAYER_TYPE_CLONE = 'C'

    PLAYER_TYPE_CHOICES = (
        (PLAYER_TYPE_1WAY, '1-way players'),
        (PLAYER_TYPE_2WAY, '2-way players'),
        (PLAYER_TYPE_CLONE, 'Cloned 1-way players'),  # offense and defensive versions of the same player can be taken
    )

    STATE_PREDRAFT = 'P'
    STATE_DRAFTING = 'D'
    STATE_POSTDRAFT = 'F'

    STATE_CHOICES = (
        (STATE_PREDRAFT, 'Pre-draft'),
        (STATE_DRAFTING, 'Drafting'),
        (STATE_POSTDRAFT, 'Post-draft'),
    )

    name = models.CharField(max_length=128)
    type = models.CharField(max_length=1, choices=PLAYER_TYPE_CHOICES, default=PLAYER_TYPE_2WAY)
    owner = models.ForeignKey(User, related_name='draftOwner', null=True)
    state = models.CharField(max_length=1, choices=STATE_CHOICES, default=STATE_PREDRAFT)
    drafters = models.ManyToManyField(User, through=Drafter)
    draftees = models.ManyToManyField(Player, through=Draftee)
    numDrafted = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return "{name} ({num} players drafted)".format(name=self.name, num=self.numDrafted)

    def addDrafter(self, user):
        drafter = Drafter()
        drafter.draft = self
        drafter.user = user
        if self.drafters.exists():
            drafter.position = self.drafter_set.all().reverse()[0].position + 1
        drafter.save()

    def removeDrafter(self, user):
        Drafter.objects.filter(draft=self, user=user).delete()

    def getAvailablePlayers(self, type=None):
        all = Player.objects.all()
        if self.type in (self.PLAYER_TYPE_1WAY, self.PLAYER_TYPE_2WAY):
            all = all.exclude(id__in=self.draftees.all())
        elif self.type == PLAYER_TYPE_CLONE:
            draftee_objects = Draftee.objects.filter(draft=self)
            if type:
                all = all.exclude(
                    id__in=(draftee_objects.filter(type=Draftee.TYPE_OFFENSE) &
                        draftee_objects.filter(type=Draftee.TYPE_DEFENSE)).values_list('player', flat=True))
            else:
                all = all.exclude(id__in=draftee_objects.filter(type=type).values_list('player', flat=True))
        return all

    def getDrafteeData(self):
        draftee_objects = Draftee.objects.filter(draft=self)
        return [(d.player_id, d.type) for d in draftee_objects]

    def currentDrafter(self):
        numDrafters = self.drafters.count()
        if numDrafters == 0:
            return None

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
        elif self.type != self.PLAYER_TYPE_2WAY and type is None:
            raise "Type is required when it's not a 2-way player draft"

        if self.type == self.PLAYER_TYPE_2WAY:
            type = Draftee.TYPE_BOTH

        draftee = Draftee()
        draftee.draft = self
        draftee.user = self.currentDrafter()
        draftee.player = player
        draftee.type = type
        draftee.number = self.numDrafted + 1
        draftee.save()
        self.numDrafted = self.numDrafted + 1
        self.save()

