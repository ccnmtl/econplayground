# Generated by Django 2.0.4 on 2018-04-13 18:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0035_auto_20180409_1540'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='graph',
            name='intersection_2_horiz_line_label_editable',
        ),
        migrations.RemoveField(
            model_name='graph',
            name='intersection_2_vert_line_label_editable',
        ),
        migrations.RemoveField(
            model_name='graph',
            name='intersection_3_horiz_line_label_editable',
        ),
        migrations.RemoveField(
            model_name='graph',
            name='intersection_3_vert_line_label_editable',
        ),
        migrations.RemoveField(
            model_name='graph',
            name='intersection_horiz_line_label_editable',
        ),
        migrations.RemoveField(
            model_name='graph',
            name='intersection_vert_line_label_editable',
        ),
    ]
