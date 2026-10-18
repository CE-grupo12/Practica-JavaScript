load("db.js");

print("**********************************************************");
print("************************* PAGAR **************************");
print("**********************************************************");

// configurables:
var descuento = true;               // si es true gasta todo el descuento acumulado posible
var idProfesor = "P002";            // Profesor seleccionado (ver db.js)
var idAsignatura = 3;               // Asignatura de la que se paga la clase (ver db.js)

var PORC_ACUMULA = 0.05;            // % de lo pagado que se acumula como descuento
var MAX_DESCUENTO = 99.99;

var X = new ByteString("                ", ASCII);

// Consulta del profesor y la asignatura seleccionados:
var profesor = null;
for (var i = 0; i < profesores.length; i++) {
	if (profesores[i].id == idProfesor) profesor = profesores[i];
}
if (!profesor) throw new Error("No existe el profesor " + idProfesor);

var asignatura = null;
for (var i = 0; i < asignaturas.length; i++) {
	if (asignaturas[i].id == idAsignatura) asignatura = asignaturas[i];
}
if (!asignatura) throw new Error("No existe la asignatura " + idAsignatura);

if (profesor.asignaturas.indexOf(idAsignatura) == -1) throw new Error(profesor.nombre + " no imparte " + asignatura.nombre);

var precio = profesor.precio;

// Conexion y lectura:
card = new Card();
card.reset(Card.RESET_COLD);
print("RESET CARD exitoso");

SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
card.plainApdu(SELECT_CARD);
print("Lectura de tarjeta: " + card.SW.toString(HEX));

READ_CARD_SALDO     = new ByteString("FF B0 00 A6 0A", HEX);   // SALDO:     -> A6h, 10 bytes
READ_CARD_DESCUENTO = new ByteString("FF B0 00 BA 06", HEX);   // DESCUENTO: -> BAh,  6 bytes

var saldo = parseFloat(card.plainApdu(READ_CARD_SALDO).toString(ASCII)) || 0;
print("Resultado lectura saldo: " + card.SW.toString(HEX));

var descAcumulado = parseFloat(card.plainApdu(READ_CARD_DESCUENTO).toString(ASCII)) || 0;
print("Resultado lectura descuento: " + card.SW.toString(HEX));

print("\nSaldo: " + saldo.toFixed(2) + "$ | Descuento acumulado: " + descAcumulado.toFixed(2) + "$");

// Calculo del pago:
var descuentoAplicado = descuento ? Math.min(descAcumulado, precio) : 0;
var aPagar = Math.round((precio - descuentoAplicado) * 100) / 100;

if (aPagar > saldo) {
	print("\nSaldo insuficiente: necesita " + aPagar.toFixed(2) + "$ y tiene " + saldo.toFixed(2) + "$");
	throw new Error("Saldo insuficiente");
}

var nuevoSaldo = Math.round((saldo - aPagar) * 100) / 100;
// El descuento se queda en el tope si lo supera (no bloquea el pago)
var nuevoDescuento = Math.min(MAX_DESCUENTO, Math.round((descAcumulado - descuentoAplicado + aPagar * PORC_ACUMULA) * 100) / 100);

// Campos de ancho fijo: valor + "$" + espacios hasta completar (10 bytes saldo, 6 descuento)
var bsSaldo = new ByteString(nuevoSaldo.toFixed(2) + "$", ASCII).concat(X).left(10);
var bsDesc = new ByteString(nuevoDescuento.toFixed(2) + "$", ASCII).concat(X).left(6);

// Escritura:
PRESENT_PSC = new ByteString("FF 20 00 00 03 FF FF FF", HEX);
card.plainApdu(PRESENT_PSC);
print("\nResultado ingreso PIN: " + card.SW.toString(HEX));

WRITE_CARD_SALDO     = new ByteString("FF D0 00 A6 0A", HEX);
WRITE_CARD_DESCUENTO = new ByteString("FF D0 00 BA 06", HEX);

card.plainApdu(WRITE_CARD_SALDO.concat(bsSaldo));
print("Resultado escritura saldo: " + card.SW.toString(HEX));

card.plainApdu(WRITE_CARD_DESCUENTO.concat(bsDesc));
print("Resultado escritura descuento: " + card.SW.toString(HEX));

print("\n------------------- TICKET -------------------");
print("Profesor:             " + profesor.nombre + " (" + profesor.id + ")");
print("Asignatura:           " + asignatura.nombre + " (" + asignatura.id + ")");
print("Precio:               " + precio.toFixed(2) + "$");
print("Descuento aplicado:   " + descuentoAplicado.toFixed(2) + "$" + (descuento ? "" : " (reservado)"));
print("Pagado con saldo:     " + aPagar.toFixed(2) + "$");
print("Saldo restante:       " + nuevoSaldo.toFixed(2) + "$");
print("Descuento acumulado:  " + nuevoDescuento.toFixed(2) + "$");
print("----------------------------------------------");