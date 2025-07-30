from rest_framework import serializers
from econplayground.main.models import (
    Graph, Cohort, Assessment, AssessmentRule, Topic
)
from econplayground.assignment.models import (
    AssessmentRule as AssignmentAssessmentRule,
    Question, MultipleChoice
)


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = (
            'id', 'title', 'summary',
            'instructions', 'instructor_notes',
            'graph_type',
            'assignment_type',
            'author', 'featured',
            'is_published', 'needs_submit',
            'display_feedback',
            'display_shadow',
            'topic',

            'show_intersection',
            'display_intersection_1',
            'display_intersection_2',
            'display_intersection_3',

            'intersection_label',

            'intersection_horiz_line_label',
            'intersection_vert_line_label',

            'intersection_2_horiz_line_label',
            'intersection_2_vert_line_label',

            'intersection_3_horiz_line_label',
            'intersection_3_vert_line_label',

            'intersection_2_label',
            'intersection_3_label',

            'line_1_slope',
            'line_1_label',
            'line_1_offset_x',
            'line_1_offset_y',
            'line_1_dashed',

            'line_2_slope',
            'line_2_label',
            'line_2_offset_x',
            'line_2_offset_y',
            'line_2_dashed',

            'line_3_slope',
            'line_3_label',
            'line_3_offset_x',
            'line_3_offset_y',
            'line_3_dashed',

            'line_4_slope',
            'line_4_label',
            'line_4_offset_x',
            'line_4_offset_y',
            'line_4_dashed',

            'a1', 'a1_name', 'a1_min', 'a1_max',
            'a2', 'a2_name', 'a2_min', 'a2_max',
            'a3', 'a3_name', 'a3_min', 'a3_max',
            'a4', 'a4_name', 'a4_min', 'a4_max',
            'a5', 'a5_name', 'a5_min', 'a5_max',
            'a6', 'a7', 'a8',

            'a',
            'k',
            'r',
            'y1',
            'y2',

            'x_axis_label',
            'x_axis_max',
            'x_axis_min',
            'y_axis_label',
            'y_axis_max',
            'y_axis_min',

            'x_axis_2_label',
            'y_axis_2_label',

            'cobb_douglas_a',
            'cobb_douglas_a_name',
            'cobb_douglas_l',
            'cobb_douglas_l_name',
            'cobb_douglas_k',
            'cobb_douglas_k_name',
            'cobb_douglas_alpha',
            'cobb_douglas_alpha_name',
            'cobb_douglas_y_name',

            'n_name',

            'function_choice',
            'toggle',

            'area_configuration',
            'is_area_displayed',

            'area_a_name',
            'area_b_name',
            'area_c_name',
            'expression',
            'expression_2',
            'expression_3',
            'major_grid_type',
            'minor_grid_type',
        )

    def create(self, validated_data):
        graph = Graph.objects.create(**validated_data)

        return graph

    def update(self, instance, validated_data):
        for field in validated_data:
            newval = validated_data.get(field, getattr(instance, field))
            setattr(instance, field, newval)

        instance.save()

        return instance


class GraphTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graph
        fields = ('graph_type',)


class AssessmentRulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentRule
        fields = ('name', 'value', 'feedback_fulfilled',
                  'feedback_unfulfilled', 'score')


class AssessmentSerializer(serializers.ModelSerializer):
    assessmentrule_set = AssessmentRulesSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ('graph', 'assessmentrule_set',)


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('pk', 'name',)


class CohortSerializer(serializers.ModelSerializer):
    topic_set = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Cohort
        fields = (
            'pk', 'title', 'topic_set',
        )


class AssessmentRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentAssessmentRule
        fields = (
            'pk',
            'assessment_name', 'assessment_value',
            'feedback_fulfilled', 'media_fulfilled',
            'feedback_unfulfilled', 'media_unfulfilled',
        )


class QuestionSerializer(serializers.ModelSerializer):
    assessmentrule_set = AssessmentRuleSerializer(many=True)
    graph = GraphSerializer(read_only=True)

    class Meta:
        model = Question
        fields = (
            'pk', 'title', 'prompt', 'assessmentrule_set',
            'graph', 'assessment_type',
        )


class MultipleChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoice
        fields = (
            'pk', 'question', 'text', 'choices', 'correct',
        )
