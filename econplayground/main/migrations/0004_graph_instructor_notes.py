# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-13 17:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20171003_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='instructor_notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]
