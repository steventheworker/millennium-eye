# **Millenium-Rod** - A crossplatform (Windows, MacOS, and Linux!) R.A.T. (Remote Administration Tool)

![alt text](https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/84dc13b7-a2e7-4b45-83ec-311e72e82900/dcwu9bn-a035e58f-3e35-4437-9a7b-1737e03b8345.png/v1/fill/w_400,h_262,strp/millennium_rod_render__legacy_of_the_duelist__by_maxiuchiha22_dcwu9bn-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjYyIiwicGF0aCI6IlwvZlwvODRkYzEzYjctYTJlNy00YjQ1LTgzZWMtMzExZTcyZTgyOTAwXC9kY3d1OWJuLWEwMzVlNThmLTNlMzUtNDQzNy05YTdiLTE3MzdlMDNiODM0NS5wbmciLCJ3aWR0aCI6Ijw9NDAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.g5Zw2OROqT8aM61C_9gjQSWR2OiUmi-c1AcxSvSjE5o)

## Install Steps

- Install yarn/npm packages (NodeJS) &nbsp; - &nbsp; via &nbsp; `npm install`
- Install pip packages: run this line from within &nbsp; &nbsp; "server/py" &nbsp; &nbsp; folder

  - `pip3 install -r ./requirements.txt`

- platform dependent install instruction
  - (windows only) (hot reload / restarting)
    - `pip3 install py2exe`
  - (Linux only)
    - (copy paste support)
      - `sudo apt-get install -y xclip`
    - (shortcuts/hotkey support)
      - `pip3 install pyautogui`
  - (macOS only): Nothing, as of yet 👄


- Finally, clone the client code by pasting the line below @ project root:
    -   `git clone https://github.com/steventheworker/millenium-rod-client client`

- Install Completed! ⛳️  -but don't forget to run either `yarn build` or `npm run build` (before starting if you're not running a dev environment)

&nbsp;

&nbsp;

# Running a development / production environment

## yarn dev / npm run dev &nbsp; &nbsp; or &nbsp; &nbsp; yarn production / npm run production

Production server: http://localhost:8000,
Sockets: http://localhost:8000

&nbsp;

&nbsp;

notes: you can only run yarn lib / yarn dev on the server, not externally or from ssh (you can start the process externally though), this is because of the screenshot library not having $DISPLAY set through ssh, dunno how to fix that right now

#### protip: visit your local devices using ipv4 adresses (eg: http://192.168.x.x:8000 format), for external devices: port forward and connect using a public ip / domain name

&nbsp;

&nbsp;

&nbsp;

&nbsp;

