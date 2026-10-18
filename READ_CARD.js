print("*********************************************");
print("************** LECTURA DE TARJETA DE USUARIO *************");
print("*********************************************");
print("Por favor, inserte la tarjeta\n");

var lectura = false;
var intentos = 0;

while(!lectura && intentos < 20) // Maximo 20 intentos hasta rendirse
{
	
	intentos++;
	
	try{
		var card = new Card();
		SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
		card.plainApdu(SELECT_CARD);
		lectura = true;
		print("Lectura de tarjeta: " + card.SW.toString(HEX));
		
		var READ_CARD_NOMBRE = new ByteString("FF B0 00 57 09", HEX);
		var READ_CARD_SALDO = new ByteString("FF B0 00 A6 0A", HEX);   // Estudiar como manejar cuando dinero es menor o mayor
		var READ_CARD_DESCUENTO = new ByteString("FF B0 00 BA 06", HEX);// que 100$ para no leer el padding. El inicio de lectura no cambia
		
		var response_nombre = card.plainApdu(READ_CARD_NOMBRE);
		var estado_nombre = card.SW.toString(HEX);
		
		var response_saldo = card.plainApdu(READ_CARD_SALDO);
		var estado_saldo = card.SW.toString(HEX);
		
		var response_descuento = card.plainApdu(READ_CARD_DESCUENTO);
		var estado_descuento = card.SW.toString(HEX);
		
		if (estado_nombre === estado_saldo && estado_saldo === estado_descuento) { // Todos son 90 00
			print("Lectura de datos exitosa: " + estado_descuento);
			print("\n\nBienvenido de vuelta: " + response_nombre.toString(ASCII));
			print("\nSu saldo actual es de: " + response_saldo.toString(ASCII));
			print("\nTiene un descuento acumulado de: " + response_descuento.toString(ASCII));
		} else {
			print("Ha ocurrido un error en alguna lectura: " + estado_nombre + " " + estado_saldo + " " + estado_descuento);
		}
	}
	catch(error){		
		
		if(intentos % 5 == 0 && intentos != 20){
			print("No se pudo leer la tarjeta, reintentando...");
		} else if(intentos == 20){
			print("Incapaz de leer tarjeta, compruebe que se introdujo correctamente y vuelva a intentarlo mas tarde");
		}
	
	}
}