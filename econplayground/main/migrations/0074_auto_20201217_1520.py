# Generated by Django 2.2.17 on 2020-12-17 20:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0073_auto_20201130_1319'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='area_a_name',
            field=models.TextField(blank=True, default='A'),
        ),
        migrations.AddField(
            model_name='graph',
            name='area_b_name',
            field=models.TextField(blank=True, default='B'),
        ),
        migrations.AddField(
            model_name='graph',
            name='area_c_name',
            field=models.TextField(blank=True, default='C'),
        ),
    ]
