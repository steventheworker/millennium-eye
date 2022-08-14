# send a base64 screenshot w/o saving it to the drive
import base64
from PIL import Image
from io import BytesIO
import platform

def grab():
    os_ = platform.system().lower()

    # mss literally only doesn't work with Ubuntu 22.04 (a.k.a. "Wayland")
    if os_ == "linux":
        from os import environ
        if 'wayland' in environ.get('WAYLAND_DISPLAY', ''):
            return "data:image/jpeg;base64,"

    import mss
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
        # print(len(base64str))
        return base64str

if __name__ == "__main__":
    print(grab())
