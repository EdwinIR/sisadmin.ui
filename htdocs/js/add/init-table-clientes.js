	var botones = false;
	var box_edit;
	var search = "";
	var $table;
	var ocupado = false;
	
	function operateFormatter(value, row, index) {
        return [
            '<a class="edit ml10" href="javascript:void(0)" title="Editar registro">',
                '<i class="glyphicon glyphicon-edit"></i>',
            '</a>        &nbsp;',
            '<a class="remove" href="javascript:void(0)" title="Eliminar registro">',
                '<i class="glyphicon glyphicon-trash"></i>',
            '</a>',
        ].join('');
    }

    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
        	if (!ocupado){
        		ocupado = true;
        		loadEditWindow('clientes/editar_clientes/'+row.id, row.id);	
        	}
            
        },
        'click .remove': function (e, value, row, index) {
        	if (!ocupado){
        		ocupado = true;
        		loaDeleteWindow('clientes/eliminar_clientes/'+row.id);	
        	}
        }
    };


	// url: /examples/bootstrap_table/data?offset=0&limit=10&search=test
    function queryParams(params) {
    	//console.log(params);
    	if (botones){
    		//params.pageNumber = 1;
    		params.searchText = search;
    		//params.sortName = "";	
    		//params.sortOrder = "asc";
    		//search = "";
    	}

    	return {
            limit: params.pageSize,
            offset: params.pageSize * (params.pageNumber - 1),
            search: params.searchText,
            name: params.sortName,
            order: params.sortOrder
        };	
        
    }


    $(function() {

    	$table = $('#list_table').bootstrapTable();
    
        $('.barra').click(function() {
			botones = true;
			search = "";
			if($(this).text() != "Todas"){
				if($(this).text() != "0-9"){
					search = $(this).text()+"???";	
				}else{
					search = "#???";
				}
			}

			$(".form-control").val("");
        	$table.bootstrapTable($(this).data('method'));
        	$(this).addClass('active');
    		$(this).siblings().removeClass('active');
        });

		$( ".form-control" ).keyup(function() {
			botones = false;
			$('.barra').removeClass('active');
		});


		$(document).on('change', '#tipo_documento', function(){
			switch($('#tipo_documento').val()){
				case '1' :$('#customer_id').attr('maxlength', '8'); 
						break;
				case '6' :$('#customer_id').attr('maxlength', '11'); 
						break;
				default : $('#customer_id').attr('maxlength', '15');
						break;
			}
		});

    });	


function loadAddWindow(url){
	console.info('>>> url : ',url);
	console.info('>>> ocupado : ',ocupado);
	//var msg = $('#alta').load(url);
	
	if (ocupado){
		return false;		
	}
	
	ocupado = true;
	$.ajax({
		type: 'GET',
		url: url, // change as needed
		beforeSend: function( xhr ) {
	    	//$("body").addClass("modal-open");
		},
		success: function(data) {
			box_edit = bootbox.dialog({
				message: data,
				title: "Agregar Usuario",
				onEscape: function() {
					ocupado = false;
				}
			});

			//$("#unit_code").selectpicker('refresh');
			$('#customer_id').attr('maxlength', '15');
		},
		error: function(xhr, textStatus, thrownError) {
			bootbox.dialog({
				message: xhr.responseText+".",
				title: "Error: "+xhr.status,
				onEscape: function() {
					ocupado = false;
				},
				buttons: {
					success: {
						label: "Aceptar",
						className: "btn-info",
						callback: function() {
							ocupado = false;
						}
					} 
				}
			});
		}
	});
}


