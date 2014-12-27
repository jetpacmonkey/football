# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('first_name', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
                ('passing', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(3)])),
                ('hands', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(20)])),
                ('rushing', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('receive_short', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('receive_mid', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('receive_deep', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('blocking', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('kicking', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('pass_man', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(3)])),
                ('pass_zone', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('run_defense', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
                ('blitzing', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(5)])),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
