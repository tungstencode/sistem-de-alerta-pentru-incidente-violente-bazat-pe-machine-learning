############################################################
#  Settings for both Evaluation in Train.py & Evaluate.py  #
############################################################
'''
    For evaluation, batchSize = 1 (i.e. pass the same video in the same batch).
'''
UNROLLED_SIZE = 50

#####################
# Advenced Settings #
#####################
WAITING_QUEUE_MAX_SIZE = 30
LOADED_QUEUE_MAX_SIZE = 15
NUMBER_OF_LOAD_DATA_THREADS=1


##############################
#  Settings for Evaluate.py  #
##############################

PATH_TO_MODEL_CHECKPOINTS = "temp/G2D19_P2OF_ResHB_1LSTM_dataFeb_SurvDS_9/save_epoch_7/ViolenceNet.ckpt"
