# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='draftee',
            options={'ordering': ['number']},
        ),
        migrations.AlterUniqueTogether(
            name='draftee',
            unique_together=set([('draft', 'number'), ('draft', 'player', 'type')]),
        ),
    ]
