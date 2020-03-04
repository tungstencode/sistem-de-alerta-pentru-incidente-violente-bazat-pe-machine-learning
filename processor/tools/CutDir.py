import os
from Cutter import Cutter
from optparse import OptionParser


def parse_options():
    parser = OptionParser()

    parser.add_option("-d", "--directory",
                      dest="directory",
                      help="dorectory to get files to cut, for example /home/videos",
                      type="string",
                      action="store"
                      )
    (options, args) = parser.parse_args()

    if options.directory:

        return options.directory

    else:
        parser.print_help()
        raise SystemExit


if __name__ == '__main__':
    try:
        path = parse_options()
        # Cutter(filename, split_length)

        files = []
        for r, d, f in os.walk(path):
            for file in f:
                files.append(os.path.join(r, file))

        for f in files:
            try:
                print(f)
                Cutter(f, 1)
            except Exception as ex:
                print(ex)
            

    except Exception as e:
        print(e)
