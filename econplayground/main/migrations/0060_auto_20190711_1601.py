# Generated by Django 2.2.3 on 2019-07-11 20:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0059_auto_20190711_1547'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='cohort',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='main.Cohort'),
            preserve_default=False,
        ),
    ]
