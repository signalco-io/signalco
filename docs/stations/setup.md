# Station

## Manual setup (DIY)

### Prepare SD card

- Download [balena Etcher](https://www.balena.io/etcher/)
- Attach SD card to your computer
- Select Frash from URL
- Paste URL: `TODO` for latest station image (Orange Pi Zero2 Ubuntu Focal) and click OK
- Etcher will download the image, when that is done click "Select target" and select SD card
- Click "Flash!" to start writing the image
- When done you can close the Etcher and remove the SD from your computer

### Installation on Orange Pi Zero 2

ssh into `ssh root@orangepizero2` with password `orangepi`

#### Install Signalco Station

```bash
curl https://raw.githubusercontent.com/signalco-io/station/main/rpi-install.sh > ./ss-install.sh
sudo chmod +x ./ss-install.sh
sudo ./ss-install.sh
```

#### Install Zigbee2MQTT

```bash
curl https://raw.githubusercontent.com/signalco-io/station/main/z2m-install.sh > ./z2m-install.sh
sudo chmod +x ./z2m-install.sh
sudo ./install.sh
```

#### Useful commands

```bash
# View Signalco Station logs
sudo journalctl -u signalcostation.service -f

# View Zigbee2MQTT logs
sudo journalctl -u zigbee2mqtt.service -f
```
