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

//@oaram name = Nombre del input que se utilizara para almacenar los datos.
    //@param opciones: Opciones que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    //@param estado: 0 para crear entrada  de documentos y cargar tabla, 1 carga solo los datos del input y crea la tabla
    //               por defecto es 0;
    //@param opcionales:Opciones consideradas opcionales que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    function CrearInputFile(name,estado=0,opciones=[],opcionales=[]){
    var input = $("input[name='"+name+"']")[0];
        
    $("#"+input.id).attr("type","hidden");
    if(estado==0){

        var id = input.id;
        var padre = $("#"+id).parent();
        var idFormulario = window.location.href;
        console.log(idFormulario);
        idFormulario = idFormulario.split("/")[5];
        var urlDom = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2];
        var urlAux=urlDom+"/uploader/datos/"+id+"/"+idFormulario+"?_token="+window._token+"&qqfile=";


        var opAux = "";
        if(opciones.length>0){
            opAux="<h6>Obligatorios</h6><div class='input-group mb-3' id='divSelect"+id+"'><select id='select"+id+"' name='selectCustom' class='form-control'>";
            for(var i in opciones){
                opAux = opAux + "<option value='"+opciones[i].value+"'>"+opciones[i].text+"</option>";
            }
            opAux=opAux+"</select><div class='input-group-append'><span class='input-group-text'>Tipo de documento</span></div></div>";


            padre.html(padre.html()+"<br>"+opAux+'<div class="custom-file"><input class="custom-file-input" type="file" id="if'+id+'" onchange="cambiarTextInput('+id+');" lang="es"/><label class="custom-file-label" for="if'+id+'">Seleccionar Archivo</label></div><input class="qq-upload-button btn btn-primary" type="button" id="bt'+id+'" value="Subir documento"/><br>');




            

        }
        
        
        
        opOpcAux=""
        if(opcionales.length>0){
            opOpcAux="<h6>Opcionales</h6><div class='input-group mb-3' id='divSelectOpcional"+id+"'><select id='selectOpcional"+id+"' name='selectCustomOpcional' class='form-control'>";
            for(var i in opcionales){
                opOpcAux = opOpcAux + "<option value='"+opcionales[i].value+"'>"+opcionales[i].text+"</option>";
            }
            opOpcAux=opOpcAux+"</select><div class='input-group-append'><span class='input-group-text'>Tipo de documento</span></div></div>";

            padre.html(padre.html()+"<br>"+opOpcAux+'<div class="custom-file"><input class="custom-file-input" type="file" id="ifop'+id+'" onchange="cambiarTextInputOpcional('+id+');" lang="es"/><label class="custom-file-label" for="ifop'+id+'">Seleccionar Archivo</label></div><input class="qq-upload-button btn btn-primary" type="button" id="btop'+id+'" value="Subir documento"/><br>');

        }


        padre.html(padre.html()+'<br><br><table id="table'+id+'" class="ht_master handsontable" style="width:100%"><tr><th style="width:50%">Tipo de documento</th><th style="width:50%">Documento</th><th></th></tr></table>');

        if(input.value!=""){
                var valores = input.value.split("|");
                
                var htmlCarga = "";
                for(var i=1;i<valores.length;i++){
                    var obj  = valores[i].split(";");
                    var obj1 = obj[0].split("/");
                    htmlCarga =htmlCarga+ '<tr id="tr'+obj1[5]+'" alt="'+obj[5]+'"><td>'+obj[2]+'</td><td><a target="_blank" href="'+obj[0]+'">'+obj[1]+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+id+','+obj1[5]+',\''+valores[i]+'\',\''+obj[3]+'\');"><i class="material-icons">delete</i></div></td></tr>';
                    
                    if(obj[4]=="1"){
                        if(opciones!="undefined"){$("#select"+id+" option[value='"+obj[2]+"']")[0].remove();}
                        var htmlSelec = $("#select"+id).html();
                        
                        if(htmlSelec==""){
                            $("#divSelect"+id).attr("style","display:none");
                            $("#select"+id).attr("style","display:none");
                        }
                    }

                    if(obj[4]=="2"){
                        if(opcionales!="undefined"){$("#selectOpcional"+id+" option[value='"+obj[2]+"']")[0].remove();}
                        var htmlSelec = $("#selectOpcional"+id).html();
                        
                        if(htmlSelec==""){
                            $("#divSelectOpcional"+id).attr("style","display:none");
                            $("#selectOpcional"+id).attr("style","display:none");
                        }
                    }
                    
                }

                $("#table"+id+" tbody").html($("#table"+id+" tbody").html()+htmlCarga);

            }




        $("#bt"+id).on("click",function(){

                console.log("subiendo");
            
                if($("#if"+id)[0].files[0]==undefined){
                    alert("Debe seleccionar un archivo");
                    return false;

                }
                var data = new FormData();
                var nombre = $("#if"+id)[0].files[0].name;
                var tipoArchivo = $("#if"+id)[0].files[0].type;
                var url = urlAux+nombre;
                data.append("",$("#if"+id)[0].files[0]);

                var selectAux = document.getElementById("select"+id);
                
                
                if(selectAux!=null && $("#select"+id).html()==""){
                    alert("No hay documentos pendientes");
                    return false;
                }

                $(this).attr("disabled","disabled");
                $(this).val("Subiendo...");

                if(selectAux!=null){



                    var valorSelect = selectAux.value;
                    var textoSelect = $("#select"+id+" option[value='"+valorSelect+"']").text();
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function () {
                        if(xhr.readyState==4 && xhr.status==200){
                            
                            var json = JSON.parse(xhr.responseText);
                            var urlArchivo = window.location.origin+"/uploader/datos_get/"+json.id+"/"+json.llave;
                            var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";1;"+tipoArchivo;
                            
                            var htmlAux = $("#table"+id+" tbody").html();
                            var htmlAux = htmlAux+ '<tr id="tr'+json.id+'"><td>'+valorSelect+'</td><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+id+','+json.id+',\''+data+'\',\''+textoSelect+'\');"><i class="material-icons">delete</i></div></td></tr>';
                            $("#table"+id+" tbody").html(htmlAux);
                            $("#select"+id+" option[value='"+valorSelect+"']")[0].remove();
                            var htmlSelec = $("#select"+id).html();
                            
                            if(htmlSelec==""){
                                
                                $("#select"+id).attr("style","display:none");
                                $("#divSelect"+id).attr("style","display:none");
                            }
                            $("#"+id).val($("#"+id).val()+"|"+data);
                            
                            $("#bt"+id).removeAttr("disabled");
                            $("#bt"+id).val("Subir documento");
                        }else{
                            if(xhr.readyState==4 && xhr.status!=200){
                                $("#bt"+id).removeAttr("disabled");
                                $("#bt"+id).val("Subir documento");
                                alert("Error al subir documento");
                            }
                        }
                    };

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("X-File-Name", encodeURIComponent(nombre));
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.send($("#if"+id)[0].files[0]);

                
                }else{
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function () {
                        
                        if(xhr.readyState==4 && xhr.status==200){
                            var json = JSON.parse(xhr.responseText);
                            var urlArchivo = urlDom+"/uploader/datos_get/"+json.id+"/"+json.llave;
                            var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;1;"+tipoArchivo;
                            var htmlAux = $("#table"+id+" tbody").html();
                            var htmlAux = htmlAux+ '<tr id="tr'+json.id+'"><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td>No aplica</td><td><a class="btn btn-danger" style="color:white;" onclick="deleteTr('+id+','+json.id+',\''+data+'\');">X</a></td></tr>';
                            $("#table"+id+" tbody").html(htmlAux);

                            $("#"+id).val($("#"+id).val()+"|"+data);
                            
                            $("#bt"+id).removeAttr("disabled");
                            $("#bt"+id).val("Subir documento");
                        }
                    };

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("X-File-Name", encodeURIComponent(nombre));
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.send($("#if"+id)[0].files[0]);
                    
                }
            
            });



            $("#btop"+id).on("click",function(){

            
            
                if($("#ifop"+id)[0].files[0]==undefined){
                    alert("Debe seleccionar un archivo");
                    return false;

                }
                var data = new FormData();
                var nombre = $("#ifop"+id)[0].files[0].name;
                var tipoArchivo = $("#ifop"+id)[0].files[0].type;
                var url = urlAux+nombre;
                data.append("",$("#ifop"+id)[0].files[0]);

                var selectAux = document.getElementById("selectOpcional"+id);
                
                
                if(selectAux!=null && $("#selectOpcional"+id).html()==""){
                    alert("No hay documentos pendientes");
                    return false;
                }

                $(this).attr("disabled","disabled");
                $(this).val("Subiendo...");

                if(selectAux!=null){



                    var valorSelect = selectAux.value;
                    var textoSelect = $("#selectOpcional"+id+" option[value='"+valorSelect+"']").text();
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function () {
                        if(xhr.readyState==4 && xhr.status==200){
                            
                            var json = JSON.parse(xhr.responseText);
                            var urlArchivo = window.location.origin+"/uploader/datos_get/"+json.id+"/"+json.llave;
                            var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";2;"+tipoArchivo;
                            
                            var htmlAux = $("#table"+id+" tbody").html();
                            var htmlAux = htmlAux+ '<tr id="tr'+json.id+'"><td>'+valorSelect+'</td><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+id+','+json.id+',\''+data+'\',\''+textoSelect+'\');"><i class="material-icons">delete</i></div></td></tr>';
                            $("#table"+id+" tbody").html(htmlAux);
                            $("#selectOpcional"+id+" option[value='"+valorSelect+"']")[0].remove();
                            var htmlSelec = $("#selectOpcional"+id).html();
                            
                            if(htmlSelec==""){
                                
                                $("#selectOpcional"+id).attr("style","display:none");
                                $("#divSelectOpcional"+id).attr("style","display:none");
                            }
                            $("#"+id).val($("#"+id).val()+"|"+data);
                            
                            $("#btop"+id).removeAttr("disabled");
                            $("#btop"+id).val("Subir documento");
                        }else{
                            if(xhr.readyState==4 && xhr.status!=200){
                                $("#btop"+id).removeAttr("disabled");
                                $("#btop"+id).val("Subir documento");
                                alert("Error al subir documento");
                            }
                        }
                    };

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("X-File-Name", encodeURIComponent(nombre));
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.send($("#ifop"+id)[0].files[0]);

                
                }else{
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function () {
                        
                        if(xhr.readyState==4 && xhr.status==200){
                            var json = JSON.parse(xhr.responseText);
                            var urlArchivo = urlDom+"/uploader/datos_get/"+json.id+"/"+json.llave;
                            var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;2;"+tipoArchivo;
                            var htmlAux = $("#table"+id+" tbody").html();
                            var htmlAux = htmlAux+ '<tr id="tr'+json.id+'"><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td>No aplica</td><td><a class="btn btn-danger" style="color:white;" onclick="deleteTr('+id+','+json.id+',\''+data+'\');">X</a></td></tr>';
                            $("#table"+id+" tbody").html(htmlAux);

                            $("#"+id).val($("#"+id).val()+"|"+data);
                            
                            $("#btop"+id).removeAttr("disabled");
                            $("#btop"+id).val("Subir documento");
                        }
                    };

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("X-File-Name", encodeURIComponent(nombre));
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.send($("#ifop"+id)[0].files[0]);
                    
                    }
                
            });

        
    }


    if(estado==1){
        id = input.id;
        var padre = $("#"+id).parent();
        padre.html(padre.html()+"<br>"+'<table id="table'+id+'" class="ht_master handsontable" style="width:100%"><tr><th style="width:50%">Tipo de documento</th><th style="width:50%">Documento</th></tr></table>');

        if(input.value!=""){
            var valores = input.value.split("|");
            
            var htmlCarga = "";
            for(var i=1;i<valores.length;i++){
                var obj  = valores[i].split(";");
                var obj1 = obj[0].split("/");
                htmlCarga =htmlCarga+ '<tr><td>'+obj[2]+'</td><td><a target="_blank" href="'+obj[0]+'">'+obj[1]+'</a></td></tr>';
            }

            $("#table"+id+" tbody").html($("#table"+id+" tbody").html()+htmlCarga);
        }

    }

    }

    function cambiarTextInput(id){
        
        if($("#if"+id)[0].files[0]==undefined){
            $("label[for='if"+id+"']").text("Seleccionar Archivo");
        }else{
            $("label[for='if"+id+"']").text($("#if"+id)[0].files[0].name);    
        }
        

    }

    function cambiarTextInputOpcional(id){
        
        if($("#ifop"+id)[0].files[0]==undefined){
            $("label[for='ifop"+id+"']").text("Seleccionar Archivo");
        }else{
            $("label[for='ifop"+id+"']").text($("#ifop"+id)[0].files[0].name);    
        }
        

    }

    function deleteTr(id,tr,data,textoSelect){
        obj = data.split(";");
        console.log(obj);
        if(obj[4]=="1"){
            if($("#select"+id)[0]!=null){
                if($("#select"+id).attr("style")!=undefined){
                    $("#select"+id).removeAttr("style");
                    $("#divSelect"+id).removeAttr("style");
                }
                $("#select"+id).html($("#select"+id).html()+"<option value='"+obj[2]+"'>"+textoSelect+"</option>")
                
            }
        }

        if(obj[4]=="2"){
            if($("#selectOpcional"+id)[0]!=null){
                if($("#select"+id).attr("style")!=undefined){
                    $("#selectOpcional"+id).removeAttr("style");
                    $("#divSelectOpcional"+id).removeAttr("style");
                }
                $("#selectOpcional"+id).html($("#selectOpcional"+id).html()+"<option value='"+obj[2]+"'>"+textoSelect+"</option>")
                
            }
        }

        var idTr = "tr"+tr;
        $("#"+id).val($("#"+id).val().replace("|"+data,""));
        $("#"+idTr).remove();
    }
