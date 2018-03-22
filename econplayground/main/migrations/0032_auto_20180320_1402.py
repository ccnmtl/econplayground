# Generated by Django 2.0.3 on 2018-03-20 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0031_auto_20180319_1255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='graph_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Linear Demand and Supply'), (1, 'Non-Linear Demand and Supply'), (2, 'Labor Market (perfectly inelastic)'), (3, 'Cobb-Douglas'), (4, 'Labor Supply'), (5, 'Consumption - Leisure'), (6, 'Saving - Investment'), (7, 'Consumption - Saving'), (8, 'Aggregate Demand - Aggregate Supply')], default=0),
        ),
    ]
