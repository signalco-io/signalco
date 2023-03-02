Get public info response:

```json
{
  "ver": "3",
  "hostname": "iRobot-9894F1D88B6D4973B8070A8C49BF9A6E",
  "robotname": "Roomba",
  "robotid": "9894F1D88B6D4973B8070A8C49BF9A6E",
  "ip": "192.168.1.55",
  "mac": "50:14:79:15:44:32",
  "sw": "lewis+3.14.12+lewis-release-121+17",
  "sku": "i755840",
  "nc": 0,
  "proto": "mqtt",
  "cap": {
    "binFullDetect": 2,
    "dockComm": 1,
    "wDevLoc": 2,
    "bleDevLoc": 1,
    "edge": 0,
    "maps": 3,
    "pmaps": 5,
    "tLine": 2,
    "area": 1,
    "eco": 1,
    "multiPass": 2,
    "pose": 1,
    "team": 1,
    "pp": 0,
    "lang": 2,
    "5ghz": 1,
    "prov": 3,
    "sched": 1,
    "svcConf": 1,
    "ota": 2,
    "log": 2,
    "langOta": 0,
    "tileScan": 1
  }
}
```

State reports:

```json
{
  "state": {
    "reported": {
      "batPct": 100,
      "batteryType": "F12432832R",
      "batInfo": {
        "mDate": "2019-5-9",
        "mName": "F12432832R",
        "mDaySerial": 31839,
        "mData": "303030333034303200000000000000000000000000",
        "mLife": "0C590B12107809C34DDF0014055EF60200DBFEA92C0AFFFF09BA20D400000000",
        "cCount": 81,
        "afCount": 0
      },
      "batAuthEnable": true,
      "bbchg": {
        "nChatters": 5,
        "nKnockoffs": 57,
        "nLithF": 0,
        "nChgOk": 164,
        "aborts": [
          0,
          0,
          0
        ],
        "smberr": 0
      },
      "bbchg3": {
        "estCap": 1878,
        "nAvail": 314,
        "hOnDock": 9567,
        "avgMin": 41
      },
      "bbmssn": {
        "aCycleM": 47,
        "nMssnF": 17,
        "nMssnC": 28,
        "nMssnOk": 130,
        "aMssnM": 59,
        "nMssn": 178
      },
      "bbnav": {
        "aMtrack": 95,
        "nGoodLmrks": 0,
        "aGain": 24,
        "aExpo": 73
      },
      "bbpause": {
        "pauses": [
          104,
          104,
          104,
          104,
          104,
          104,
          104,
          104,
          104,
          42
        ]
      },
      "bbrun": {
        "nOvertemps": 0,
        "nEvacs": 161,
        "nCBump": 0,
        "nWStll": 1,
        "nMBStll": 1271,
        "nPanics": 1125,
        "nPicks": 1387,
        "nOpticalDD": 42,
        "nPiezoDD": 1,
        "nScrubs": 48,
        "nStuck": 84,
        "sqft": 163,
        "min": 3,
        "hr": 61,
        "nCliffsF": 11429,
        "nCliffsR": 0
      },
      "bbswitch": {
        "nBumper": 93917,
        "nDrops": 922,
        "nDock": 122,
        "nSpot": 76,
        "nClean": 200
      },
      "bbsys": {
        "min": 32,
        "hr": 9813
      },
      "behaviorFwk": true,
      "bin": {
        "present": true,
        "full": false
      },
      "binPause": true,
      "bleDevLoc": true,
      "cap": {
        "binFullDetect": 2,
        "dockComm": 1,
        "wDevLoc": 2,
        "bleDevLoc": 1,
        "edge": 0,
        "maps": 3,
        "pmaps": 5,
        "tLine": 2,
        "area": 1,
        "eco": 1,
        "multiPass": 2,
        "pose": 1,
        "team": 1,
        "pp": 0,
        "lang": 2,
        "5ghz": 1,
        "prov": 3,
        "sched": 1,
        "svcConf": 1,
        "ota": 2,
        "log": 2,
        "langOta": 0,
        "tileScan": 1
      },
      "carpetBoost": false,
      "cleanMissionStatus": {
        "cycle": "none",
        "phase": "charge",
        "expireM": 0,
        "rechrgM": 0,
        "error": 0,
        "notReady": 0,
        "mssnM": 0,
        "expireTm": 0,
        "rechrgTm": 0,
        "mssnStrtTm": 1620064729,
        "initiator": "localApp",
        "nMssn": 178
      },
      "cleanSchedule2": [
        {
          "enabled": false,
          "type": 0,
          "start": {
            "day": [
              1,
              2,
              3,
              4,
              5
            ],
            "hour": 8,
            "min": 0
          },
          "cmd": {
            "command": "start",
            "params": {
              "noAutoPasses": false,
              "twoPass": false
            }
          }
        },
        {
          "enabled": false,
          "type": 0,
          "start": {
            "day": [
              1,
              3,
              5
            ],
            "hour": 14,
            "min": 0
          },
          "cmd": {
            "command": "start",
            "params": {
              "noAutoPasses": false,
              "twoPass": false
            }
          }
        },
        {
          "enabled": false,
          "type": 0,
          "start": {
            "day": [
              1,
              2,
              3,
              4,
              5
            ],
            "hour": 9,
            "min": 0
          },
          "cmd": {
            "command": "start",
            "params": {
              "noAutoPasses": false,
              "twoPass": false
            }
          }
        }
      ],
      "cloudEnv": "prod",
      "connected": true,
      "country": "HR",
      "deploymentState": 0,
      "dock": {
        "known": true,
        "pn": "4627965",
        "state": 301,
        "id": "874254554153589123344310513025518144178118",
        "fwVer": "4.0.8"
      },
      "evacAllowed": true,
      "ecoCharge": false,
      "featureFlags": {
        "ros2SptLvl": true,
        "quietNav": false,
        "clearHaz": true
      },
      "hwPartsRev": {
        "csscID": 0,
        "mobBrd": 7,
        "mobBlid": "56AA2175FF25C4429D1F7D686346271B",
        "navSerialNo": "CF08814PR",
        "wlan0HwAddr": "50:14:79:15:44:32",
        "NavBrd": 0
      },
      "hwDbgr": null,
      "langs": null,
      "langs2": {
        "sVer": "1.0",
        "dLangs": {
          "ver": "0.20",
          "langs": [
            "cs-CZ",
            "da-DK",
            "de-DE",
            "en-GB",
            "en-US",
            "es-ES",
            "es-XL",
            "fi-FI",
            "fr-CA",
            "fr-FR",
            "he-IL",
            "it-IT",
            "ja-JP",
            "ko-KR",
            "nb-NO",
            "nl-NL",
            "pl-PL",
            "pt-BR",
            "pt-PT",
            "ru-RU",
            "sv-SE",
            "zh-CN",
            "zh-HK",
            "zh-TW"
          ]
        },
        "sLang": "en-US",
        "aSlots": 0
      },
      "language": null,
      "lastCommand": {
        "command": "dock",
        "initiator": "localApp",
        "time": 1620064770,
        "ordered": null,
        "pmap_id": null,
        "regions": null,
        "user_pmapv_id": null
      },
      "lastDisconnect": 1,
      "mapUploadAllowed": true,
      "missionTelemetry": {
        "aux_comms": 1,
        "bat_stats": 1,
        "camera_settings": 1,
        "coverage_report": 1,
        "map_hypotheses": 1,
        "map_load": 1,
        "vital_stats": 1,
        "vslam_report": 1
      },
      "mssnNavStats": {
        "nMssn": 178,
        "gLmk": 0,
        "lmk": 0,
        "reLc": 0,
        "plnErr": "none",
        "mTrk": 95,
        "kdp": 0,
        "sfkdp": 0,
        "nmc": 1,
        "nmmc": 0,
        "nrmc": 0,
        "mpSt": "idle",
        "l_drift": 0,
        "h_drift": 0,
        "l_squal": 58,
        "h_squal": 0
      },
      "name": "Roomba",
      "noAutoPasses": false,
      "noPP": false,
      "openOnly": false,
      "pmapLearningAllowed": true,
      "pmaps": [
        {
          "ikBwaAEXSCSFjwCFqogY8g": "210502T130902"
        }
      ],
      "pmapCL": true,
      "pmapFmt": "3",
      "pose": {
        "theta": 165,
        "point": {
          "x": -7,
          "y": -3
        }
      },
      "rankOverlap": 15,
      "reflexSettings": {
        "rlWheelDrop": {
          "enabled": 0
        }
      },
      "sceneRecog": 1,
      "schedHold": false,
      "secureBoot": {
        "log": 2,
        "flip": 0,
        "sbl1Ver": "B3.2.02_PPUB",
        "stublVer": "B3.2.02_PPUB",
        "efuse": 1,
        "blType": 1,
        "enforce": 2,
        "lastRst": "200000001",
        "recov": "linux+3.8.0.2+lewis-release-420+10",
        "idSwitch": 0,
        "permReq": 0,
        "perm": "none"
      },
      "sku": "i755840",
      "softwareVer": "lewis+3.14.12+lewis-release-121+17",
      "subModSwVer": {
        "nav": "lewis-nav+3.14.12+ubuntu-HEAD-ec086e2c0f1+17",
        "mob": "3.14.12+ubuntu-HEAD-ec086e2c0f1+17",
        "pwr": "0.5.5+ubuntu-HEAD-ec086e2c0f1+17",
        "sft": "1.2.0+Lewis-Builds/Lewis-Certified-Safety/lewis-safety-ca6f27d09c6+31",
        "mobBtl": "4.2",
        "linux": "linux+3.8.6.1+lewis-release-121+17",
        "con": "3.9.6.1-tags/release-3.9.6.1@ffb83460/ubuntu"
      },
      "svcEndpoints": {
        "svcDeplId": "v011"
      },
      "timezone": "Europe/Zagreb",
      "tls": {
        "tzbChk": 1,
        "privKType": 2,
        "lcCiphers": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          50380848,
          50380847,
          50331708
        ]
      },
      "twoPass": false,
      "tz": {
        "events": [
          {
            "dt": 1619870400,
            "off": 120
          },
          {
            "dt": 1635642001,
            "off": 60
          },
          {
            "dt": 1648342801,
            "off": 120
          }
        ],
        "ver": 10
      },
      "vacHigh": false,
      "wDevLoc": true
    }
  }
}
```

