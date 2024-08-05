# Generated by Django 4.2.14 on 2024-08-05 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0118_alter_graph_graph_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='graph_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Linear Demand and Supply'), (1, 'Input Markets'), (3, 'Cobb-Douglas Production Graph'), (5, 'Consumption-Leisure: Constraint'), (7, 'Consumption-Saving: Constraint'), (8, 'Linear Demand and Supply: 3 Functions'), (9, 'Linear Demand and Supply: Areas'), (10, 'Input Markets: Areas'), (11, 'Consumption-Saving: Optimal Choice'), (15, 'Consumption-Leisure: Optimal Choice'), (12, 'Input-Output Illustrations'), (13, 'Linear Demand and Supply: 2 Diagrams'), (14, 'Input Markets: 2 Diagrams'), (16, 'Template Graph'), (17, 'Optimal Choice: Consumption with 2 Goods'), (18, 'Cost Functions: Total'), (19, 'Cost Functions: Unit'), (20, 'Price Elasticity of Demand and Revenue'), (21, 'Optimal Choice: Cost-Minimizing Production Inputs'), (22, 'Tax Rate and Revenue'), (23, 'Taxation in Linear Demand and Supply'), (24, 'Tax Supply and Demand vs. Tax Revenue')], default=0),
        ),
    ]
