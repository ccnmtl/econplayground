# Generated by Django 4.2.16 on 2024-09-04 19:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0019_rename_steps_scorepath_step_results'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='step',
            name='next_step',
        ),
    ]
