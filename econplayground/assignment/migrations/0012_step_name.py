# Generated by Django 4.2.8 on 2023-12-06 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0011_multiplechoice'),
    ]

    operations = [
        migrations.AddField(
            model_name='step',
            name='name',
            field=models.TextField(blank=True, max_length=1024, null=True),
        ),
    ]