import { createRoot } from 'react-dom/client';
import './index.css';
import { CommentsBootstrapper } from './components/CommentsBootstrapper';

const reviewParamKey = 'review';

function MountOnPage() {
    // Create root container and attach shadow DOM
    const container = document.createElement('div');
    container.setAttribute('id', 'uier-toolbar');
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    // Create style element in shadow dom
    const style = document.createElement('style');
    style.innerHTML = '__uier_toolbar_css__/*\"\"*/';
    shadowRoot.appendChild(style);

    // Create inner container (in shadow DOM)
    const shadowDomContainer = document.createElement('main');
    shadowRoot.appendChild(shadowDomContainer)

    // Inject root container into body
    document.body.appendChild(container);

    // Run React
    const root = createRoot(shadowDomContainer);
    root.render(<CommentsBootstrapper
        rootElement={shadowDomContainer}
        reviewParamKey={reviewParamKey} />);
}

console.debug('uier-toolbar: Checking review param...')
const urlInReview = new URL(window.location.href).searchParams.get(reviewParamKey) === 'true';
if (urlInReview) {
    console.debug('uier-toolbar: In review, mounting...');
    MountOnPage();
}
