# Generated by Django 2.2.3 on 2019-07-08 20:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0055_auto_20190221_1201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='order',
            field=models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order'),
        ),
        migrations.AlterField(
            model_name='topic',
            name='order',
            field=models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order'),
        ),
        migrations.CreateModel(
            name='Cohort',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('instructors', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