```json
{
  "state": {
    "reported": {
      "netinfo": {
        "dhcp": true,
        "addr": "192.168.1.55",
        "mask": "255.255.255.0",
        "gw": "192.168.1.1",
        "dns1": "192.168.1.1",
        "dns2": "0.0.0.0",
        "bssid": "2c:30:33:23:0d:b4",
        "sec": 4
      },
      "signal": {
        "rssi": -53,
        "snr": 29,
        "noise": -82
      },
      "wifistat": {
        "cloud": 14,
        "wifi": 1,
        "uap": false
      },
      "wlcfg": {
        "sec": 4,
        "ssid": "574c414e30"
      }
    }
  }
}
```

```json
{
  "state": {
    "reported": {
      "signal": {
        "rssi": -52,
        "snr": 29,
        "noise": -81
      }
    }
  }
}
```


Start cleaning kitchen

10:02:46 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "cleanMissionStatus": {
        "cycle": "none",
        "phase": "charge",
        "expireM": 0,
        "rechrgM": 0,
        "error": 0,
        "notReady": 0,
        "mssnM": 0,
        "expireTm": 0,
        "rechrgTm": 0,
        "mssnStrtTm": 0,
        "initiator": "rmtApp",
        "nMssn": 178
      }
    }
  }
}
```

10:02:46 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "lastCommand": {
        "command": "start",
        "initiator": "rmtApp",
        "time": 1620115369,
        "ordered": 1,
        "pmap_id": "ikBwaAEXSCSFjwCFqogY8g",
        "regions": [
          {
            "region_id": "0",
            "type": "zid"
          }
        ],
        "user_pmapv_id": "210502T130902"
      }
    }
  }
}
```

