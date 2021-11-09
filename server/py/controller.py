from pynput.keyboard import Key, Controller
keyboard = Controller()
from pynput.mouse import Button, Controller
mouse = Controller()

SpecialChars = {
    "Space": Key.space,
    "Enter": Key.enter,
    "Backspace": Key.backspace,
    "Escape": Key.esc,
    "ShiftRight": Key.shift_r,
    "ShiftLeft": Key.shift_l,
    "CapsLock": Key.caps_lock,
    "ControlRight": Key.ctrl_r,
    "ControlLeft": Key.ctrl_l,
    "ContextMenu": Key.menu,
    "MetaLeft": Key.cmd,
    "MetaRight": Key.cmd_r,
    "Slash": "/",
    "Period": ".",
    "Comma": ",",
    "Backquote": "`",
    "Equal": "=",
    "Minus": "-",
    "Semicolon": ";",
    "Quote": "'",
    "Backslash": "\\",
    "BracketLeft": "[",
    "BracketRight": "]",
    "ArrowDown": Key.down,
    "ArrowLeft": Key.left,
    "ArrowRight": Key.right,
    "ArrowUp": Key.up,
    "AltLeft": Key.alt_l,
    "AltRight": Key.alt_r,
    "WakeUp": "Key.fn", #doesnt exist!!!
    "Tab": Key.tab,
    "Insert": Key.insert,
    "Delete": Key.delete,
    "Home": Key.home,
    "End": Key.end,
    "F1": Key.f1,
    "F2": Key.f2,
    "F3": Key.f3,
    "F4": Key.f4,
    "F5": Key.f5,
    "F6": Key.f6,
    "F7": Key.f7,
    "F8": Key.f8,
    "F9": Key.f9,
    "F10": Key.f10,
    "F11": Key.f11,
    "F12": Key.f12,
    "PageDown": Key.page_down,
    "PageUp": Key.page_up
    #numlock, scrollock, prntscreen, pausebreak
}

def pressRelease(char, type):
    if type == 1 or type == 3:
        keyboard.press(char)
    if type == 2 or type == 3:
        keyboard.release(char)
def press(char, type=3, shift='false'):
    if char.startswith('Digit'):
        char = char[5:]
    elif char.startswith('Key'):
        char = char[3:]
    elif SpecialChars[char]:
        char = SpecialChars[char]
    if shift == 'true':
        with keyboard.pressed(Key.shift):
            pressRelease(char, type)
    else:
        pressRelease(char, type)
def paste():
    pressRelease(Key.ctrl_l, 1)
    pressRelease("v", 3)
    pressRelease(Key.ctrl_l, 2)

def scroll_mouse(Dx, Dy):
    mouse.scroll(Dx, Dy)
def move_mouse(Dx, Dy):
    mouse.move(Dx, Dy)
def set_mouse(x, y):
    mouse.position = (x, y)
def press_mouse(rightButton):
    btn = Button.left
    if rightButton: btn = Button.right
    mouse.press(btn)
def release_mouse(rightButton):
    btn = Button.left
    if rightButton: btn = Button.right
    mouse.release(btn)
def pressRelease_mouse(rightButton):
    press_mouse(rightButton)
    release_mouse(rightButton)
