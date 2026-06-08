## Project
The project is part of BSc Computer Science Final Year Project. There's no name for this project yet (it's hard).

The repo contains the code that can be run locally. It is not ready for deployment due to complex nature of mobile application publication (and time).

## Abstract / About the project
Discovering travel destinations beyond the mainstream is a genuinely frustrating experience. 
Existing travel discovery platform, despite their powerful personalization algorithms, generally prioritize high-engagement content, offering little room for personal preferences to surface new places other than pure luck. 
This project therefore explores an alternative approach by developing a travel recommendation system for the United Kingdom based solely on individual preferences via a full-stack mobile application. 

The system employs content-based filtering with destination data sourced from Wikidata represented as feature vectors combining category labels and text descriptions. 
The core engine utilizes K-Nearest Neighbours (KNN) with Maximal Marginal Relevance (MMR) reranking to optimize relevance and diversity balance, with incremental learning from explicit user feedback. 

Evaluation through simulated user sessions showed the system raw precision (0.29 - 0.32) similarly matched the raw precision of existing platforms in the first 100 recommended items with a consistent intra-list diversity between 0.36 and 0.42, while introducing significantly more novel discoveries (75%). 
The system illustrated its sustainability to discover 200 places with continuingly high rate of novelty compared to social media platforms’ frustrating repetition. 
Nonetheless, the system was found to struggle to exceed its precision ceiling and lacks the nuances to distinguish true dislikes. 

## Detailed Documentation
The full detailed documentation from core concepts, architecture, setup, api reference,... are created with Mintlify, and can be viewed [here](https://mintlify.wiki/viet2811/uk-travel-recommendation)
