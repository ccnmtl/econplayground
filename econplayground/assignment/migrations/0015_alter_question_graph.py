# Generated by Django 4.2.14 on 2024-08-01 18:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0118_alter_graph_graph_type'),
        ('assignment', '0014_stepresult_loop'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='graph',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.graph'),
        ),
    ]