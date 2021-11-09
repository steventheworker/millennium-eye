import base64
from PIL import Image
import mss


with mss.mss() as sct:
    monitor = sct.monitors[1]   # Use the 1st monitor
    im = sct.grab(monitor)
    b64 = base64.b64encode(mss.tools.to_png(im.rgb, im.size))
    base64str = b64.decode('utf-8')
    print(base64str)
