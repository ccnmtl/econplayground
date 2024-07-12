# Generated by Django 4.2.13 on 2024-07-10 15:34

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0110_alter_graph_graph_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='a1_min',
            field=models.DecimalField(decimal_places=4, default=Decimal('0'), max_digits=12),
        ),
        migrations.AlterField(
            model_name='graph',
            name='a2_min',
            field=models.DecimalField(decimal_places=4, default=Decimal('0'), max_digits=12),
        ),
        migrations.AlterField(
            model_name='graph',
            name='a3_min',
            field=models.DecimalField(decimal_places=4, default=Decimal('0'), max_digits=12),
        ),
        migrations.AlterField(
            model_name='graph',
            name='a4_min',
            field=models.DecimalField(decimal_places=4, default=Decimal('0'), max_digits=12),
        ),
        migrations.AlterField(
            model_name='graph',
            name='a5_min',
            field=models.DecimalField(decimal_places=4, default=Decimal('0'), max_digits=12),
        ),
        migrations.AlterField(
            model_name='graph',
            name='graph_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Linear Demand and Supply'), (1, 'Input Markets'), (3, 'Cobb-Douglas Production Graph'), (5, 'Consumption-Leisure: Constraint'), (7, 'Consumption-Saving: Constraint'), (8, 'Linear Demand and Supply: 3 Functions'), (9, 'Linear Demand and Supply: Areas'), (10, 'Input Markets: Areas'), (11, 'Consumption-Saving: Optimal Choice'), (15, 'Consumption-Leisure: Optimal Choice'), (12, 'Input-Output Illustrations'), (13, 'Linear Demand and Supply: 2 Diagrams'), (14, 'Input Markets: 2 Diagrams'), (16, 'Template Graph'), (17, 'Optimal Choice Consumption'), (18, 'Cost Functions: Total'), (19, 'Cost Functions: Unit'), (20, 'Price Elasticity of Demand and Revenue'), (21, 'Optimal Choice: Cost-Minimizing Production Inputs'), (22, 'Tax Rate and Revenue')], default=0),
        ),
    ]