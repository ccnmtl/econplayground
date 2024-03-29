# Generated by Django 3.2.16 on 2022-12-21 14:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0080_auto_20210428_1540'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('adaptive', models.BooleanField(default=False)),
                ('title', models.TextField(default='Untitled', max_length=1024)),
                ('embedded_media', models.TextField(blank=True, default='')),
                ('is_assessment', models.BooleanField(default=True)),
                ('is_key', models.BooleanField(default=True)),
                ('prompt', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ap_correct', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ap_continue', to='main.question')),
                ('ap_incorrect', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ap_intervene', to='main.question')),
                ('graph', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.graph')),
            ],
        ),
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(default='Untitled', max_length=1024)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cohorts', models.ManyToManyField(blank=True, to='main.Cohort')),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('questions', models.ManyToManyField(blank=True, to='main.Question')),
            ],
        ),
    ]
