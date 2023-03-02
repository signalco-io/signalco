# Root required
if [ $(id -u) != "0" ];
then
	echo -e "|   Error: You need to be root to install the Signalco Zigbee2MQTT integration\n|"
	exit 1
fi

CURRENT_USER=$(whoami)

echo "Cloning Zigbee2mqtt git repository..."
sudo git clone --single-branch --branch master https://github.com/Koenkk/zigbee2mqtt.git /opt/zigbee2mqtt
sudo chown -R $CURRENT_USER:$CURRENT_USER /opt/zigbee2mqtt

echo "Running zigbee2mqtt install... This might take a while and can produce som expected errors"
cd /opt/zigbee2mqtt || exit
npm ci

echo "Creating service file zigbee2mqtt.service and enableing..."
service_path="/etc/systemd/system/zigbee2mqtt.service"
echo "[Unit]
Description=zigbee2mqtt
After=network.target
[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/opt/zigbee2mqtt
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$CURRENT_USER
[Install]
WantedBy=multi-user.target" > $service_path
sudo systemctl enable zigbee2mqtt.service

echo "Configuring Z2M..."
echo "
homeassistant: false
permit_join: false
availability: true
frontend: true
mqtt:
  base_topic: zigbee2mqtt
  server: 'mqtt://localhost'
serial:
  port: /dev/ttyACM0
  disable_led: true
advanced:
    network_key: GENERATE
    log_output: 
    - 'console'
" > /opt/zigbee2mqtt/data/configuration.yaml

echo "Starting Z2M..."
sudo systemctl start zigbee2mqtt.service
