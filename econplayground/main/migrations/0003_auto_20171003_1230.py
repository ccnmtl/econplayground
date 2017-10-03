# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-03 16:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_graph_show_intersection'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='line_1_feedback_decrease',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='graph',
            name='line_1_feedback_increase',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='graph',
            name='line_2_feedback_decrease',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='graph',
            name='line_2_feedback_increase',
            field=models.TextField(blank=True, null=True),
        ),
    ]
