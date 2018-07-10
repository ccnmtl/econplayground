from django.db import migrations


def update_graph_order(apps, schema_editor):
    Graph = apps.get_model('main', 'Graph')
    for idx, graph in enumerate(Graph.objects.all()):
        graph.order = idx
        graph.save()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0050_auto_20180703_1545'),
    ]

    operations = [
        migrations.RunPython(update_graph_order),
    ]
