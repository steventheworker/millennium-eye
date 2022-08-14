# **Millennium-eye** - A crossplatform (Windows, MacOS, and Linux!) R.A.T. (Remote Administration Tool)

<p align="center">
    <img width="50px" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/627fe721-846f-4f75-ac61-111ca00b27dd/daqixic-2f41f980-cd8d-4448-a99c-2c0d450b512a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzYyN2ZlNzIxLTg0NmYtNGY3NS1hYzYxLTExMWNhMDBiMjdkZFwvZGFxaXhpYy0yZjQxZjk4MC1jZDhkLTQ0NDgtYTk5Yy0yYzBkNDUwYjUxMmEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZSRBfN9RZDJBKjiZyv9lzuNjGmC091VNT0ay4RujU8k" />
</p>

## Install Steps

-   <u>**Install yarn/npm packages**</u> (NodeJS) &nbsp; - &nbsp; via &nbsp; `npm install` or `yarn install`
-   <u>**Install pip packages:**</u> run this line from within &nbsp; &nbsp; "server/py" &nbsp; &nbsp; folder

    -   `pip3 install -r ./requirements.txt`

-   <u>**Cross-platform Instructions**</u>

    -   (windows only) - hot reload / restarting
        -   `pip3 install py2exe`
    -   (Linux only)
        -   enable copy paste
            -   `sudo apt-get install -y xclip`
        -   shortcuts/hotkey support
            -   `pip3 install pyautogui`
        -   (Ubuntu version <u>&gt;</u> 22.04 / Wayland) - alternate screenshot utility
            -   `sudo apt-get install -y `
    -   (macOS only): Nothing, as of yet 👄

-   **and finally, <u>clone the client code</u>** by pasting the line below @ project root:

    -   `git clone https://github.com/steventheworker/millennium-eye-client client`

-   Install Completed! ⛳️ -but don't forget to run either `yarn build` or `npm run build` (before starting via `yarn start` or `npm start` (if you're not going to run a dev environment via `yarn dev` / `npm run dev`))

&nbsp;

&nbsp;

# Running a development / production environment

use `npm run production` or `yarn production` if unsatisfied with the screenshot refresh rate. The dev/start environment both use a slower rate.

Production server: http://localhost:8000,
Sockets: http://localhost:8000/sockets

&nbsp;

&nbsp;

notes: you can only run the server on the actual machine, not externally via network/ssh, this is because of the screenshot library (mss) not having $DISPLAY set through ssh

#### protip: visit your local devices using ipv4 adresses (eg: http://192.168.x.x:8000 format), for external devices: port forward and connect using a public ip / domain name

&nbsp;

&nbsp;

&nbsp;

&nbsp;

# Installing millenium-eye (client) on iOS / Android

https://docs.expo.dev/classic/building-standalone-apps/#if-you-choose-to-build-for-ios

@ client
expo build:ios --provisioning-profile-path se2020millenniumeye.mobileprovision
