# pip install py2exe
# BUILD command:  python setup.py py2exe               =>              "dist/touchDevRestartFile.exe" (then rename dist to DevRestart)
from distutils.core import setup
import py2exe

setup(console=['touchDevRestartFile.py'])
