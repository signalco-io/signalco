# Samsung

## TV

Connect to following address:

`wss://<IP>:8002/api/v2/channels/samsung.remote.control?name=<REMOTE_NAME>&token=<TOKEN>`
`wss://<IP>:8002/api/v2/channels/com.samsung.art-app?name=<REMOTE_NAME>`

- `<REMOTE_NAME>` is Base64 encoded name of the remote application. This is displayed when TV asks for permission from user to connect to the TV.
- `<TOKEN>` provided by the TV when user allows remote to connect. 

### Flow

#### Acquire basic info

```
GET http://<IP>:8001/api/v2/
```

#### Acquire token

- Connect to the TV with above WebSocket URL
- TV will present user with option to allow or deny connection
- When user accepts connection, TV will respond with `data.token` that can be used to connect to the TV with token

Token response example:

```json
{
  "data": {
    "clients": [
      {
        "attributes": {
          "name": "U2lnbmFsQmVhY29u"
        },
        "connectTime": 1613546426400,
        "deviceName": "U2lnbmFsQmVhY29u",
        "id": "5f6cd2e6-cebd-4ae8-8048-086c69e7397",
        "isHost": false
      }
    ],
    "id": "5f6cd2e6-cebd-4ae8-8048-086c69e7397",
    "token": "10801928"
  },
  "event": "ms.channel.connect"
}
```

#### Virtual Remote

```json
{
  "method": "ms.remote.control",
  "params": {
    "Cmd": "Click",
    "DataOfCmd": "KEY_POWER",
    "Option": "false",
    "TypeOfRemote": "SendRemoteKey"
  }
}
```

Possible `DataOfCmd`:

```
KEY_MENU
KEY_HOME
KEY_VOLUP
KEY_VOLDOWN
KEY_MUTE
KEY_POWER
KEY_GUIDE
KEY_CHUP
KEY_CHDOWN
KEY_CH_LIST
KEY_PRECH
KEY_LEFT
KEY_RIGHT
KEY_UP
KEY_DOWN
KEY_ENTER
KEY_RETURN
KEY_TOOLS
KEY_1
KEY_2
KEY_3
KEY_4
KEY_5
KEY_6
KEY_7
KEY_8
KEY_9
KEY_0
```


#### Get installed apps

Request: 

```json
{
  "method": "ms.channel.emit",
  "params": {
    "event": "ed.installedApp.get",
    "to": "host"
  }
}
```

Response:

```json
{
  "data": {
    "data": [
      {
        "appId": "111299001912",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/111299001912/250x250.png",
        "is_lock": 0,
        "name": "YouTube"
      },
      {
        "appId": "org.tizen.browser",
        "app_type": 4,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/webbrowser/250x250.png",
        "is_lock": 0,
        "name": "Internet"
      },
      {
        "appId": "11101200001",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/11101200001/250x250.png",
        "is_lock": 0,
        "name": "Netflix"
      },
      {
        "appId": "3201710015016",
        "app_type": 1,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201710015016/250x250.png",
        "is_lock": 0,
        "name": "SmartThings"
      },
      {
        "appId": "3201511006428",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201511006428/250x250.png",
        "is_lock": 0,
        "name": "Rakuten TV"
      },
      {
        "appId": "3201512006785",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201512006785/250x250.png",
        "is_lock": 0,
        "name": "Prime Video"
      },
      {
        "appId": "121299000101",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/121299000101/250x250.png",
        "is_lock": 0,
        "name": "TuneIn"
      },
      {
        "appId": "3201803015852",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201803015852/250x250.png",
        "is_lock": 0,
        "name": "Flying Fish 2"
      },
      {
        "appId": "org.tizen.example.STVOpenTKApp1",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/org.tizen.example.STVOpenTKApp1/250x250.png",
        "is_lock": 0,
        "name": "STVOpenTKApp1"
      },
      {
        "appId": "3201710015037",
        "app_type": 1,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201710015037/250x250.png",
        "is_lock": 0,
        "name": "Gallery"
      },
      {
        "appId": "20192100002",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/20192100002/250x250.png",
        "is_lock": 0,
        "name": "e-Manual"
      },
      {
        "appId": "3201601007250",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201601007250/250x250.png",
        "is_lock": 0,
        "name": "Google Play Movies"
      },
      {
        "appId": "3201909019271",
        "app_type": 2,
        "icon": "/opt/share/webappservice/apps_icon/FirstScreen/3201909019271/250x250.png",
        "is_lock": 0,
        "name": "PrivacyChoices"
      }
    ]
  },
  "event": "ed.installedApp.get",
  "from": "host"
}
```

#### Lunch app

curl -X POST http://TV_IP:8001/ws/apps/Netflix

curl -X POST http://TV_IP:8001/api/v2/applications/Netflix