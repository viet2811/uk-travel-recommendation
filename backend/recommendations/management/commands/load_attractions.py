import pandas as pd
import numpy as np
from django.core.management.base import BaseCommand
from recommendations.models import Attraction
from shapely import wkt
from recommendations.utils import normalize

def pathStrToList(pathStr: str):
    return [path.strip() for path in pathStr.split(",")]

class Command(BaseCommand):
    help = 'Load full attractions data in DB'

    def handle(self, *args, **options):
        df = pd.read_csv("uk_attractions_main_valid_locations.csv", encoding="utf-8",sep=";")
        vectors_df = pd.read_pickle("uk_attractions_vectors.pkl")

        df2 = df.drop(columns="image").join(vectors_df.drop(columns=['name', 'image_path']), on="id")
        df2 = df2.fillna("")
        df2['image_list'] = df2['image_path'].apply(pathStrToList)
        
        self.stdout.write(f"Prepared {len(df2)} rows for insertion.")

        # Clear the attraction rows to rewrite
        Attraction.objects.all().delete()

        # BULK
        objects_to_create = []
        for _, row in df2.iterrows():
            image_path_list = row['image_list']
            location = wkt.loads(row['coordinates'])
            latitude = location.y
            longtitude = location.x

            attraction =  Attraction(
                id=row['id'],
                name=row['name'],
                parentTypeLabel=row['parentTypeLabel'],
                typeLabel=row['typeLabel'],
                latitude=latitude,
                longtitude=longtitude,
                wikipedia=row['wikipedia'],
                summary=row['summary'],
                image_path=image_path_list,
                county=row['county'],
                region=row['region'],
                country=row['country'],

                labelMHE=row['labelMHE'].tolist(),
                labelEmbed=row['labelVectors'].tolist(),
                summaryEmbed=row['summaryVectors'].tolist(),
                finalVector=normalize(row['labelMHE'],row['labelVectors'], row['summaryVectors']).tolist(),
            )
            objects_to_create.append(attraction)

            if len(objects_to_create) >= 1000:
                Attraction.objects.bulk_create(objects_to_create, ignore_conflicts=True)
                self.stdout.write(".", ending="")
                objects_to_create = []

        if objects_to_create:
            Attraction.objects.bulk_create(objects_to_create, ignore_conflicts=True)
    
        self.stdout.write(self.style.SUCCESS('\nDB Load Complete!'))
            