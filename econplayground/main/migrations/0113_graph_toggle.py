# Generated by Django 4.2.14 on 2024-07-19 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0112_alter_graph_graph_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='graph',
            name='toggle',
            field=models.BooleanField(default=False),
        ),
    ]
