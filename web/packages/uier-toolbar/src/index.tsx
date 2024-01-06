import { createRoot } from 'react-dom/client';
import './index.css';
import { CommentsBootstrapper } from './components/CommentsBootstrapper';

function MountOnPage() {
    const container = document.createElement('div');
    container.setAttribute('id', 'uier-toolbar');
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    // Create style element in shadow dom
    const style = document.createElement('style');
    style.innerHTML = '__uier_toolbar_css__/*\"\"*/';
    shadowRoot.appendChild(style);

    const shadowDomContainer = document.createElement('main');
    shadowRoot.appendChild(shadowDomContainer)

    document.body.appendChild(container);

    const root = createRoot(shadowDomContainer);
    root.render(<CommentsBootstrapper rootElement={shadowDomContainer} />);
}

MountOnPage();
