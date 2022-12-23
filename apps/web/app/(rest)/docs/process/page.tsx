export default function ProcessPage() {
    return (
        <main>
            <h1>Processes Configuration</h1>
            <h2>Shared</h2>
            <p>Shared part of configuration is <code>version</code> and <code>type</code>. This part will remain unchanged through versions and when new type of configurations are introduced.</p>
            <pre><code className="language-json">
                {'{'}
                &quot;version&quot;: &quot;1.0.0&quot;,
                &quot;type&quot;: &quot;basic&quot;
                {'}'}
            </code></pre>
            <h2>Versions</h2>
            <h3>Version 1.0.0</h3>
            <h4>Type: Basic</h4>
            <pre><code className="language-json"></code></pre>
        </main>
    )
}
