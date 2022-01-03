import platform
isLinux = platform.platform().startswith("Linux")
if isLinux:
    import pyautogui
    # pyautogui key mappings

    #
    # HINT: use 'win' instead of Key.cmd
    #
    ['\t', '\n', '\r', ' ', '!', '"', '#', '$', '%', '&', "'", '(',
     ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7',
     '8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
     'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
     'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~',
     'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace',
     'browserback', 'browserfavorites', 'browserforward', 'browserhome',
     'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear',
     'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
     'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10',
     'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20',
     'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
     'final', 'fn', 'hanguel', 'hangul', 'hanja', 'help', 'home', 'insert', 'junja',
     'kana', 'kanji', 'launchapp1', 'launchapp2', 'launchmail',
     'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack',
     'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
     'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn',
     'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn',
     'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator',
     'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab',
     'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen',
     'command', 'option', 'optionleft', 'optionright']

    SpecialChars = {
        "Space": "Key.space",
        "Enter": "Key.enter",
        "Backspace": "Key.backspace",
        "Escape": "Key.esc",
        "ShiftRight": "Key.shift_r",
        "ShiftLeft": "Key.shift_l",
        "CapsLock": "Key.caps_lock",
        "ControlRight": "Key.ctrl_r",
        "ControlLeft": "Key.ctrl_l",
        "ContextMenu": "Key.menu if \"menu\" in dir(Key) else Key.enter",
        "MetaLeft": "Key.cmd",
        "MetaRight": "Key.cmd_r",
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
        "ArrowDown": "Key.down",
        "ArrowLeft": "Key.left",
        "ArrowRight": "Key.right",
        "ArrowUp": "Key.up",
        "AltLeft": "Key.alt_l",
        "AltRight": "Key.alt_r",
        "WakeUp": "Key.fn", #doesnt exist!!!
        "Tab": "Key.tab",
        "Insert": "Key.insert if \"insert\" in dir(Key) else Key.delete",
        "Delete": "Key.delete",
        "Home": "Key.home",
        "End": "Key.end",
        "F1": "Key.f1",
        "F2": "Key.f2",
        "F3": "Key.f3",
        "F4": "Key.f4",
        "F5": "Key.f5",
        "F6": "Key.f6",
        "F7": "Key.f7",
        "F8": "Key.f8",
        "F9": "Key.f9",
        "F10": "Key.f10",
        "F11": "Key.f11",
        "F12": "Key.f12",
        "PageDown": "Key.page_down",
        "PageUp": "Key.page_up"
    }
from pynput.keyboard import Key, Controller
keyboard = Controller()
from pynput.mouse import Button, Controller
mouse = Controller()

if not isLinux:
    #pynput key mappings (macOS & Windows)
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
        "ContextMenu": Key.menu if "menu" in dir(Key) else Key.enter,
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
        "Insert": Key.insert if "insert" in dir(Key) else Key.delete,
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


#keyboard helpers
def keyP(char):
    keyboard.press(char) if not isLinux else pyautogui.keyDown(char);
def keyR(char):
    keyboard.release(char) if not isLinux else pyautogui.keyUp(char)
def pressRelease(char, type):
    if type == 1 or type == 3:
        keyP(char)
    if type == 2 or type == 3:
        keyR(char)
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


#mouse helpers
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
