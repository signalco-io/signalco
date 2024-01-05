import { createRoot } from 'react-dom/client';
import './index.css';
import { CommentsBootstrapper } from './components/CommentsBootstrapper';

function MountOnPage() {
    const container = document.createElement('div');
    container.setAttribute('id', 'uier-toolbar');
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', 'http://localhost:4005/index.css');
    shadowRoot.appendChild(stylesheet);

    document.body.appendChild(container);
    const root = createRoot(shadowRoot);
    root.render(<CommentsBootstrapper rootElement={shadowRoot} />);
}

MountOnPage();
