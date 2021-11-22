# reload server using nodemon catching file change
from pathlib import Path
import time
time.sleep(1)
Path('../../build/index.js').touch()
