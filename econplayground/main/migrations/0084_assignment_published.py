# Generated by Django 3.2.17 on 2023-02-03 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0083_assignment_prompt'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='published',
            field=models.BooleanField(default=False),
        ),
    ]