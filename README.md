# **Millenium-eye** - A crossplatform (Windows, MacOS, and Linux!) R.A.T. (Remote Administration Tool)

<p align="center">
    <img width="50px" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/627fe721-846f-4f75-ac61-111ca00b27dd/daqixic-2f41f980-cd8d-4448-a99c-2c0d450b512a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzYyN2ZlNzIxLTg0NmYtNGY3NS1hYzYxLTExMWNhMDBiMjdkZFwvZGFxaXhpYy0yZjQxZjk4MC1jZDhkLTQ0NDgtYTk5Yy0yYzBkNDUwYjUxMmEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZSRBfN9RZDJBKjiZyv9lzuNjGmC091VNT0ay4RujU8k" />
</p>

## Install Steps

-   Install yarn/npm packages (NodeJS) &nbsp; - &nbsp; via &nbsp; `npm install`
-   Install pip packages: run this line from within &nbsp; &nbsp; "server/py" &nbsp; &nbsp; folder

    -   `pip3 install -r ./requirements.txt`

-   platform dependent install instruction

    -   (windows only) (hot reload / restarting)
        -   `pip3 install py2exe`
    -   (Linux only)
        -   (copy paste support)
            -   `sudo apt-get install -y xclip`
        -   (shortcuts/hotkey support)
            -   `pip3 install pyautogui`
    -   (macOS only): Nothing, as of yet 👄

-   Finally, clone the client code by pasting the line below @ project root:

    -   `git clone https://github.com/steventheworker/millenium-eye-client client`

-   Install Completed! ⛳️ -but don't forget to run either `yarn build` or `npm run build` (before starting if you're not running a dev environment)

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

https://docs.expo.dev/classic/building-standalone-apps/#if-you-choose-to-build-for-ios

@ client
expo build:ios --provisioning-profile-path se2020milleniumeye.mobileprovision
