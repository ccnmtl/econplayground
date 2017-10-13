from rest_framework import serializers
from econplayground.main.models import Graph


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = (
            'id', 'title', 'author',
            'description', 'graph_type',
            'instructor_notes',

            'line_1_slope', 'line_1_label',
            'line_1_feedback_increase', 'line_1_feedback_decrease',

            'line_2_slope', 'line_2_label',
            'line_2_feedback_increase', 'line_2_feedback_decrease',

            'x_axis_label', 'y_axis_label'
        )
