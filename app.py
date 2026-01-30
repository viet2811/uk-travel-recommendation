# RESEMBLE THE BACKEND SYSTEM

import lancedb
import numpy as np
import pandas as pd

uri = "ex_lancedb"
db = lancedb.connect(uri)

item_table = db.open_table("attractions")

class User:
    def __init__(self, mhe: list):
        self.labelMHE = np.array(mhe)
        self.labelEmbed = np.zeros(384)
        self.summaryEmbed = np.zeros(384)

        self.visitedIndeces = set()

        # Learning rate
        self.MHE_LIKE_LEARNING_RATE = 0.2
        self.LABEL_EMBED_LIKE_LEARNING_RATE = 0.1
        self.SUMMARY_EMBED_LIKE_LEARNING_RATE = 0.1

        self.MHE_DISLIKE_LEARNING_RATE = 0.1
        self.EMBED_REJECTION_RATE = 0.3

        self.MMR_LAMBDA = 0.3 # Diversity 0...1 Relevance

    def like(self, attractionRow):
        pass
    
    def dislike(self, attractionRow):
        pass
    
    def getRecommendations(self, n=5, geo_filter_type="none", geo_filter_name=""):
        # Random pre-check probably doesnt matter that much
        if geo_filter_type not in ["county", "region", "country", "none"]:
            return TypeError("Not a valid geo_filter")
        
        if geo_filter_type != "none":
            if not geo_filter_name: return ValueError("Need to provide a filter name")
            geo_filter = f"{geo_filter_type} == '{geo_filter_name}'"
        else:
            geo_filter =  "country != ''"

        #TODO: Get UserVector here...

        knn_results = (
            item_table.search(query="TODO: UserVector", vector_column_name="finalVector")
            .distance_type("cosine")
            .where(geo_filter)
            #TODO: filter out visited places
            .limit(100)
            .to_pandas()    
        )

        #TODO: DO the MMR thing

                    
        #TODO: return the recommendations, as the DF

        
