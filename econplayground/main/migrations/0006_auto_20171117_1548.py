# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-17 20:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20171116_1642'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='line_1_offset',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='graph',
            name='line_2_offset',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='submission',
            name='choice',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
