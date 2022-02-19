import controller
import sys
import time

events = sys.argv[1].split(',')
for _e in events:
    e = _e.split('~')
    t = int(e[0]) / 1000
    if t: time.sleep(t)
    
    if e[1] == "t":
        controller.type(e[2])
    elif e[1] == "u" or e[1] == "d":
        #keyboard event
        numType = 1 if e[1] == "d" else 2 #key#d(own) = press, #key#u(p) = release
        key = e[2]
        shift = e[3]
        controller.press(key, type=numType, shift=shift)
    else: #mouse event
        #scroll
        if e[1] == "scrllms": controller.scroll_mouse(float(e[2]),  float(e[3]))
        #move, set
        if e[1] == "mm": controller.move_mouse(float(e[2]), float(e[3]))
        if e[1] == "sm": controller.set_mouse(float(e[2]),  float(e[3]))
        #press
        if e[1].startswith('p'): controller.press_mouse(True if e[1][1] == "r" else False)
        #release
        if e[1].startswith('r'): controller.release_mouse(True if e[1][1] == "r" else False)



# force a refresh after simulating input (vvv) (Below code === screeny.py + (time.sleep(0.25)))
if sys.argv[2] == 'y':
    import base64
    import mss
    from PIL import Image
    from io import BytesIO
    time.sleep(0.25)
    with mss.mss() as sct:
        monitor = sct.monitors[1]   # Use the 1st monitor
        im = sct.grab(monitor)
        img = Image.frombytes("RGB", im.size, im.bgra, "raw", "BGRX")
        byteio = BytesIO()
        img.save(byteio, format='JPEG', optimize=True, quality=20)
        b64 = base64.b64encode(byteio.getvalue())
        base64str = b64.decode('utf-8')
        print(base64str)
