import numpy as np

PATH_TO_MODEL_CHECKPOINTS = "./save_epoch_8/ViolenceNet.ckpt"
# PATH_TO_MODEL_CHECKPOINTS = "temp/G2D19_P2OF_ResHB_1LSTM_dataFeb_SurvDS_6/save_epoch_23/ViolenceNet.ckpt"

'''
      To smooth the Judgement of Fight/NoneFight, count of neighbor frames
    (that has the value) should >= CHANGE_JUDGEMENT_THRESHOLD to change the
    judgement.
      Usually, this value is setted to the same as the frames Threshold that
    produce the Best Accuracy in Validation set.

    ex:
	NetOutput	Judgement
	  False		  False
	  True		  False
	  True		  False
	  True		  True
	  False		  True
	  Flase		  True
	  Flase		  False
'''
CHANGE_JUDGEMENT_THRESHOLD = 3

DISPLAY_IMAGE_SIZE = 500

BORDER_SIZE = 30
FIGHT_BORDER_COLOR = (0, 0, 255)
NO_FIGHT_BORDER_COLOR = (0, 255, 0)
