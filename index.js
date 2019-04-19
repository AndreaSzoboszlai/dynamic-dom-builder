const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let albumsDivEl;
let loadButtonEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');

        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        const postIdAttr = post.id;
        pEl.setAttribute('post-id', postIdAttr);
        pEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', postIdAttr)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';
    albumsDivEl.style.display = 'none';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name (click to view posts)';

    const albumTdEl = document.createElement('td');
    albumTdEl.textContent = 'View album';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);
    trEl.appendChild(albumTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        // creating name cell
        const albumUserIdAttr = document.createAttribute('album-user-id');
        albumUserIdAttr.value = user.id;

        const buttonNameEl = document.createElement('button');
        buttonNameEl.textContent = user.name;

        const buttonAlbumEl = document.createElement('button');
        buttonAlbumEl.textContent = user.name + '\'s albums';

        buttonNameEl.setAttributeNode(dataUserIdAttr);
        buttonAlbumEl.setAttributeNode(albumUserIdAttr);

        buttonNameEl.addEventListener('click', onLoadPosts);
        buttonAlbumEl.addEventListener('click', onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonNameEl);

        const albumTdEl = document.createElement('td');
        albumTdEl.appendChild(buttonAlbumEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(albumTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}
//Loading and displaying photos

function createPhotoList(photos) {
    const ulEl = document.createElement('ul');
    ulEl.classList.add('photos');

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];

        ulEl.setAttribute('id', photo.albumId);

        const aEl = document.createElement('a');
        aEl.setAttribute('href', photo.url);

        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', photo.thumbnailUrl);
        aEl.appendChild(imgEl);

        const liEl = document.createElement('li');
        liEl.appendChild(aEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function onPhotosReceived() {
    const text = this.responseText;
    const photos = JSON.parse(text);
    const albumId = photos[0].albumId;


    const photoList = document.getElementsByClassName('photos');
    for (let i = 0; i < photoList.length; i++) {
        const photo = photoList[i];
        if (photo.getAttribute('id') !== albumId) {
            photo.remove();
        }
    }

    const divClickedAlbum = document.getElementById(albumId);
    if (divClickedAlbum.childNodes.length <= 1) {
        divClickedAlbum.appendChild(createPhotoList(photos));
    }
}

function onLoadPhotos() {
    const albumEl = this;
    const albumId = albumEl.getAttribute('id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPhotosReceived);
    xhr.open('GET', BASE_URL + '/photos?albumId=' + albumId);
    xhr.send();
}

//Loading albums and displaying them
function createAlbumList(albums) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = album.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);

        const albumIdAttr = album.id;
        pEl.setAttribute('id', albumIdAttr);
        pEl.addEventListener('click', onLoadPhotos);

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onAlbumsReceived() {

    postsDivEl.style.display = 'none';
    albumsDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const albumId = albums[0].userId;

    const divAlbum = document.getElementById('albums-content');

    while (divAlbum.firstChild) {
        divAlbum.removeChild(divAlbum.firstChild);
    }
    divAlbum.appendChild(createAlbumList(albums));
}

function onLoadAlbums() {
    const albumEl = this;
    const userId = albumEl.getAttribute('album-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

// functions for clicking on a post and seeing the comments for them
function createCommentsForUser(comments) {
    const ulCommentEl = document.createElement('ul');
    ulCommentEl.classList.add('comments');

    const h3El = document.createElement('h3');
    h3El.textContent = 'Comments';
    ulCommentEl.appendChild(h3El);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        ulCommentEl.setAttribute('id', comment.postId);

        const strongCEl = document.createElement('strong');
        strongCEl.textContent = comment.name;

        const pCEl = document.createElement('p');
        pCEl.appendChild(strongCEl);
        pCEl.appendChild(document.createTextNode(`: ${comment.body}`));

        const liCEl = document.createElement('li');
        liCEl.appendChild(pCEl);

        ulCommentEl.appendChild(liCEl);
    }
    return ulCommentEl;
}


function onCommentsReceived() {
    const text1 = this.responseText;
    const comments = JSON.parse(text1);

    const postId = comments[0].postId;
    const idList = document.getElementsByClassName('comments');

    for (let i = 0; i < idList.length; i++) {
        const comment = idList[i];
        if (comment.getAttribute('id') !== postId) {
            comment.remove();
        }
    }

    const divPostC = document.getElementById(postId);
    if (divPostC.childNodes.length <= 1) {
        divPostC.appendChild(createCommentsForUser(comments));
    }


}

function onLoadComments() {
    const pt = this;
    const postId = pt.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    albumsDivEl = document.getElementById('albums');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});
