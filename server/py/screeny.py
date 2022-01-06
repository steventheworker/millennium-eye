# send a base64 screenshot  ===  aka the bottom of es.py
import base64
import mss
with mss.mss() as sct:
    monitor = sct.monitors[1]   # Use the 1st monitor
    im = sct.grab(monitor)
    b64 = base64.b64encode(mss.tools.to_png(im.rgb, im.size))
    base64str = b64.decode('utf-8')
    print(base64str)
