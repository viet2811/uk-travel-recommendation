from rest_framework import serializers
from .models import Attraction

class AttractionSerializer(serializers.ModelSerializer):
    image_path = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
    # match_score = serializers.FloatField(source='similarity', read_only=True)

    class Meta:
        model = Attraction
        exclude = [
            'labelMHE',
            'labelEmbed',
            'summaryEmbed',
            'finalVector'
        ]