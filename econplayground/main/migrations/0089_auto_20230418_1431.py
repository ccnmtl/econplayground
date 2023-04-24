# Generated by Django 3.2.18 on 2023-04-18 18:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0088_alter_questionbank_supplemental'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='assessment_rule',
        ),
        migrations.AddField(
            model_name='question',
            name='keywords',
            field=models.TextField(blank=True, default='', max_length=1024),
        ),
        migrations.AddField(
            model_name='question',
            name='value',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.CreateModel(
            name='UserAssignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.assignment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('assignment', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Evaluation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field', models.TextField(default='line_1_label', max_length=1024)),
                ('answered', models.BooleanField(default=False)),
                ('comparison', models.IntegerField(choices=[(-1, 'Negative'), (0, 'None'), (1, 'Positive')], default=0)),
                ('value', models.IntegerField(default=1)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.question')),
            ],
        ),
        migrations.CreateModel(
            name='QuestionEvaluation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order')),
                ('score', models.PositiveSmallIntegerField(default=0)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.question')),
                ('user_assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.userassignment')),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
                'unique_together': {('question', 'user_assignment')},
            },
        ),
    ]