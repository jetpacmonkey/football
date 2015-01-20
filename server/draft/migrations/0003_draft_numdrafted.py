# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0002_auto_20141228_0021'),
    ]

    operations = [
        migrations.AddField(
            model_name='draft',
            name='numDrafted',
            field=models.PositiveIntegerField(default=0),
            preserve_default=True,
        ),
    ]
