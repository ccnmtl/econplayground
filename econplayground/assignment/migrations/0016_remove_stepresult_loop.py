# Generated by Django 4.2.15 on 2024-08-11 16:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0015_alter_question_graph'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stepresult',
            name='loop',
        ),
    ]
