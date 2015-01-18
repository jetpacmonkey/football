from django.db import models
from django.core import validators
from common.models import Base

class Player(Base):
    # generic attributes
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)

    # offensive attributes
    passing = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(3)])
    hands = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(20)])
    rushing = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    receive_short = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    receive_mid = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    receive_deep = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    blocking = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    kicking = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])

    # offensive_special = models.ManyToManyField(SpecialAbility, limit_choices_to={'type': 'offense'})

    pass_man = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(3)])
    pass_zone = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    run_defense = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])
    blitzing = models.PositiveSmallIntegerField(validators=[validators.MaxValueValidator(5)])

    # offensive_special = models.ManyToManyField(SpecialAbility, limit_choices_to={'type': 'defense'})

    def __unicode__(self):
        return "{f} {l}".format(f=self.first_name, l=self.last_name)
