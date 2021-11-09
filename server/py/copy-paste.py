import clipboard
import controller
import sys

#either copy to clipboard
# or    copy to clipboard & ctrl+v (paste)
tar = sys.argv[1]
mode = sys.argv[2]
clipboardContent = tar if tar else clipboard.paste()

if mode == "copy":
  print(clipboardContent) #getClipboard

if mode == "copyto" or mode == "paste":
  clipboard.copy(clipboardContent) # set new clipboardContent

if mode == "paste":
  controller.paste() # trigger ctrl+V
