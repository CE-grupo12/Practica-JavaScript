print("**********************************************************************");
print("************************* INGRESAR EN SALDO **************************");
print("**********************************************************************");

// Variables modificables para pruebas
var importe = 30.0;
var X = new ByteString("                ", ASCII);

card = new Card();
card.reset(Card.RESET_COLD);
print("RESET CARD exitoso");

SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
card.plainApdu(SELECT_CARD);
print("Lectura de tarjeta: " + card.SW.toString(HEX));

READ_CARD_SALDO = new ByteString("FF B0 00 A6 0A", HEX);   // SALDO:     -> A6h, 10 bytes

var saldo = parseFloat(card.plainApdu(READ_CARD_SALDO).toString(ASCII)) || 0;
print("Resultado lectura saldo: " + card.SW.toString(HEX));

var nuevoSaldo = Math.round((saldo + importe) * 100) / 100;

print("\nNuevo saldo: " + saldo.toFixed(2) + "$ --> " + nuevoSaldo.toFixed(2) + "$");

//Campos de ancho fijo: valor + "$" + espacios hasta completar (10 bytes saldo)
var bsSaldo = new ByteString(nuevoSaldo.toFixed(2) + "$", ASCII).concat(X).left(10);

PRESENT_PSC = new ByteString("FF 20 00 00 03 FF FF FF", HEX);
card.plainApdu(PRESENT_PSC);
print("\nResultado ingreso PIN: " + card.SW.toString(HEX));

WRITE_CARD_SALDO = new ByteString("FF D0 00 A6 0A", HEX);
card.plainApdu(WRITE_CARD_SALDO.concat(bsSaldo));
print("Resultado escritura saldo: " + card.SW.toString(HEX));
