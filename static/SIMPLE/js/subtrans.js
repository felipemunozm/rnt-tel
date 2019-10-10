function cambioEstiloElemento(nombre,icono){
    p=document.getElementsByName(nombre)[0].parentElement;
    child=p.firstChild;
    placeholder = child.innerText;
    console.log(p.children[1].localName);
    if(p.children[1].localName=="span"){
        placeholder = placeholder + p.children[1].innerText;
        p.children[1].remove();
    }
    var para = document.createElement("SPAN");
    para.setAttribute("class", "input-group-addon");
    var node = document.createElement("i");
    node.setAttribute("class","material-icons");
    var textnode = document.createTextNode(icono);
    node.appendChild(textnode);
    para.appendChild(node);
    p.insertBefore(para, child);
    p.setAttribute("class","input-group");
    var i=document.getElementsByName(nombre)[0];
    i.setAttribute("placeholder", placeholder);
    i.setAttribute("title", placeholder);
    child.remove();
    }