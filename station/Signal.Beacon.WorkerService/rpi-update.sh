#! /bin/bash

cat << "EOF"
       _                __       
  ___ (_)__ ____  ___ _/ /______ 
 (_-</ / _ `/ _ \/ _ `/ / __/ _ \
/___/_/\_, /_//_/\_,_/_/\__/\___/
      /___/     __  _            
  ___ / /____ _/ /_(_)__  ___    
 (_-</ __/ _ `/ __/ / _ \/ _ \   
/___/\__/\_,_/\__/_/\___/_//_/
EOF
echo ''

# Root required
if [ $(id -u) != "0" ];
then
	echo -e "|   Error: You need to be root to install the Signalco Station\n|"
	exit 1
fi

## Download latest or next station
CURRENT_USER=$(whoami)
URL=""
VER=""
if [ "$1" = "--next" ];
then
	echo "Determining v.next version..."
	RELEASE_JSON=$( curl -s $"https://api.github.com/repos/signalco-io/signalco/releases" )
	VER=$( echo $RELEASE_JSON | jq -r 'map(select(.prerelease)) | first | .tag_name' )
	URL=$( echo $RELEASE_JSON | jq -r 'map(select(.prerelease)) | first | .assets[] | select(.name | test("station-v(.*)-linux-arm64.tar.gz")) | .browser_download_url' )
else
	echo "Determining stable version..."
	RELEASE_JSON=$( curl -s $"https://api.github.com/repos/signalco-io/signalco/releases/latest" )
	VER=$( echo $RELEASE_JSON | jq -r '.tag_name' )
	URL=$( echo $RELEASE_JSON | jq -r '.assets[] | select(.name | test("station-v(.*)-linux-arm64.tar.gz")) | .browser_download_url' )
fi

echo "———————————————————————————————"
echo ""
echo "Downloading station v$VER..."
echo "URL: $URL"
echo ""

FILENAME=$( echo $URL | grep -oP "station-v(.*)-linux-arm64" )
curl -LO "$URL"

echo ""
echo "———————————————————————————————"
echo ""

echo "Extracting station files..."
sudo mkdir -p /opt/signalcostation
sudo tar -xf ./$FILENAME.tar.gz -C /opt/signalcostation
sudo chown -R $CURRENT_USER:$CURRENT_USER /opt/signalcostation
cd /opt/signalcostation || exit

## Configure service
echo "Creating service file signalcostation.service and enabling..."
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
sudo systemctl restart signalcostation.service
