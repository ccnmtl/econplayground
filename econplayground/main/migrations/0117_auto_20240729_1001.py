# Generated by Django 4.2.14 on 2024-07-29 14:01

from django.db import migrations


def migrate_cobb_douglas_fields(apps, schema_editor):
    Graph = apps.get_model("main", "Graph")
    for graph in Graph.objects.filter(graph_type=3):
        # Cobb-Douglas
        graph.a1 = graph.cobb_douglas_a
        graph.a1_name = graph.cobb_douglas_a_name
        graph.a2 = graph.cobb_douglas_l
        graph.a2_name = graph.cobb_douglas_l_name
        graph.a3 = graph.cobb_douglas_k
        graph.a3_name = graph.cobb_douglas_k_name
        graph.a4 = graph.cobb_douglas_alpha
        graph.a4_name = graph.cobb_douglas_alpha_name
        graph.a5_name = graph.cobb_douglas_y_name
        graph.save()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0116_graph_a5_name'),
    ]

    operations = [
        migrations.RunPython(migrate_cobb_douglas_fields),
    ]
