# Generated by Django 3.2.19 on 2023-05-23 14:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0092_alter_evaluation_unique_together'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='evaluation',
            name='answered',
        ),
    ]
