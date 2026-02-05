import numpy as np

WEIGHT_MHE = 1.5
WEIGHT_TYPE = 1.0
WEIGHT_SUMMARY = 0.5

def safeL2Normalize(vec):
    arr = np.array(vec, dtype=float)
    l2 = np.linalg.norm(arr)
    if l2 > 0: arr /= l2

    return arr

def normalize(labelMHE, labelEmbed, summaryEmbed):
    return np.concatenate([
        safeL2Normalize(labelMHE) * WEIGHT_MHE,
        safeL2Normalize(labelEmbed) * WEIGHT_TYPE,
        safeL2Normalize(summaryEmbed) * WEIGHT_SUMMARY,
    ])