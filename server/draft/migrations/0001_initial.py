# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_team'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Draft',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128)),
                ('type', models.CharField(max_length=1, choices=[(b'2', b'2-way players'), (b'1', b'1-way players'), (b'C', b'Cloned 1-way players')])),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Draftee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=1, choices=[(b'O', b'Offense'), (b'D', b'Defense'), (b'B', b'Both (2-way player)')])),
                ('number', models.PositiveSmallIntegerField()),
                ('draft', models.ForeignKey(to='draft.Draft')),
                ('player', models.ForeignKey(to='common.Player')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Drafter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.PositiveSmallIntegerField()),
                ('draft', models.ForeignKey(to='draft.Draft')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['position'],
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='drafter',
            unique_together=set([('draft', 'position')]),
        ),
        migrations.AlterUniqueTogether(
            name='draftee',
            unique_together=set([('draft', 'player', 'type')]),
        ),
        migrations.AddField(
            model_name='draft',
            name='draftees',
            field=models.ManyToManyField(to='common.Player', through='draft.Draftee'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='draft',
            name='drafters',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='draft.Drafter'),
            preserve_default=True,
        ),
    ]
