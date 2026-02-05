from django.db import models
from pgvector.django import VectorField

# Create your models here.
class Attraction(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField()
    
    parentTypeLabel = models.CharField(max_length=100)
    typeLabel = models.CharField(max_length=200)
    #coordinates = models.CharField(max_length=100) # POINT(longtitude, latitude)
    latitude = models.FloatField()
    longtitude = models.FloatField()
    wikipedia = models.URLField()
    summary = models.TextField() 
    image_path = models.JSONField(default=list) #some contains more than one image
    county = models.CharField(max_length=50, blank=True)
    region = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50)

    labelMHE = VectorField(dimensions=9)
    labelEmbed = VectorField(dimensions=384)
    summaryEmbed = VectorField(dimensions=384)

    finalVector = VectorField(dimensions=777)
    

    class Meta:
        indexes = [
            models.Index(fields=['county'], name='idx_county'),
            models.Index(fields=['region'], name='idx_region'),
            models.Index(fields=['country'], name='idx_country'),
        ]