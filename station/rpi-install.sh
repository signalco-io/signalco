# Root required
if [ $(id -u) != "0" ];
then
	echo -e "|   Error: You need to be root to install the Signalco Station\n|"
	exit 1
fi

## Housekeeping
echo "Updating system..."
sudo bash -c 'for i in update {,dist-}upgrade auto{remove,clean}; do apt-get $i -y; done'

## Configure hostname
CURRENT_HOSTNAME=$(hostname)
if [ $CURRENT_HOSTNAME != "signalcostation" ]; then
  echo "Setting hostname to 'signalcostation'...";
  sudo hostnamectl set-hostname signalcostation
fi
echo "Hostname: $(hostname)"

## Configure firewall
sudo apt-get install -y ufw
echo "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 1883 # Allow MQTT
sudo ufw allow 8080 # Allow Z2M UI (Optional)
sudo ufw allow 80 # Allow Station UI
echo "y" | sudo ufw enable

## Install node
NODE=$(which npm)
if [ -z "${NODE}" ]; then #Installing NodeJS if not already installed.
  printf "Downloading and installing NodeJS...\\n"
  curl -sL https://deb.nodesource.com/setup_18.x | bash -
  sudo apt-get update
  sudo apt-get install -y gcc g++ make nodejs
fi
echo "Node version: $(node --version)"

# Install prerequesites
echo "Installing dependencies..."
sudo apt-get install -y make g++ gcc bluez jq mosquitto net-tools

## Configure mosquitto
echo "listener 1883
allow_anonymous true" > /etc/mosquitto/conf.d/mosquitto.conf

CURRENT_USER=$(whoami)

## Download latest station
echo "Downloading latest stable station..."
URL=$( curl -s "https://api.github.com/repos/signalco-io/station/releases/latest" | jq -r '.assets[] | select(.name | test("beacon-v(.*)-linux-arm64.tar.gz")) | .browser_download_url' )
FILENAME=$( echo $URL | grep -oP "beacon-v\d*.\d*.\d*-linux-arm64" )
curl -LO "$URL"
echo "Extracting station files..."
sudo mkdir -p /opt/signalcostation
sudo tar -xf ./$FILENAME.tar.gz -C /opt/signalcostation
sudo chown -R $CURRENT_USER:$CURRENT_USER /opt/signalcostation
cd /opt/signalcostation || exit

## Configure service
echo "Creating service file signalcostation.service and enableing..."
service_path="/etc/systemd/system/signalcostation.service"
echo "[Unit]
Description=Signal Station
After=network.target
[Service]
ExecStart=/opt/signalcostation/$FILENAME/Signal.Beacon
WorkingDirectory=/opt/signalcostation/$FILENAME
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$CURRENT_USER
[Install]
WantedBy=multi-user.target" > $service_path
sudo systemctl enable signalcostation.service
sudo systemctl start signalcostation.service
