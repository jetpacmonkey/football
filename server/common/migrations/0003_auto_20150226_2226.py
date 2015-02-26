# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_team'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='blitzing',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='blocking',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='hands',
            field=models.PositiveSmallIntegerField(help_text=b'0-20', validators=[django.core.validators.MaxValueValidator(20)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='kicking',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='pass_man',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='pass_zone',
            field=models.PositiveSmallIntegerField(help_text=b'0-3', validators=[django.core.validators.MaxValueValidator(3)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='passing',
            field=models.PositiveSmallIntegerField(help_text=b'0-3', validators=[django.core.validators.MaxValueValidator(3)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='receive_deep',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='receive_mid',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='receive_short',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='run_defense',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='player',
            name='rushing',
            field=models.PositiveSmallIntegerField(help_text=b'0-5', validators=[django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
    ]
