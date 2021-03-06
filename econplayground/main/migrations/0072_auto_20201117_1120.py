# Generated by Django 2.2.17 on 2020-11-17 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0071_auto_20201028_1402'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='graph_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Linear Demand and Supply'), (1, 'Non-Linear Demand and Supply'), (2, 'Labor Market (perfectly inelastic)'), (3, 'Cobb-Douglas Production Function'), (4, 'Labor Supply'), (5, 'Consumption-Leisure: Constraint'), (6, 'Saving - Investment'), (7, 'Consumption-Saving: Constraint'), (8, 'Linear Demand and Supply: 3 Functions'), (9, 'Linear Demand and Supply: AUC'), (10, 'Non-Linear Demand and Supply: AUC'), (11, 'Optimal Choice and Budget Constraints'), (12, 'Cobb-Douglas NLDS')], default=0),
        ),
    ]
