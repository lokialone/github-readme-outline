function traveral(element, tree, tagList) {
    if (!element)
        return;
    var child = element;
    if (tagList.includes(child.tagName)) {
        tree.push({
            label: child.tagName,
            text: child.textContent,
            href: child.firstElementChild.id,
            child: child.firstElementChild || null
        });
    }
    var nextElementSibling = child.nextElementSibling;
    if (nextElementSibling) {
        return traveral(nextElementSibling, tree, tagList);
    }
    else {
        return tree;
    }
}
function getTopParent() {
    var markdown = document.querySelector('.markdown-body');
    return markdown || document.body || null;
}
// h1 - h[n]
function createHTagList(length) {
    var array = Array.from({ length: length }, function (v, i) { return i + 1; }) || [1];
    return Array.from(array, function (x) { return "H" + x; });
}
function template(array) {
    return array.map(function (x) {
        return "<a class='LK-" + x.label + " LK-A' href=#" + x.href + ">" + x.text + "</a>";
    }).join(' ');
}
// not pure at all.
function createDom(templates) {
    var domc = document.createElement('div');
    domc.className = 'lk-outline-container';
    var content = document.createElement('div');
    content.className = 'lk-content LK-HIDE';
    content.innerHTML = templates;
    var operate = document.createElement('div');
    operate.className = 'LK-OPERATE LK-SHOW';
    operate.addEventListener('click', function () {
        if (content.className === 'lk-content LK-HIDE') {
            content.className = 'lk-content LK-SHOW';
        }
        else {
            content.className = 'lk-content LK-HIDE';
        }
    });
    domc.appendChild(content);
    domc.appendChild(operate);
    document.body.append(domc);
}
document.addEventListener('DOMContentLoaded', function () {
    var parent = getTopParent();
    if (!parent || !parent.firstElementChild)
        return;
    var hTagList = createHTagList(6);
    var tree = traveral(parent.firstElementChild, [], hTagList);
    if (tree.length) {
        var templates = template(tree);
        createDom(templates);
    }
});
