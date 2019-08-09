function traveral(element: HTMLElement, tree : [], tagList: string[]) {
    if (!element) return;
    let child: HTMLElement = element
    if (tagList.includes(child.tagName) && child.firstElementChild) {
        tree.push({
            label: child.tagName,
            text: child.textContent,
            href: child.firstElementChild.id,
            child: child.firstElementChild || null
        }); 
    }  
    let nextElementSibling = child.nextElementSibling;
    if (nextElementSibling) {
        return traveral(nextElementSibling, tree, tagList)
    } else {
        return tree;
    }
    
}

function getTopParent() :HTMLElement|null {
    let markdown = document.querySelector('.markdown-body');
    return markdown || document.body || null;
}

// h1 - h[n]
function createHTagList (length) :string[] {
    const array :number[] = Array.from({length: length}, (v, i) => i + 1) || [1];
    return Array.from(array, (x) => `H${x}`);
}

function template(array) :string{
    return array.map((x) => {
        return `<a class='LK-${x.label} LK-A' href=#${x.href}>${x.text}</a>`
    }).join(' ');
}

// not pure at all.
function createDom(templates) {
    let domc = document.createElement('div');
    domc.className = 'lk-outline-container';

    let content = document.createElement('div');
    content.className = 'lk-content LK-SHOW';
    content.innerHTML = templates;

    let operate = document.createElement('div');
    operate.className = 'LK-OPERATE LK-SHOW';
    operate.addEventListener('mouseover', () => {
        if (content.className === 'lk-content LK-HIDE') {
            content.className = 'lk-content LK-SHOW'
        } else {
            content.className = 'lk-content LK-HIDE'
        }
    });
    operate.addEventListener('click', () => {
        if (content.className === 'lk-content LK-HIDE') {
            content.className = 'lk-content LK-SHOW'
        } else {
            content.className = 'lk-content LK-HIDE'
        }
    });
    content.addEventListener('mouseleave', () => {
        content.className = 'lk-content LK-HIDE';
    })

    domc.appendChild(content);
    domc.appendChild(operate);
    document.body.append(domc); 
} 

function init() :void {
    let parent: HTMLElement = getTopParent();
    if (!parent || !parent.firstElementChild) return;
    // const hTagList: string[] = createHTagList(6);
    const hTagList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const tree = traveral(parent.firstElementChild, [], hTagList);
    if (tree.length) {
        const templates = template(tree);
        createDom(templates);
    }
}

// export default init;
init();