function loadEditWindow(url, id){
	//var msg = $('#alta').load(url);
	$.ajax({
		type: 'GET',
		url: url, // change as needed
		success: function(data) {
			//var formulario = data.replace("guardar_clientes","guardar_clientes/"+id);
			var formulario = data.replace("guardar_clientes_noadd","guardar_clientes_noadd/"+id);
			
			box_edit = bootbox.dialog({
				message: formulario,
				title: "Edición de adquiriente/usuario",
				onEscape: function() {
					ocupado = false;
				}
			});
			
			switch($('#tipo_documento').val()){
				case '1' : $('#customer_id').attr('maxlength', '8'); 
						break;
				case '6' : $('#customer_id').attr('maxlength', '11'); 
						break;
				default : $('#customer_id').attr('maxlength', '15');
						break;
			}
			
		},
		error: function(xhr, textStatus, thrownError) {
			bootbox.dialog({
				message: xhr.responseText+".",
				title: "Error: "+xhr.status,
				onEscape: function() {
					ocupado = false;
				},
				buttons: {
					success: {
						label: "Aceptar",
						className: "btn-info",
						callback: function() {
							ocupado = false;
						}
					} 
				}
			});
		}
	});
}

	function ValidarRUC() { 
		return true;
        var regEx =  /\d{11}/;
        var ruc = new String( $("#customer_id").val() );
        if(regEx.test(ruc)) {
            var factores = new String("5432765432");
            var ultimoIndex = ruc.length - 1;
            var sumaTotal = 0, residuo = 0;
            var ultimoDigitoRUC = 0, ultimoDigitoCalc = 0;
            
            for(var i=0;i<ultimoIndex;i++)
            {
                sumaTotal += (parseInt(ruc.charAt(i)) * parseInt(factores.charAt(i)));
            }
            residuo = sumaTotal%11;
            
            ultimoDigitoCalc = (residuo == 10) ? 0: ((residuo == 11) ? 1:(11 - residuo)%10);
            ultimoDigitoRUC = parseInt(ruc.charAt(ultimoIndex));
            
            if(ultimoDigitoRUC == ultimoDigitoCalc) {
                return true;
            } else {
            	bootbox.dialog({
					message: "El RUC ingresado no es válido.",
					title: "Error en el Número del documento de identificación.",
					onEscape: function() {
						ocupado = false;
					},
					buttons: {
						success: {
							label: "Aceptar",
							className: "btn-success",
							callback: function() {
								ocupado = false;	
							}
						} 
					}
				});
                return false;
            }
        } else {
        	bootbox.dialog({
				message: "El RUC no es válido, debe constar de 11 caracteres numéricos.",
				title: "Error en el Número del documento de identificación.",
				onEscape: function() {
					ocupado = false;
				},
				buttons: {
					success: {
						label: "Aceptar",
						className: "btn-success",
						callback: function() {
							ocupado = false;	
						}
					} 
				}
			});

            $("#customer_id").focus();
            return false;
        }
    }


    function ValidarLength(){
        var texto = $("#customer_id").val();
        var tamanio = texto ? texto.length: 0;
        var mensaje = "<p class=" + ((tamanio != 11) ? "'invalid'" : "'valid'") + ">" + tamanio + " caracteres</p>";
        document.getElementById("contenedorMensaje").innerHTML = mensaje;
    }


	function save(url){

		if ($("#tipo_documento").val() == '6'){
			if (! ValidarRUC()){
				return false;
			}
		}


	    var postData = $("#clientes_form").serializeArray();
		postData.shift();

	    $.ajax({
			type: 'POST',
			url: url, // change as needed
			data : postData,
			success: function(data) {
				if (data.trim() != "OK"){
					$("#error_section").html(data);
					$(".alert").css("background-color","#fcc");
					$(".bootbox").effect( 'shake', '', 500, '');
				} else{
					box_edit.modal("hide");

					bootbox.dialog({
						message: "El registro se guardo correctamente.",
						title: "Registro Guardado",
						onEscape: function() {
							ocupado = false;
						},
						buttons: {
							success: {
								label: "Aceptar",
								className: "btn-success",
								callback: function() {
									ocupado = false;
									$table.bootstrapTable('refresh');	
								}
							} 
						}
					});
				}
			},
			error: function(xhr, textStatus, thrownError) {
				bootbox.dialog({
					message: xhr.responseText+".",
					title: "Error: "+xhr.status,
					onEscape: function() {
						ocupado = false;
					},
					buttons: {
						success: {
							label: "Aceptar",
							className: "btn-alert",
							callback: function() {
								ocupado = false;
							}
						} 
					}
				});
			}
		});	
}


function loaDeleteWindow(url){
	 box_edit = bootbox.dialog({
		message: "¿Esta seguro que desea eliminar este registro?",
		title: "Eliminar registro",
		onEscape: function() {
			ocupado = false;
		},
		buttons: {
			success: {
				label: "Aceptar",
				className: "btn-success",
				callback: function() {
					$.ajax({
						type: 'POST',
						url: url, 
						success: function(data) {
							if (data.trim() != "OK"){
								$("#error_section").html(data);
								$(".alert").css("background-color","#fcc");
								$(".bootbox").effect( 'shake', '', 500, '');
							} else{
								box_edit.modal("hide");
			
								bootbox.dialog({
									message: "El registro se eliminó correctamente.",
									title: "Registro Eliminado",
									onEscape: function() {
										ocupado = false;
									},
									buttons: {
										success: {
											label: "Aceptar",
											className: "btn-success",
											callback: function() {
												close_modal();
												$table.bootstrapTable('refresh');
											}
										} 
									}
								});
							}
						},
						error: function(xhr, textStatus, thrownError) {
							bootbox.dialog({
								message: xhr.responseText+".",
								title: "Error: "+xhr.status,
								onEscape: function() {
									ocupado = false;
								},
								buttons: {
									success: {
										label: "Aceptar",
										className: "btn-alert",
										callback: function() {
											ocupado = false;
										}
									} 
								}
							});
						}
					});	
			}
				
			} ,
		    danger: {
		      label: "Cancelar",
		      className: "btn-danger",
		      callback: function() {
		        	close_modal();
		      }
		    }
		}
	});
}

function close_modal(){
	ocupado = false;
	box_edit.modal("hide");
}
