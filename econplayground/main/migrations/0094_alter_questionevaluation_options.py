# Generated by Django 3.2.19 on 2023-05-24 18:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0093_remove_evaluation_answered'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='questionevaluation',
            options={'ordering': ('user_assignment', 'order')},
        ),
    ]
