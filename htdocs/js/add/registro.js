$(function() {
	
	$("body").delegate("#city_name", "change", function() { 
		var id_departamento = $(this).val();
		$.ajax({
			type: 'GET',
			url : "loadProvincias/"+id_departamento,
			success: function(data) {
				$("#prov_sel").html(data);
				$( "#country_subentity" ).trigger( "change" );
			},
			error: function(xhr, textStatus, thrownError) {
				bootbox.dialog({
					message: xhr.responseText+".",
					title: "Error: "+xhr.status,
					buttons: {
						success: {
							label: "Aceptar",
							className: "btn-info",
							callback: function() {
								
							}
						} 
					}
				});
			}
		});
	    
	});
	
	$("body").delegate("#country_subentity", "change", function() {
		var id_provincia = $(this).val();
		$.ajax({
			type: 'GET',
			url : "loadDistrito/"+id_provincia,
			success: function(data) {
				$("#dist_sel").html(data);
				$( "#district" ).trigger( "change" );
			},
			error: function(xhr, textStatus, thrownError) {
				bootbox.dialog({
					message: xhr.responseText+".",
					title: "Error: "+xhr.status,
					buttons: {
						success: {
							label: "Aceptar",
							className: "btn-info",
							callback: function() {
								
							}
						} 
					}
				});
			}
		});
	    
	});
	
	$("body").delegate("#district", "change", function() {
		 $("#ubigeo").val($(this).val());
	});
	
	$("#enviar_registro").click(function(event) {
		event.preventDefault();
		var distribuidor = $("#distribuidor_id").val();
		
		if ( (distribuidor.trim() == '0') || (distribuidor.trim() == '') ){
			bootbox.dialog({
				message: "La clave del distribuidor no es vÃ¡lida, Â¿desea continuar con su registro? ",
				title: "Nuevo registro",
				buttons: {
					success: {
						label: "Aceptar",
						className: "btn-info",
						callback: function() {
							$("#nuevo_registro").submit();
						}
					},
					danger: {
						label: "Cancelar",
						className: "btn-info",
						callback: function() {
							
						}
					} 
				}
			});
		}else{
			$("#nuevo_registro").submit();
		}
		
		

	});
	
	
	$("#validar_distribuidor").click(function() {
		$("#val_distr").removeClass();
		$(".distribuidor_data").hide('slow');
		$("#dist_label").text('');

		var distribuidor = $("#distribuidor_clave").val();

		$.ajax({
			type: 'POST',
			url: "registro/verifica_distribuidor", // change as needed
			data : {clave: distribuidor},
			success: function(data) {

				if (data.id_distribuidor != undefined ){
					$("#val_distr").addClass("glyphicon glyphicon-ok");
					$("#val_distr").css({'color': 'green'});
					$("#dist_label").text(data.nombre);					
					$(".distribuidor_data").show('slow');
					$("#distribuidor_id").val(data.id_distribuidor);
				}else{
					$("#val_distr").addClass("glyphicon glyphicon-remove");
					$("#val_distr").css({'color': 'red'});
					$("#distribuidor_id").val('0');
				}

			},
			error: function(xhr, textStatus, thrownError) {
				bootbox.dialog({
					message: "OcurriÃ³ un error en la comunicaciÃ³n, favor de intentarlo mÃ¡s tarde. "+ thrownError,
					title: "ValidaciÃ³n de distribuidor: "+xhr.status,
					onEscape: function() {
						
					},
					buttons: {
						success: {
							label: "Aceptar",
							className: "btn-alert",
							callback: function() {
								
							}
						} 
					}
				});
			}
		});	
	});
});	
