# Generated by Django 4.2.2 on 2023-06-30 17:58

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0097_remove_assignment_cohorts_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('assignment', '0006_alter_step_question'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Tree',
            new_name='Assignment',
        ),
        migrations.RenameField(
            model_name='step',
            old_name='tree',
            new_name='assignment',
        ),
    ]