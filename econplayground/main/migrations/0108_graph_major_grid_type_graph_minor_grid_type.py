# Generated by Django 4.2.13 on 2024-06-26 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0107_graph_x_axis_min_graph_y_axis_min'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='major_grid_type',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='graph',
            name='minor_grid_type',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
