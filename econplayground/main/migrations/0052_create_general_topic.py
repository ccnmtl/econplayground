from django.db import migrations
from django.db.utils import IntegrityError


def create_general_topic(apps, schema_editor):
    Graph = apps.get_model('main', 'Graph')
    Topic = apps.get_model('main', 'Topic')

    Graph.objects.all().update(topic=None)
    Topic.objects.all().delete()

    try:
        t = Topic.objects.create(name='General', pk=1, order=1)
    except IntegrityError:
        t = Topic.objects.get(pk=1)

    Graph.objects.all().update(topic=t)


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0051_set_graph_order')
    ]

    operations = [
        migrations.RunPython(create_general_topic),
    ]
