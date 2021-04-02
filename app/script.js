const fs = require('fs');
const os = require('os');
const pathHelper = require('path');
const mime = require('mime');

const history = [os.homedir()];
var index = 0;
const message = document.querySelector('#message'); 
const ul = document.querySelector('#directoryListing');
const currentLocation = document.querySelector('#currentLocation');
const back = document.querySelector('#back');
const forward = document.querySelector('#forward');

function loadDir(path){
    history.splice(index + 1, history.length - index);
    history.push(path);
    index++;
    loadPath(path);
}

function loadPath(path){
    // Disable nav buttons if end of history
    if (index == 0)
        back.classList.add('disabled');
    else 
        back.classList.remove('disabled');
    
    if (index == history.length - 1)
        forward.classList.add('disabled');
    else 
        forward.classList.remove('disabled');

    // Check if the path is a bookmark
    document.querySelectorAll('#bookmarked li').forEach(bookmark => {
        if(bookmark.getAttribute('id').replace('~', `${os.homedir()}`) === path)
            bookmark.classList.add('selected');
        else
            bookmark.classList.remove('selected');
    });

    // Clear rightPane and update currentLocation
    message.innerText = '';
    ul.innerHTML = '';
    currentLocation.innerHTML = path.replace(os.homedir(), '<i class="fas fa-home fa-fw"></i>Home');

    const listing = fs.readdirSync(path, {withFileTypes: true});
    const folders = listing.filter(item => item.isDirectory()).map(item => item.name);
    const files = listing.filter(item => item.isFile()).map(item => item.name);
    const symlinks = listing.filter(item => item.isSymbolicLink()).map(item => item.name);

    for(const symlink of symlinks){
        let listElement = document.createElement('li');
        listElement.innerText = symlink;
        ul.appendChild(listElement);        
    }
    for(const folder of folders){
        let listElement = document.createElement('li');
        listElement.innerHTML = `<img src='icons/places/folder-${folder.startsWith('.') ? 'black' : 'blue'}.svg'><span>${folder}</span>`;
        listElement.addEventListener('dblclick', () => {
            let newPath = pathHelper.join(history[index], folder);
            loadDir(newPath);
        });
        ul.appendChild(listElement);
    }
    for(const file of files){
        let listElement = document.createElement('li');
        let mimeType = (mime.getType(file)) ? mime.getType(file).replaceAll('/', '-') : 'text-plain';
        listElement.innerHTML = `<img src='icons/mimetypes/${mimeType}.svg'><span>${file}</span>`;
        ul.appendChild(listElement);
    }

    if(!ul.hasChildNodes){
        message.innerText = 'This folder is empty!';
        return;
    }

}

document.body.onload = () => {
    loadPath(history[index]);
    for(const bookmark of document.querySelectorAll('#bookmarked li')){
        bookmark.addEventListener('click', () => {
            loadDir(bookmark.getAttribute('id').replace('~', `${os.homedir()}`));
        });
    }
};

back.addEventListener('click', () => {
    if (index == 0) return;
    index--;
    loadPath(history[index]);
});

forward.addEventListener('click', () => {
    if (index == history.length - 1) return;
    index++;
    loadPath(history[index]);
});
