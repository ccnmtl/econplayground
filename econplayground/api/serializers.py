from rest_framework import serializers
from econplayground.main.models import (
    Graph, JXGLine, JXGLineTransformation, Submission
)


class JXGLineTransformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JXGLineTransformation
        fields = ('z', 'x', 'y')


class JXGLineSerializer(serializers.ModelSerializer):
    transformations = JXGLineTransformationSerializer(many=True)

    class Meta:
        model = JXGLine
        fields = (
            'number', 'transformations',
        )

    def create(self, validated_data):
        transformations_data = validated_data.pop('transformations')
        line = JXGLine.objects.create(**validated_data)
        for transformation_data in transformations_data:
            JXGLineTransformation.objects.create(
                line=line, **transformation_data)
        return line

    def update(self, instance, validated_data):
        transformations = JXGLineTransformation.objects.filter(line=instance)
        for transformation in transformations:
            transformation.delete()

        transformations_data = validated_data.pop('transformations')
        for transformation_data in transformations_data:
            JXGLineTransformation.objects.create(
                line=instance, **transformation_data)

        return instance


class GraphSerializer(serializers.ModelSerializer):
    lines = JXGLineSerializer(many=True, required=False)

    class Meta:
        model = Graph
        fields = (
            'lines',
            'id', 'title',
            'description', 'instructor_notes',
            'graph_type',
            'interaction_type',
            'author',
            'is_published', 'needs_submit',
            'display_feedback',
            'display_shadow',
            'correct_feedback',
            'incorrect_feedback',

            'show_intersection',
            'intersection_label',
            'intersection_label_editable',
            'intersection_horiz_line_label',
            'intersection_horiz_line_label_editable',
            'intersection_vert_line_label',
            'intersection_vert_line_label_editable',

            'line_1_slope',
            'line_1_slope_editable',
            'line_1_label',
            'line_1_label_editable',
            'line_1_offset_x',
            'line_1_offset_y',

            'line_1_feedback_increase',
            'line_1_increase_score',
            'line_1_feedback_decrease',
            'line_1_decrease_score',

            'line_2_slope',
            'line_2_slope_editable',
            'line_2_label',
            'line_2_label_editable',
            'line_2_offset_x',
            'line_2_offset_y',

            'line_2_feedback_increase',
            'line_2_increase_score',
            'line_2_feedback_decrease',
            'line_2_decrease_score',

            'alpha',
            'omega',

            'a1', 'a1_editable',
            'a2', 'a2_editable',
            'a3', 'a3_editable',
            'a4', 'a4_editable',
            'a5', 'a5_editable',

            'a',
            'k',
            'r',
            'y1',
            'y2',

            'x_axis_label',
            'x_axis_label_editable',
            'y_axis_label',
            'y_axis_label_editable',

            'cobb_douglas_a',
            'cobb_douglas_a_name',
            'cobb_douglas_a_editable',
            'cobb_douglas_l',
            'cobb_douglas_l_name',
            'cobb_douglas_l_editable',
            'cobb_douglas_k',
            'cobb_douglas_k_name',
            'cobb_douglas_k_editable',
            'cobb_douglas_alpha',
            'cobb_douglas_alpha_name',
            'cobb_douglas_alpha_editable',
            'cobb_douglas_y_name',
            'cobb_douglas_correct_scenario',
        )

    def create(self, validated_data):
        lines_data = []
        if 'lines' in validated_data:
            lines_data = validated_data.pop('lines')

        graph = Graph.objects.create(**validated_data)

        for line_data in lines_data:
            JXGLine.objects.create(graph=graph, **line_data)

        return graph

    def update(self, instance, validated_data):
        lines_data = []
        if 'lines' in validated_data:
            lines = JXGLine.objects.filter(graph=instance)
            for line in lines:
                line.delete()

            lines_data = validated_data.pop('lines')

        for field in validated_data:
            newval = validated_data.get(field, getattr(instance, field))
            setattr(instance, field, newval)
        instance.save()

        for line_data in lines_data:
            JXGLine.objects.create(graph=instance, **line_data)

        return instance


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            'graph', 'choice', 'score'
        )
