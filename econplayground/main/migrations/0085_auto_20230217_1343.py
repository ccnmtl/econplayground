# Generated by Django 3.2.18 on 2023-02-17 18:43

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0084_assignment_published'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='questionbank',
            options={'ordering': ('order',)},
        ),
    ]