10:02:49 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "pose": {
        "theta": 0,
        "point": {
          "x": 0,
          "y": 0
        }
      }
    }
  }
}
```

10:02:50 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "cleanMissionStatus": {
        "cycle": "clean",
        "phase": "run",
        "expireM": 0,
        "rechrgM": 0,
        "error": 0,
        "notReady": 0,
        "mssnM": 0,
        "expireTm": 0,
        "rechrgTm": 0,
        "mssnStrtTm": 1620115366,
        "initiator": "rmtApp",
        "nMssn": 179
      }
    }
  }
}
```

10:02:55 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic wifistat, Payload: 

```json
{
  "state": {
    "reported": {
      "netinfo": {
        "dhcp": true,
        "addr": "192.168.1.55",
        "mask": "255.255.255.0",
        "gw": "192.168.1.1",
        "dns1": "0.0.0.0",
        "dns2": "0.0.0.0",
        "bssid": "2c:30:33:23:0d:b4",
        "sec": 4
      }
    }
  }
}
```

10:02:59 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "dock": {
        "known": true,
        "pn": "4627965",
        "state": 300,
        "id": "971244254123189123324310513025518146178118",
        "fwVer": "4.0.8"
      }
    }
  }
}
```

10:02:59 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "pose": {
        "theta": 0,
        "point": {
          "x": -39,
          "y": 0
        }
      }
    }
  }
}
```

```json
{
  "state": {
    "reported": {
      "pose": {
        "theta": -11,
        "point": {
          "x": -57,
          "y": -1
        }
      }
    }
  }
}
```

Pause

10:04:37 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "lastCommand": {
        "command": "pause",
        "initiator": "rmtApp",
        "time": 1620115481,
        "ordered": null,
        "pmap_id": null,
        "regions": null,
        "user_pmapv_id": null
      }
    }
  }
}
```

```json
{
  "state": {
    "reported": {
      "cleanMissionStatus": {
        "cycle": "clean",
        "phase": "stop",
        "expireM": 0,
        "rechrgM": 0,
        "error": 0,
        "notReady": 0,
        "mssnM": 0,
        "expireTm": 1620120877,
        "rechrgTm": 0,
        "mssnStrtTm": 1620115366,
        "initiator": "rmtApp",
        "nMssn": 179
      }
    }
  }
}
```

Dock command

10:04:43 trce: Signal.Beacon.Application.Mqtt.MqttClient[0] 9894F1D88B6D4973B8070A8C49BF9A6E Topic $aws/things/9894F1D88B6D4973B8070A8C49BF9A6E/shadow/update, Payload: 

```json
{
  "state": {
    "reported": {
      "lastCommand": {
        "command": "dock",
        "initiator": "rmtApp",
        "time": 1620115486,
        "ordered": null,
        "pmap_id": null,
        "regions": null,
        "user_pmapv_id": null
      }
    }
  }
}
```
