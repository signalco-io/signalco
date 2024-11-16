function getQuerySelector(element: Element | Node | null | undefined, options: { proceedAfterId: boolean, includeClasses: boolean }) {
    if (!(element instanceof Element))
        return '';

    let currentNode: Element | null = element;
    if (!currentNode)
        return '';

    // Walk from current element up to the root
    const selectorParts = [];
    while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        let currentSelector = '';
        if (currentNode.id) {
            currentSelector += '#'.concat(escapeClass(currentNode.id))
            if (!options.proceedAfterId) {
                selectorParts.unshift(currentSelector);
                break;
            }
        } else {
            // Handle tag
            const currentTag = currentNode.nodeName.toLowerCase();
            if ('html' === currentTag)
                break;
            currentSelector += currentTag;

            // Handle classes
            const currentClass = currentNode.classList.item(0);
            if (options.includeClasses && currentClass) {
                currentSelector += `.${escapeClass(currentClass)}`;
            }

            let nthSibiling: Element | null = currentNode;
            let sibilingMathingClasses = options.includeClasses && currentClass;
            let sibilingsCount = 1
            while (nthSibiling = nthSibiling.previousElementSibling) {
                if (nthSibiling.nodeName.toLowerCase() === currentTag) {
                    sibilingsCount++;
                }
                if (options.includeClasses && currentClass && nthSibiling.classList.contains(currentClass)) {
                    sibilingMathingClasses = false;
                }
            }
            if (sibilingsCount !== 1 && !(options.includeClasses && sibilingMathingClasses)) {
                currentSelector += `:nth-of-type(${sibilingsCount})`;
            }
        }
        selectorParts.unshift(currentSelector);
        currentNode = currentNode.parentNode instanceof Element ? currentNode.parentNode : null;
    }
    return selectorParts.join('>')
}

function escapeClass(selector: string) {
    // Fix ID numbers: "50" -> "\\35\\30"
    return selector.replace(/([^a-zA-Z0-9-_])/g, '\\$1')
}

export const getElementSelector = (element: Element | Node | null | undefined) => {
    const variations = [
        getQuerySelector(element, {
            proceedAfterId: !1,
            includeClasses: !1
        }),
        getQuerySelector(element, {
            proceedAfterId: !0,
            includeClasses: !1
        }),
        getQuerySelector(element, {
            proceedAfterId: !1,
            includeClasses: !0
        }),
        getQuerySelector(element, {
            proceedAfterId: !0,
            includeClasses: !0
        })
    ];

    const selectors = new Set();
    return variations
        .filter(variationSelector => {
            if (selectors.has(variationSelector))
                return false;
            selectors.add(variationSelector);
            try {
                document.querySelector(variationSelector)
            } catch (n) {
                console.error('Faulty nodeId selector', variationSelector, String(n));
                return false;
            }
            return true;
        })
        .join(',');
}
