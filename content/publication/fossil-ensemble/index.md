---
title: Fossil image identification using deep learning ensembles of data augmented
  multiviews
authors:
- Chengbin Hou
- Xinyu Lin
- Hanhui Huang
- Sheng Xu
- Junxuan Fan
- Yukun Shi
- Hairong Lv
author_notes:
- "Equal contribution"
- "Equal contribution"
- "Equal contribution"
date: '2023-01-01'
publishDate: '2024-03-08T23:17:21.662318Z'
publication_types:
- article-journal
publication: '*Methods in Ecology and Evolution*'
doi: https://doi.org/10.1111/2041-210X.14229
abstract: Identification of fossil species is crucial to evolutionary studies.
  Recent advances from deep learning have shown promising prospects in fossil image
  identification. However, the quantity and quality of labelled fossil images are
  often limited due to fossil preservation, conditioned sampling and expensive and
  inconsistent label annotation by domain experts, which pose great challenges to
  training deep learning-based image classification models. To address these challenges,
  we follow the idea of the wisdom of crowds and propose a multiview ensemble framework,
  which collects Original (O), Grey (G) and Skeleton (S) views of each fossil image
  reflecting its different characteristics to train multiple base models, and then
  makes the final decision via soft voting. Experiments on the largest fusulinid dataset
  with 2400 images show that the proposed OGS consistently outperforms baselines (using
  a single model for each view), and obtains superior or comparable performance compared
  to OOO (using three base models for three the same Original views). Besides, as
  the training data decreases, the proposed framework achieves more gains. While considering
  the identification consistency estimation with respect to human experts, OGS receives
  the highest agreement with the original labels of dataset and with the re-identifications
  of two human experts. The validation performance provides a quantitative estimation
  of consistency across different experts and genera. We conclude that the proposed
  framework can present state-of-the-art performance in the fusulinid fossil identification
  case study. This framework is designed for general fossil identification and it
  is expected to see applications to other fossil datasets in future work. Notably,
  the result, which shows more performance gains as train set size decreases or over
  a smaller imbalance fossil dataset, suggests the potential application to identify
  rare fossil images. The proposed framework also demonstrates its potential for assessing
  and resolving inconsistencies in fossil identification.
tags:
- deep learning
- ensemble
- fossil identification
- fusulinid
- identification inconsistency
- image classification
- palaeoecology
featured: true
---
