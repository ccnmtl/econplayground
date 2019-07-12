# Generated by Django 2.2.3 on 2019-07-11 19:47

from django.db import migrations


def make_first_cohort(apps, schema_editor):
    # Make a cohort and assign all current Graphs to it.
    Cohort = apps.get_model('main', 'Cohort')
    cohort = Cohort.objects.create(
        title='Tom\'s Course',
        description='This is the first course added to EconPractice.')

    Topic = apps.get_model('main', 'Topic')
    for topic in Topic.objects.filter(cohort=None):
        topic.cohort = cohort
        topic.save()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0058_auto_20190711_1547'),
    ]

    operations = [
        migrations.RunPython(make_first_cohort,
                             reverse_code=migrations.RunPython.noop),
    ]
