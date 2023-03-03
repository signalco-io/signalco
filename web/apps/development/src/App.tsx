import './App.css'

const apps = [
    { label: 'Web', href: 'http://localhost:3000' },
    { label: 'Blog', href: 'http://localhost:3002' },
    { label: 'App', href: 'http://localhost:3001' },
    { label: 'UI Docs', href: 'http://localhost:6007' },
    { label: 'slco', href: 'http://localhost:4002' },
    { label: 'brandgrab', href: 'http://localhost:4001' }
]

function App() {

  return (
    <div className="App">
        <h1>signalco development portal</h1>
        <ul className='launcher'>
            {apps.map(app => (
                <li key={app.label} className="launcher-card">
                    <a href={app.href} target="_blank">
                        <img src={`${app.href}/favicon.ico`} />
                        <div className="info">
                            <span>{app.label}</span>
                            <small>{app.href}</small>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default App
