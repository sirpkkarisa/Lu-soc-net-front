(()=> {
    //DOM Elements and their EVENTS
    const getElemById = (id) => (document.getElementById(id));
    const createElem = (elem) => document.createElement(elem);
    
    const init = async () => {
        try {
        await getData({method: 'GET'});
        } catch (error) {
            console.log(error)
        }
    }
    let doc;
    getElemById('resource-file').addEventListener('change', (e) => {
        doc=e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const objElem = createElem('object');
            objElem.setAttribute('data', reader.result);
            getElemById('resource-form').appendChild(objElem);
        }
        reader.readAsDataURL(doc)
    });

    getElemById('resource-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('docTitle',doc.name);
        fd.append('authorId', localStorage.getItem('userId'));
        fd.append('document', doc, doc.name);
        getData({method: 'POST',fd});
    })
     getElemById('to-articles-section').addEventListener('click', (e) => {
        e.preventDefault();
        getElemById('articles-section').classList.remove('d-none');
        getElemById('articles-div').classList.remove('d-none');
        getElemById('resources-section').classList.add('d-none');
        getElemById('resources-div').classList.add('d-none');
    });
      getElemById('to-resources-section').addEventListener('click',(e)=> {
        e.preventDefault();
        getElemById('resources-section').classList.remove('d-none');
        getElemById('resources-div').classList.remove('d-none');
        getElemById('articles-section').classList.add('d-none');
        getElemById('articles-div').classList.add('d-none');
        getDocuments();
    });
      getElemById('forgot-password-link').addEventListener('click',(e) => {
       e.preventDefault();
        getElemById('login-div').classList.add('d-none');
        getElemById('forgot-section').classList.remove('d-none');
        getElemById('forgot-pass-form').addEventListener('submit',(e) => {
            e.preventDefault();
            const email = getElemById('email').value.trim();
            if (!email) {
                console.log('No Email');
                return;
            }
            getData({ email, END_POINT: 'auth/forgot-password'});
        })

    });
     
    
    const getDocuments =async (id) => {
      await  getData({method: 'GET', END_POINT: 'documents'});
    }
    const getArticle =async (id) => {
       const res = await getData({method:'GET',articleId: id});
        getElemById('delete-icon').addEventListener('click',()=> {
             getData({method:'DELETE',articleId: id, authorId: localStorage.getItem('userId')})
        });
        getElemById('btn-post').setAttribute('disabled',true)
        getElemById('edit-btn').addEventListener('click', () => {
            getElemById('article-title').value = localStorage.getItem('articleTitle');
            getElemById('article').value = localStorage.getItem('article');
             getElemById('btn-post').removeAttribute('disabled');
             getElemById('btn-post').textContent ='Update';
             getElemById('article-form').removeAttribute('aricle-form');
            getElemById('btn-post').addEventListener('click', () => {
                getData({
                    method:'PATCH',
                    articleId: id,
                    authorId: localStorage.getItem('userId'),
                    articleTitle: localStorage.getItem('articleTitle'),
                    article: localStorage.getItem('article')
                });
            });
            
        })
    }
    getElemById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
         let method = 'POST';
        const uid = getElemById('login-username').value.trim();
        const password = getElemById('login-password').value.trim();
        if (uid.length <1 || password.length <1) {
            getElemById('status')
            .innerHTML=`<span class="error">Invalid Login</span>`;
            return;
        }
        getData({uid,password, method})
    });
    getElemById('article-form').addEventListener('submit',(e) => {
        e.preventDefault();
        let method = 'POST';
        const articleTitle = getElemById('article-title').value.trim();
        const article = getElemById('article').value.trim();
        const articleE = createElem('article');
        const h5 = createElem('h5');
        const small = createElem('small');
        if (articleTitle.length <1 || article.length <1) {
            getElemById('article-status')
            .innerHTML=`<span class="error">Invalid Login</span>`;
            return;
        }
        h5.textContent = articleTitle;
        small.textContent = Date().toLocaleString();

                                articleE.innerHTML=`<div>
                                                    <h5>${articleTitle}</h5>`
                                                    + `${article}
                                                    <br>`
                                                    +`<strong><small>${Date().toLocaleString()}</small></strong>
                                                </div>`;
                                            getElemById('articles-div').appendChild(articleE)
        getData({articleTitle,article, method, authorId: localStorage.getItem('userId')})
        getElemById('article-title').value = '';
        getElemById('article').value = '';
        getElemById('btn-post').removeAttribute('btn-post');
    });
    getElemById('change-password-link').addEventListener('click',(ev) => {
        ev.preventDefault();
         getElemById('login-div').classList.add('d-none');
         getElemById('change-section').classList.remove('d-none');
         getElemById('change-pass-form').addEventListener('submit', (e) => {
             e.preventDefault();
             const newPassword = getElemById('new-password').value.trim();
             const uid = getElemById('user-id').value.trim();
             const currentPassword = getElemById('current-password').value.trim();
             const confirmPassword = getElemById('confirm-password').value.trim();
             if (!newPassword || !currentPassword || !confirmPassword || !uid) {
                alert('All fields are required');
                return;
            }
            if (newPassword.length < 6) {
                alert('Password Is too short')
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('Password Mismatch')
                return;
            }
           
            getData({ uid, currentPassword, newPassword, END_POINT: 'auth/change-password'});
         })
     });
    const url = 'http://localhost:5000';
    let END_POINT = 'auth/signin';
    
    let id =''
    if (id.length >1) {
        END_POINT =`${END_POINT}/${id}`;
    }else {
        END_POINT = END_POINT;
    }
    
    const makeGetRequest = (data)=> {
        return new Promise((resolve, reject)=> {
            const xhr = new XMLHttpRequest();
            
            let { method } = data;
            if (data === undefined) {
                method = 'GET'
            }
            if (data.END_POINT !== undefined && data.email !== undefined && data.END_POINT.includes('auth/forgot-password')) {
                method = 'PATCH';
                END_POINT = 'auth/forgot-password';
            }
            if (data.END_POINT !== undefined && data.END_POINT.includes('auth/change-password')) {
                method = 'PATCH';
                END_POINT = 'auth/change-password';
            }
            if (data.END_POINT !== undefined && data.END_POINT === 'documents') {
                END_POINT = 'documents';
                method = data.method;
            }
            if (data.document !== undefined) {
                END_POINT = 'documents';
            }
            if (data.fd !== undefined) {
                data = data.fd;
            }
            if (data.articleId !== undefined && id.length < 36) {
                END_POINT= `${END_POINT}/${data.articleId}`;
            }
            if (data.authorId !== undefined && data.articleId !== undefined ) {
                END_POINT = `${END_POINT.split('/')[0]}/${END_POINT.split('/')[1]}`
            }
            if (data.method == 'POST' && data.authorId !== undefined && END_POINT.split('/')[1] !== undefined) {
                method = 'PATCH';
            }

            xhr.open(method,`${url}/${END_POINT}`);
           
            xhr.onreadystatechange =() => {
                xhr.onprogress = (e) => {
                    console.log(e.loaded/e.total * 100 +'%')
                }
                if(xhr.readyState === 4) {
                    if(xhr.status === 200 || xhr.status === 201){
                        resolve(JSON.parse(xhr.response))
                    }else{
                        reject(JSON.parse(xhr.response));
                    }
                }
            }
            if (method == 'POST' || method == 'PATCH' || method == 'DELETE') {
                if (data !== undefined) {
                    if (method == 'PATCH' && data.END_POINT.includes('auth')) {
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(data));
                        return;
                    }
                    if (method == 'POST' && END_POINT.includes('documents') ) {
                         xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
                         xhr.send(data);
                        return;
                    }
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
                    xhr.send(JSON.stringify(data));
                    
                }else {
                    reject('Cannot Send empty data')
                }
                return;
            }else if(method == 'GET') {
                xhr.send();
                return;
            }else {
                reject('Invalid method');
            }
        })
    } 
    if (localStorage.getItem('token')) {
        getElemById('login-div').style.display ='none';
        getElemById('main-section').removeAttribute('style');
        END_POINT = 'articles';
    }else {
        getElemById('main-section').style.display ='none';
        getElemById('main-section').setAttribute('hidden',true);
    }
    const getData = async (data)=> {
        try {
            const res = await makeGetRequest(data);
            if (res.data.token) {
                localStorage.setItem('userId',res.data.userId);
                localStorage.setItem('token',res.data.token);
                document.location.reload()
                return;
            }
            let docOutput ='';
            let idArr = [];
            if (res.data[0].doc_id !== undefined) {
                res.data.forEach((item) => {
                    if (item.doc_url === undefined) {
                        return
                    }
                    idArr.push(item.doc_id)
                    if (item.doc_url.split('/')[4].split('.').lastIndexOf('pdf') !== -1) {
                        docOutput += `<div>
                             <a href=${item.doc_url} title=${item.doc_title}>
                             <h5 class="item-title">${item.doc_title}<i id="delete-resource" class="close-icon">&times;</i></h5>
                                <object data=${item.doc_url}></object>
                                <strong><small>${item.created_on}</small></strong>
                                </a>
                    </div>`
                        return
                    }
                    docOutput+= `<div>
                            <a href=${item.doc_url} title=${item.doc_title}>
                             <h5 class="item-title">${item.doc_title} <i id="delete-resource" class="close-icon">&times;</i></h5>
                                <p>Not Browser Compatible File! Click to download</p>
                                <strong><small>${item.created_on}</small></strong>
                                </a>
                                </div>`;
                    
                })
                getElemById('resources-div').innerHTML = docOutput;
                for (let i = 0; i < getElemById('resources-div').children.length; i++) {
                    getElemById('resources-div').children[i].addEventListener('click', () => {
    
                        getDocuments(idArr[i])                
                    })
                }
            }
            if (data.articleId && data.articleId.length === 36) {
                if (res.data[0].article_id === data.articleId) {
                    const art =createElem('article');
                    art.classList.add('the-article')
                    art.innerHTML=`
                    <div >
                    <h5 class="item-title">${res.data[0].article_title}<i id="delete-icon" class="close-icon">&times;</i></h5>`
                    + `${res.data[0].article}
                    <br>`
                    +`<strong><small>${res.data[0].created_on}</small></strong>
                   <div class="input-div"> <buttton type="submit" class="edit-btn" id="edit-btn">Edit</button></div>
                     </div>`
                    getElemById('article-item').appendChild(art);
                    getElemById('article-item').insertBefore(
                        art,
                        getElemById('article-item').firstChild
                    )
                    return;
                }
            }
            let obj = [];
            let articleOutput = '';
             if (res.data[0].article_id !== undefined) {
                res.data.forEach(element => {
                    articleOutput+=`<article name=${element.article_id}>
                    <div>
                    <h5>${element.article_title}</h5>`
                    + `${element.article}
                    <br>`
                    +`<strong><small>${element.created_on}</small></strong>
                     </div>
                    </article>`
                    idArr.push(element.article_id);
                    obj.push(element)
                })
                getElemById('articles-div').innerHTML = articleOutput;
                for (let i = 0; i < getElemById('articles-div').children.length; i++) {
                    getElemById('articles-div').children[i].addEventListener('click',(e)=> {
                        localStorage.setItem('articleTitle',obj[i].article_title)
                        localStorage.setItem('article',obj[i].article)
                        getArticle(idArr[i])
                        getElemById('articles-div').classList.add('d-none');
                        getElemById('article-item').classList.remove('d-none');
                    })
                }
             }
        } catch (res) {
            if (res.error === 'No articles') {
                getElemById('articles-div').innerHTML = `<div class="error">No Articles!<br>Be the first one to Post</div>`
                return;
            }
            if (res.error === 'Unauthorized') {
                getElemById('articles-div').innerHTML = `<div class="error">Unauthorized</div>`
                return;
            }
            console.log(res)
            if (res.error) {
                getElemById('status')
                .innerHTML=`<span class="error">${res.error}</span>`;
                return;
            }
        }
    } 
    init();
})()





















