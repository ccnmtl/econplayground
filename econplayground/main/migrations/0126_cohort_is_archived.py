# Generated by Django 5.1.8 on 2025-04-16 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0125_alter_graph_graph_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='cohort',
            name='is_archived',
            field=models.BooleanField(default=False),
        ),
    ]
