from rest_framework import serializers
from econplayground.main.models import Graph


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = (
            'id', 'title', 'author',
            'description', 'graph_type',
            'line_1_slope', 'line_2_slope',
            'line_1_label', 'line_2_label',
            'x_axis_label', 'y_axis_label'
        )
