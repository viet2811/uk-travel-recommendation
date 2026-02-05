from rest_framework import serializers
from .models import Attraction

class AttractionSerializer(serializers.ModelSerializer):
    image_path = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )

    class Meta:
        model = Attraction
        exclude = [
            'parentTypeLabel',
            'labelMHE',
            'labelEmbed',
            'summaryEMbed',
            'finalVector'
        ]