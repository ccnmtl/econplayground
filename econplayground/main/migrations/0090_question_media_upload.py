# Generated by Django 3.2.18 on 2023-04-24 15:17

from django.db import migrations, models
import econplayground.main.custom_storage


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0089_auto_20230418_1431'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='media_upload',
            field=models.FileField(blank=True, storage=econplayground.main.custom_storage.MediaStorage, upload_to=''),
        ),
    ]