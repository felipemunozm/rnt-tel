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

//@param opciones:Arreglo de json = Opciones que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    //@param estado:numerico =  0 para crear entrada  de documentos y cargar tabla, 1 carga solo los datos del input y crea la tabla
    //               por defecto es 0;
    //@param opcionales:Arreglo de json = Opciones consideradas opcionales que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    //@param titulo: String =  Titulo para los documentos
    //
    function CrearInputFile(name,estado=0,opciones=[],opcionales=[],titulo=""){
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

        if(titulo!="" && titulo!=undefined){
            var divTitulo = '<div class="campo control-group" style="display:block">';
            divTitulo +='<h4 style="float:right" class="campo">'+titulo+'</h4>'
            divTitulo += '<br><p></p><hr style="border-width:1,5px;"><p></p>'
            divTitulo += '</div>';
            padre.html(divTitulo+padre.html());
        }


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
                    htmlCarga =htmlCarga+ '<tr id="tr'+obj1[5]+'"><td>'+obj[2]+'</td><td><a target="_blank" href="'+obj[0]+'">'+obj[1]+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+id+','+obj1[5]+',\''+valores[i]+'\',\''+obj[3]+'\');"><i class="material-icons">delete</i></div></td></tr>';
                    
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
                            var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";1;"+tipoArchivo+";"+titulo;
                            
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
                            var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;1;"+tipoArchivo+";"+titulo;
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
                            var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";2;"+tipoArchivo+";"+titulo;
                            
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
                            var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;2;"+tipoArchivo+";"+titulo;
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
                if($("#selectOpcional"+id).attr("style")!=undefined){
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


    //@param opciones:Arreglo de json = Opciones que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    //@param estado:numerico =  0 para crear entrada  de documentos y cargar tabla, 1 carga solo los datos del input y crea la tabla
    //               por defecto es 0;
    //@param opcionales:Arreglo de json = Opciones consideradas opcionales que seran incorporadas a un "<Select>" de html, si no se incluye no se creara el "<Select>"
    //                  formato: [{"value":"valor","text":"texto"}, ...]
    //@param titulo: String =  Titulo para los documentos
    //
    function CrearInputFileS3(name,estado=0,opciones=[],opcionales=[],titulo=""){
    var input = $("input[name='"+name+"']")[0];
        
    $("#"+input.id).attr("type","hidden");
    if(estado==0){

        var id = input.id;
        var padre = $("#"+id).parent();
        var idFormulario = window.location.href;
        
        
        idFormulario = idFormulario.split("/")[5];
        
        var urlDom = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[3];
        var urlAux=urlDom+"/uploader/datos/"+id+"/"+idFormulario+"?_token="+window._token+"&qqfile=";

        if(titulo!="" && titulo!=undefined){
            var divTitulo = '<div class="campo control-group" style="display:block">';
            divTitulo +='<h4 style="float:right" class="campo">'+titulo+'</h4>'
            divTitulo += '<br><p></p><hr style="border-width:1,5px;"><p></p>'
            divTitulo += '</div>';
            padre.html(divTitulo+padre.html());
        }


        var opAux = "";
        if(opciones.length>0){
            opAux="<h6>Obligatorios</h6><div class='input-group mb-3' id='divSelect"+id+"'><select id='select"+id+"' name='selectCustom' class='form-control'>";
            for(var i in opciones){
                opAux = opAux + "<option value='"+opciones[i].value+"'>"+opciones[i].text+"</option>";
            }
            opAux=opAux+"</select><div class='input-group-append'><span class='input-group-text'>Tipo de documento</span></div></div>";

            

            padre.html(padre.html()+"<br>"+opAux+'<div class="custom-file"><input class="custom-file-input" type="file" id="if'+id+'" onchange="cambiarTextInput('+id+');" lang="es"/><label class="custom-file-label" for="if'+id+'">Seleccionar Archivo</label></div><input class="qq-upload-button btn btn-primary" type="button" id="bt'+id+'" value="Subir documento"/><br>');

            padre.html(padre.html()+'<progress id="progress_obligatorio'+id+'" value="0" max="1"></progress>');


            

        }
        
        
        
        opOpcAux=""
        if(opcionales.length>0){
            opOpcAux="<h6>Opcionales</h6><div class='input-group mb-3' id='divSelectOpcional"+id+"'><select id='selectOpcional"+id+"' name='selectCustomOpcional' class='form-control'>";
            for(var i in opcionales){
                opOpcAux = opOpcAux + "<option value='"+opcionales[i].value+"'>"+opcionales[i].text+"</option>";
            }
            opOpcAux=opOpcAux+"</select><div class='input-group-append'><span class='input-group-text'>Tipo de documento</span></div></div>";

            

            padre.html(padre.html()+"<br>"+opOpcAux+'<div class="custom-file"><input class="custom-file-input" type="file" id="ifop'+id+'" onchange="cambiarTextInputOpcional('+id+');" lang="es"/><label class="custom-file-label" for="ifop'+id+'">Seleccionar Archivo</label></div><input class="qq-upload-button btn btn-primary" type="button" id="btop'+id+'" value="Subir documento"/><br>');
            padre.html(padre.html()+'<progress id="progress_opcional'+id+'" value="0" max="1"></progress>');
        }


        padre.html(padre.html()+'<br><br><table id="table'+id+'" class="ht_master handsontable" style="width:100%"><tr><th style="width:50%">Tipo de documento</th><th style="width:50%">Documento</th><th></th></tr></table>');

        if(input.value!=""){
                var valores = input.value.split("|");
                
                var htmlCarga = "";
                for(var i=1;i<valores.length;i++){

                    var obj  = valores[i].split(";");
                    var obj1 = obj[0].split("/");
                    console.log(obj1);
                    htmlCarga =htmlCarga+ '<tr id="tr'+obj1[5]+'"><td>'+obj[2]+'</td><td><a target="_blank" href="'+obj[0]+'">'+obj[1]+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+id+','+obj1[5]+',\''+valores[i]+'\',\''+obj[3]+'\');"><i class="material-icons">delete</i></div></td></tr>';
                    
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
                var unique_id= id;
                if($("#if"+id)[0].files[0]==undefined){
                    alert("Debe seleccionar un archivo");
                    return false;

                }
                var c_s3 = {};
                c_s3.titulo=titulo;
                c_s3.max_size = 5242880;
                c_s3.single_file_max_size = 5242800; // l: 16 -1 || b: 5 - 1
                c_s3.chunk_size = 5242880;
                c_s3.running_chunk_size = -1;
                c_s3.XMLHttpRequest_arr = [];
                c_s3.parts_info = [];
                c_s3.algorithm = '';
                c_s3.unique_id = id;
                c_s3.base_url = "https://subtrans.simple.digital.gob.cl/uploader/datos_s3/"+unique_id+"/"+idFormulario;
                c_s3.url = null;
                c_s3.token = $('meta[name="csrf-token"]').attr('content');
                c_s3.file_input = $('#if'+unique_id);
                c_s3.progress_file = $('#progress_obligatorio'+unique_id)[0];
                c_s3.but_stop = $('#but_stop_'+unique_id);

                c_s3.segments_count = -1;

                c_s3.send_start_time = -1;
                c_s3.send_end_time = -1;
                c_s3.file_load_start_time = -1;
                c_s3.file_load_end_time = -1;

                c_s3.buffer = null;
                c_s3.fileSize = -1;
                c_s3.count = -1;
                c_s3.offset = 0;
                c_s3.file = null;

                c_s3.stop_uploading = false;

                //c_s3.but_stop.prop('disabled', false);
                c_s3.file = c_s3.file_input[0].files[0];
                c_s3.filename = encodeURI(c_s3.file.name);
                c_s3.fileSize = c_s3.file.size;
                if(c_s3.fileSize >= c_s3.single_file_max_size){
                    // debe ser multiupload
                    c_s3.running_chunk_size = c_s3.chunk_size;
                    c_s3.url = c_s3.base_url + '/multi';
                    c_s3.segments_count = Math.ceil(c_s3.fileSize/ c_s3.running_chunk_size);
                    c_s3.running_chunk_size = c_s3.chunk_size;
                }else{
                    // debe ser single file
                    if(c_s3.fileSize > c_s3.max_size){
                        
                        //c_s3.but_stop.prop('disabled', true);
                        alert('El archivo supera el tamaño máximo permitido.');
                        c_s3.file = null;
                        return;
                    }
                    c_s3.running_chunk_size = c_s3.fileSize;
                    c_s3.url = c_s3.base_url + '/single';
                    c_s3.segments_count = 1;
                }

                c_s3.count = 0;
                c_s3.file_parts_status = {};
                c_s3.offset = 0;
                
                for(var i=0;i<c_s3.segments_count;i++){
                    c_s3.file_parts_status[i] = 0;
                }

                /*
                c_s3.but_stop.on('click', function(){
                    console.log('Se quiere detener la carga de archivo ' + unique_id);
                    c_s3.stop_uploading = true;
                    while(c_s3.XMLHttpRequest_arr.length){
                        var xhr = c_s3.XMLHttpRequest_arr.pop();
                        xhr.abort();
                    }
                });
                */

                var selectAux = document.getElementById("select"+id);
                
                
                if(selectAux!=null && $("#select"+id).html()==""){
                    alert("No hay documentos pendientes");
                    return false;
                }
                $("#bt"+id).attr("disabled","disabled");
                $("#bt"+id).val("Subiendo documento..");
                readBlock(c_s3,1);
                
                
            
            });



            $("#btop"+id).on("click",function(){

                
                var unique_id= id;
                if($("#ifop"+id)[0].files[0]==undefined){
                    alert("Debe seleccionar un archivo");
                    return false;

                }
                var c_s3 = {};
                c_s3.titulo=titulo;
                c_s3.max_size = 5242880;
                c_s3.single_file_max_size = 5242800; // l: 16 -1 || b: 5 - 1
                c_s3.chunk_size = 5242880;
                c_s3.running_chunk_size = -1;
                c_s3.XMLHttpRequest_arr = [];
                c_s3.parts_info = [];
                c_s3.algorithm = '';
                c_s3.unique_id = id;
                c_s3.base_url = window.location.origin+"/uploader/datos_s3/"+unique_id+"/"+idFormulario;
                c_s3.url = null;
                c_s3.token = $('meta[name="csrf-token"]').attr('content');
                c_s3.file_input = $('#ifop'+unique_id);
                c_s3.progress_file = $('#progress_opcional'+unique_id)[0];
                c_s3.but_stop = $('#but_stop_'+unique_id);

                c_s3.segments_count = -1;

                c_s3.send_start_time = -1;
                c_s3.send_end_time = -1;
                c_s3.file_load_start_time = -1;
                c_s3.file_load_end_time = -1;

                c_s3.buffer = null;
                c_s3.fileSize = -1;
                c_s3.count = -1;
                c_s3.offset = 0;
                c_s3.file = null;

                c_s3.stop_uploading = false;

                //c_s3.but_stop.prop('disabled', false);
                c_s3.file = c_s3.file_input[0].files[0];
                c_s3.filename = encodeURI(c_s3.file.name);
                c_s3.fileSize = c_s3.file.size;
                if(c_s3.fileSize >= c_s3.single_file_max_size){
                    // debe ser multiupload
                    c_s3.running_chunk_size = c_s3.chunk_size;
                    c_s3.url = c_s3.base_url + '/multi';
                    c_s3.segments_count = Math.ceil(c_s3.fileSize/ c_s3.running_chunk_size);
                    c_s3.running_chunk_size = c_s3.chunk_size;
                }else{
                    // debe ser single file
                    if(c_s3.fileSize > c_s3.max_size){
                        
                        //c_s3.but_stop.prop('disabled', true);
                        alert('El archivo supera el tamaño máximo permitido.');
                        c_s3.file = null;
                        return;
                    }
                    c_s3.running_chunk_size = c_s3.fileSize;
                    c_s3.url = c_s3.base_url + '/single';
                    c_s3.segments_count = 1;
                }

                c_s3.count = 0;
                c_s3.file_parts_status = {};
                c_s3.offset = 0;
                
                for(var i=0;i<c_s3.segments_count;i++){
                    c_s3.file_parts_status[i] = 0;
                }

                /*
                c_s3.but_stop.on('click', function(){
                    console.log('Se quiere detener la carga de archivo ' + unique_id);
                    c_s3.stop_uploading = true;
                    while(c_s3.XMLHttpRequest_arr.length){
                        var xhr = c_s3.XMLHttpRequest_arr.pop();
                        xhr.abort();
                    }
                });
                */

                var selectAux = document.getElementById("selectOpcional"+id);
                
                
                if(selectAux!=null && $("#selectOpcional"+id).html()==""){
                    alert("No hay documentos pendientes");
                    return false;
                }
                $("#btop"+id).attr("disabled","disabled");
                $("#btop"+id).val("Subiendo documento..");
                readBlock(c_s3,2);
                
            });







        
    }


    if(estado==1){
        id = input.id;
        var padre = $("#"+id).parent();

        if(titulo!="" && titulo!=undefined){
            var divTitulo = '<div class="campo control-group" style="display:block">';
            divTitulo +='<h4 style="float:right" class="campo">'+titulo+'</h4>'
            divTitulo += '<br><p></p><hr style="border-width:1,5px;"><p></p>'
            divTitulo += '</div>';
            padre.html(divTitulo+padre.html());
        }

        
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




function readBlock(c_s3,obop) {
    var r = new FileReader();
    var blob = c_s3.file.slice(c_s3.offset, c_s3.running_chunk_size + c_s3.offset);
    
    r.onload = onLoadHandler(c_s3,obop);
    r.readAsArrayBuffer(blob);
}

function onLoadHandler(c_s3,obop){
    return function(evt){
        if( evt.target.error != null){
            console.error('Ocurrio un error ', evt.target.error);
            return;
        }
        if(c_s3.stop_uploading){
            console.log('Deteniendo ! ' + c_s3.unique_id);
            return;
        }
        c_s3.offset += evt.target.result.byteLength;
        
        c_s3.count++;
        send_chunk(evt.target.result, c_s3,obop);
    }
}

function send_chunk(chunk, c_s3,obop) {
    var part_number = c_s3.count;
    var url = c_s3.url + '/' + part_number + '/' + c_s3.segments_count;
    var xhr = new XMLHttpRequest();
    c_s3.XMLHttpRequest_arr.push(xhr);

    var chunk = new Uint8Array(chunk);
    // el contador empieza en 1
    
    c_s3.progress_file.value=(c_s3.count - 1) / c_s3.segments_count;    

    xhr.addEventListener("progress", function(c_s3, chunk_size){
        return function(evt){
            // evt.loaded , evt.total;
        }
    }(c_s3, chunk.byteLength));

    xhr.addEventListener('load', function(c_s3, part_number, xhr){
        return function (evt) {
            try{
                var xhr_response = JSON.parse( xhr.response );
            }catch(e){
                console.error(e);
                alert('Error al cargar el archivo.');
                return;
            }
            if(! xhr_response.success) {
                c_s3.file_parts_status[part_number] = -3;
                console.error('Error al enviar', evt);
                var pos = c_s3.XMLHttpRequest_arr.indexOf(this);
                if(pos >= 0){
                    c_s3.XMLHttpRequest_arr.splice(pos, 1);
                }
                alert("Ocurrió un error al cargar el archivo.");
                return;
            }
            c_s3.file_parts_status[part_number] = 1;
            

            c_s3.parts_info[xhr_response.part_number -1 ] = {
                'hash': xhr_response.hash, 
                'algorithm': xhr_response.algorithm
            }
            
            if(c_s3.count < c_s3.segments_count){
                readBlock(c_s3,obop);
            }else if(xhr_response.hasOwnProperty('success')){
                // fin de enviar el archivo completo :-D



                
                if(xhr_response.success){
                    c_s3.progress_file.value=c_s3.progress_file.getAttribute('max');
                    if(obop==1){

                        var nombre = c_s3.file.name;
                        var tipoArchivo = c_s3.file.type;
                        

                        var selectAux = document.getElementById("select"+c_s3.unique_id);
                        
                        if(selectAux!=null){

                            var valorSelect = selectAux.value;
                            var textoSelect = $("#select"+c_s3.unique_id+" option[value='"+valorSelect+"']").text();

                            if(xhr.readyState==4 && xhr.status==200){
                                
                                var json = JSON.parse(xhr.responseText);
                                var urlArchivo = window.location.origin+xhr_response.URL;
                                var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";1;"+tipoArchivo+";"+c_s3.titulo;
                                console.log(data)
                                var htmlAux = $("#table"+c_s3.unique_id+" tbody").html();
                                var htmlAux = htmlAux+ '<tr id="tr'+json.hash+'"><td>'+valorSelect+'</td><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+c_s3.unique_id+',\''+json.hash+'\',\''+data+'\',\''+textoSelect+'\');"><i class="material-icons">delete</i></div></td></tr>';
                                $("#table"+c_s3.unique_id+" tbody").html(htmlAux);
                                $("#select"+c_s3.unique_id+" option[value='"+valorSelect+"']")[0].remove();
                                var htmlSelec = $("#select"+c_s3.unique_id).html();
                                
                                if(htmlSelec==""){
                                    
                                    $("#select"+c_s3.unique_id).attr("style","display:none");
                                    $("#divSelect"+c_s3.unique_id).attr("style","display:none");
                                }
                                $("#"+c_s3.unique_id).val($("#"+c_s3.unique_id).val()+"|"+data);
                                
                                $("#bt"+c_s3.unique_id).removeAttr("disabled");
                                $("#bt"+c_s3.unique_id).val("Subir documento");
                            }else{
                                if(xhr.readyState==4 && xhr.status!=200){
                                    $("#bt"+c_s3.unique_id).removeAttr("disabled");
                                    $("#bt"+c_s3.unique_id).val("Subir documento");
                                    alert("Error al subir documento");
                                }
                            }

                        }else{
                                
                                if(xhr.readyState==4 && xhr.status==200){
                                    var json = JSON.parse(xhr.responseText);
                                    var urlArchivo = window.location.origin+xhr_response.URL+"no funca";
                                    var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;1;"+tipoArchivo+";"+c_s3.titulo;
                                    console.log(data)
                                    var htmlAux = $("#table"+c_s3.unique_id+" tbody").html();
                                    var htmlAux = htmlAux+ '<tr id="tr'+json.hash+'"><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td>No aplica</td><td><a class="btn btn-danger" style="color:white;" onclick="deleteTr('+c_s3.unique_id+',\''+json.hash+'\',\''+data+'\');">X</a></td></tr>';
                                    $("#table"+c_s3.unique_id+" tbody").html(htmlAux);

                                    $("#"+c_s3.unique_id).val($("#"+c_s3.unique_id).val()+"|"+data);
                                    
                                    $("#bt"+c_s3.unique_id).removeAttr("disabled");
                                    $("#bt"+c_s3.unique_id).val("Subir documento");
                                }
                            
                        }
                    }

                    if(obop==2){

                        
                        var nombre = c_s3.file.name;
                        var tipoArchivo =  c_s3.file.type;

                        var selectAux = document.getElementById("selectOpcional"+c_s3.unique_id);

                        if(selectAux!=null){

                            var valorSelect = selectAux.value;
                            var textoSelect = $("#selectOpcional"+c_s3.unique_id+" option[value='"+valorSelect+"']").text();
                            
                            if(xhr.readyState==4 && xhr.status==200){
                                
                                var json = JSON.parse(xhr.responseText);
                                var urlArchivo = window.location.origin+xhr_response.URL;
                                var data = ""+urlArchivo+";"+nombre+";"+valorSelect+";"+textoSelect+";2;"+tipoArchivo+";"+c_s3.titulo;
                                console.log(data)
                                var htmlAux = $("#table"+c_s3.unique_id+" tbody").html();
                                var htmlAux = htmlAux+ '<tr id="tr'+json.hash+'"><td>'+valorSelect+'</td><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td><div class="btn btn-outline-primary btn-sm" onclick="deleteTr('+c_s3.unique_id+',\''+json.hash+'\',\''+data+'\',\''+textoSelect+'\');"><i class="material-icons">delete</i></div></td></tr>';
                                $("#table"+c_s3.unique_id+" tbody").html(htmlAux);
                                $("#selectOpcional"+c_s3.unique_id+" option[value='"+valorSelect+"']")[0].remove();
                                var htmlSelec = $("#selectOpcional"+c_s3.unique_id).html();
                                
                                if(htmlSelec==""){
                                    
                                    $("#selectOpcional"+c_s3.unique_id).attr("style","display:none");
                                    $("#divSelectOpcional"+c_s3.unique_id).attr("style","display:none");
                                }

                                $("#"+c_s3.unique_id).val($("#"+c_s3.unique_id).val()+"|"+data);
                                
                                $("#btop"+c_s3.unique_id).removeAttr("disabled");
                                $("#btop"+c_s3.unique_id).val("Subir documento");
                            }else{
                                if(xhr.readyState==4 && xhr.status!=200){
                                    $("#btop"+c_s3.unique_id).removeAttr("disabled");
                                    $("#btop"+c_s3.unique_id).val("Subir documento");
                                    alert("Error al subir documento");
                                }
                            }
                            

                        
                        }else{
                                
                            if(xhr.readyState==4 && xhr.status==200){
                                var json = JSON.parse(xhr.responseText);
                                var urlArchivo = window.location.origin+xhr_response.URL;
                                var data = ""+urlArchivo+";"+nombre+";No aplica;No aplica;2;"+tipoArchivo+";"+c_s3.titulo;
                                console.log(data)
                                var htmlAux = $("#table"+c_s3.unique_id+" tbody").html();
                                var htmlAux = htmlAux+ '<tr id="tr'+json.hash+'"><td><a target="_blank" href="'+urlArchivo+'">'+nombre+'</a></td><td>No aplica</td><td><a class="btn btn-danger" style="color:white;" onclick="deleteTr('+c_s3.unique_id+',\''+json.hash+'\',\''+data+'\');">X</a></td></tr>';
                                $("#table"+c_s3.unique_id+" tbody").html(htmlAux);

                                $("#"+c_s3.unique_id).val($("#"+c_s3.unique_id).val()+"|"+data);
                                
                                $("#btop"+c_s3.unique_id).removeAttr("disabled");
                                $("#btop"+c_s3.unique_id).val("Subir documento");
                            }
                            
                        }






                    }

                }else{
                    alert(xhr_response.error);
                }








            }
            var pos = c_s3.XMLHttpRequest_arr.indexOf(this);
            if(pos >= 0){
                c_s3.XMLHttpRequest_arr.splice(pos, 1);
            }
        }
    }(c_s3, part_number, xhr));

    xhr.addEventListener("error", function(evt){
        c_s3.file_parts_status[part_number] = -1;
        console.error('Error al enviar', evt);
        var pos = c_s3.XMLHttpRequest_arr.indexOf(this);
        if(pos >= 0){
            c_s3.XMLHttpRequest_arr.splice(pos, 1);
        }
    });
    xhr.addEventListener("abort", function(evt){
        c_s3.file_parts_status[part_number] = -2;
        console.error('Abortado al enviar', evt)
        var pos = c_s3.XMLHttpRequest_arr.indexOf(this);
        if(pos >= 0){
            c_s3.XMLHttpRequest_arr.splice(pos, 1);
        }
    });
    xhr.open("POST", url, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', c_s3.token);
    xhr.setRequestHeader('filename', c_s3.filename);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.send(chunk);
}








