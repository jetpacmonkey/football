# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('draft', '0003_draft_numdrafted'),
    ]

    operations = [
        migrations.AddField(
            model_name='draft',
            name='owner',
            field=models.ForeignKey(related_name='draftOwner', to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='draft',
            name='state',
            field=models.CharField(default=b'P', max_length=1, choices=[(b'P', b'Pre-draft'), (b'D', b'Drafting'), (b'F', b'Post-draft')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='draft',
            name='type',
            field=models.CharField(default=b'2', max_length=1, choices=[(b'2', b'2-way players'), (b'1', b'1-way players'), (b'C', b'Cloned 1-way players')]),
            preserve_default=True,
        ),
    ]
