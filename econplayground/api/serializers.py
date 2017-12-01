from rest_framework import serializers
from econplayground.main.models import Graph, Submission


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = (
            'id', 'title',
            'description', 'instructor_notes',
            'graph_type', 'author',
            'is_published', 'needs_submit',
            'show_intersection',

            'line_1_slope', 'line_1_label',
            'line_1_offset',
            'line_1_feedback_increase',
            'line_1_increase_score',
            'line_1_feedback_decrease',
            'line_1_decrease_score',

            'line_2_slope', 'line_2_label',
            'line_2_offset',
            'line_2_feedback_increase',
            'line_2_increase_score',
            'line_2_feedback_decrease',
            'line_2_decrease_score',

            'x_axis_label', 'y_axis_label'
        )


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            'graph', 'choice', 'score'
        )
