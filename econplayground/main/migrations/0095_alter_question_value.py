# Generated by Django 3.2.19 on 2023-06-13 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0094_alter_questionevaluation_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='value',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]