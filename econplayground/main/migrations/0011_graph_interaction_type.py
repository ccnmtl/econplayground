# Generated by Django 2.0 on 2017-12-15 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_auto_20171205_1545'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='interaction_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Draggable lines'), (1, 'Area selection')], default=0),
        ),
    ]
