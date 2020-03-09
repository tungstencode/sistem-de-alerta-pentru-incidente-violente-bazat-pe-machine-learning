
import os
from Cutter import Cutter
from optparse import OptionParser
import tensorflow as tf


def parse_options():
    parser = OptionParser()

    parser.add_option("-f", "--file",
                      dest="file",
                      help="file to get files to cut, for example /home/videos",
                      type="string",
                      action="store"
                      )
    (options, args) = parser.parse_args()

    if options.file:

        return options.file

    else:
        parser.print_help()
        raise SystemExit


if __name__ == '__main__':
    try:
        path = parse_options()

        for e in tf.train.summary_iterator(path):
            for v in e.summary.value:
                if v.tag == 'loss' or v.tag == 'accuracy':
                    print(v.simple_value)
    except Exception as e:
        print(e)
