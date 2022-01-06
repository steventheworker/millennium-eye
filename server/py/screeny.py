# send a base64 screenshot  ===  aka the bottom of es.py
import base64
import mss
from PIL import Image
from io import BytesIO

with mss.mss() as sct:
    monitor = sct.monitors[1]  # Use the 1st monitor
    im = sct.grab(monitor)
    # raw_bytes = mss.tools.to_png(im.rgb, im.size)
    # make pil image
    # img = Image.open(BytesIO(raw_bytes))
    img = Image.frombytes("RGB", im.size, im.bgra, "raw", "BGRX")
    byteio = BytesIO()
    # convert to jpg
    img.save(byteio, format='JPEG', optimize=True, quality=20)
    # read bytes -> b64
    b64 = base64.b64encode(byteio.getvalue())
    base64str = b64.decode('utf-8')
    print(base64str)
    # print(len(base64str))
