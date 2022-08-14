# Station

## Manual setup (DIY)

### Prepare SD card

- Download [balena Etcher](https://www.balena.io/etcher/)
- Attach SD card to your computer
- Flash directly from URL or download image
  - Select "Flash from URL"
    - Paste URL: `https://spublic.blob.core.windows.net/images/orangepizero2/Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.img` (latest Ubuntu image)
    - Confirm by clicking OK
  - Select "Flash from image"
    - Download image from `https://spublic.blob.core.windows.net/images/orangepizero2/Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.zip` (latest Ubuntu image)
    - Extract ZIP and select `.img` file to flash
- Etcher will download the image, when that is done click "Select target" and select SD card
- Click "Flash!" to start writing the image
- When done you can close the Etcher and remove the SD from your computer

Check image integrity:
_Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.img SHA: 8b8dbecfa30a259d7f990bad9f3ceecfe477ba742e1a45ebc88a5cbccd43eb1d_

### Installation on Orange Pi Zero 2

ssh into `ssh root@orangepizero2` with password `orangepi`

#### Install Signalco Station

```bash
curl https://raw.githubusercontent.com/signalco-io/station/main/rpi-install.sh > ./ss-install.sh
sudo chmod +x ./ss-install.sh
sudo ./ss-install.sh
```

After installation you should restart the device. When connecting again use `signalcostation` as hostname as it was changed during the installation: `ssh root@signalcostation` with password `orangepi`.

#### Install Zigbee2MQTT

```bash
curl https://raw.githubusercontent.com/signalco-io/station/main/z2m-install.sh > ./z2m-install.sh
sudo chmod +x ./z2m-install.sh
sudo ./z2m-install.sh
```

#### Useful commands

```bash
# View Signalco Station logs
sudo journalctl -u signalcostation.service -f

# View Zigbee2MQTT logs
sudo journalctl -u zigbee2mqtt.service -f
```

#### Post-install tips

- Change root password
