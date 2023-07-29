export default function StationIndex() {
    return (
        <main>
            <h1 id="station">Station</h1>
            <h2 id="manual-setup-diy">Manual setup (DIY)</h2>
            <h3 id="prepare-sd-card">Prepare SD card</h3>
            <ul>
                <li>Download <a href="https://www.balena.io/etcher/">balena Etcher</a></li>
                <li>Attach SD card to your computer</li>
                <li>Flash directly from URL or download image<ul>
                    <li>Select &quot;Flash from URL&quot;<ul>
                        <li>Paste URL: <code>https://spublic.blob.core.windows.net/images/orangepizero2/Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.img</code> (latest Ubuntu image)</li>
                        <li>Confirm by clicking OK</li>
                    </ul>
                    </li>
                    <li>Select &quot;Flash from image&quot;<ul>
                        <li>Download image from <code>https://spublic.blob.core.windows.net/images/orangepizero2/Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.zip</code> (latest Ubuntu image)</li>
                        <li>Extract ZIP and select <code>.img</code> file to flash</li>
                    </ul>
                    </li>
                </ul>
                </li>
                <li>Etcher will download the image, when that is done click &quot;Select target&quot; and select SD card</li>
                <li>Click &quot;Flash!&quot; to start writing the image</li>
                <li>When done you can close the Etcher and remove the SD from your computer</li>
            </ul>
            <p>Image integrity:</p>
            <ul>
                <li>Name: <code>Orangepizero2_3.0.4_ubuntu_jammy_server_linux5.16.17.img</code></li>
                <li>SHA: <code>8b8dbecfa30a259d7f990bad9f3ceecfe477ba742e1a45ebc88a5cbccd43eb1d</code></li>
            </ul>
            <h3 id="installation-on-orange-pi-zero-2">Installation on Orange Pi Zero 2</h3>
            <p>ssh into <code>ssh root@orangepizero2</code> with password <code>orangepi</code></p>
            <h4 id="install-signalco-station">Install Signalco Station</h4>
            <pre><code className="language-bash">curl https://raw.githubusercontent.com/signalco-io/station/main/rpi-install.sh &gt; ./ss-install.sh
                sudo chmod +x ./ss-install.sh
                sudo ./ss-install.sh
            </code></pre>
            <p>After installation you should restart the device. When connecting again use <code>signalcostation</code> as hostname as it was changed during the installation: <code>ssh root@signalcostation</code> with password <code>orangepi</code>.</p>
            <h4 id="install-zigbee2mqtt">Install Zigbee2MQTT</h4>
            <pre><code className="language-bash">curl https://raw.githubusercontent.com/signalco-io/station/main/z2m-install.sh &gt; ./z2m-install.sh
                sudo chmod +x ./z2m-install.sh
                sudo ./z2m-install.sh
            </code></pre>
            <h4 id="useful-commands">Useful commands</h4>
            <pre><code className="language-bash"># View Signalco Station logs
                sudo journalctl -u signalcostation.service -f

                # View Zigbee2MQTT logs
                sudo journalctl -u zigbee2mqtt.service -f
            </code></pre>
            <h4 id="post-install-tips">Post-install tips</h4>
            <ul>
                <li>Change root password</li>
            </ul>
        </main>
    );
}
