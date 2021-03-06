# Generated by Django 2.2.17 on 2020-11-30 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0072_auto_20201117_1120'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='area_configuration',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='graph',
            name='is_area_displayed',
            field=models.BooleanField(default=True),
        ),
    ]
