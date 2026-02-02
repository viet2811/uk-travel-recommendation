# RESEMBLE THE BACKEND SYSTEM

import lancedb
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn import preprocessing

uri = "ex_lancedb"
db = lancedb.connect(uri)

item_table = db.open_table("attractions")

WEIGHT_MULTI = 2.0
WEIGHT_TYPE = 1.0
WEIGHT_SUMMARY = 0.5

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
    
    def getUserVector(self):
        # Normalize in L2 #TODO: recheck if this is valid valid
        combined = np.concatenate([
            preprocessing.normalize([self.labelMHE])[0] * WEIGHT_MULTI,
            preprocessing.normalize([self.labelEmbed])[0] * WEIGHT_TYPE,
            preprocessing.normalize([self.summaryEmbed])[0] * WEIGHT_SUMMARY,

        ])
        return preprocessing.normalize([combined])[0]
    
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
        userVector = self.getUserVector()
        knn_results = (
            item_table.search(query=userVector, vector_column_name="finalVector")
            .distance_type("cosine")
            .where(geo_filter)
            .limit(100)
            .to_pandas()    
        )
        knn_results['relevance'] = knn_results["_distance"].apply(lambda distance: 1 - distance)

        # MMR - Maximal Marginal Relevance, avoid suggesting places 90-99% identical to each other
        mmr_results = pd.DataFrame()
        for _ in range(n):
            best_mmr = -np.inf
            best_idx = -1

            for i, row in enumerate(knn_results.itertuples()):
                max_redundancy = 0.0 # The max cosine similarity of current-item with selected-items
                
                if not mmr_results.empty:
                    selectedVectors = mmr_results['finalVector'].tolist()
                    selected_matrix = np.vstack(selectedVectors)
                    
                    sims = cosine_similarity(row.finalVector.reshape(1, -1), selected_matrix)
                    max_redundancy = np.max(sims)
                
                mmr_score = self.MMR_LAMBDA * row.relevance - ((1 - self.MMR_LAMBDA) * max_redundancy)
                if mmr_score > best_mmr:
                    best_mmr = mmr_score
                    best_idx = i
            
            if best_idx != -1:
                chosenRow = knn_results.loc[[best_idx]] #double [[]] keep the row as it is
                mmr_results = pd.concat([mmr_results, chosenRow], ignore_index=True)
                knn_results = knn_results.drop(best_idx).reset_index(drop=True)
                    
        return mmr_results
        

mhe = np.array([0,1,0,0,1,0,0,1,1])

test = User(mhe)
print(test.getRecommendations(geo_filter_type="county", geo_filter_name="London"))