# Generated by Django 4.2.3 on 2023-07-21 16:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0007_rename_tree_assignment_rename_tree_step_assignment'),
    ]

    operations = [
        migrations.AddField(
            model_name='step',
            name='next_step',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='assignment.step'),
        ),
    ]