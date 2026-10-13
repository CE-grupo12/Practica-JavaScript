print("******************************************************************");
print("************** FIRMA DE LOS NUEVOS DATOS DEL USUARIO *************");
print("******************************************************************");

card = new Card();
//En vez de sacar y volver a meter la tarjeta, hacemos reset con ella ya dentro
card.reset(Card.RESET_COLD);
print("RESET CARD exitoso");

SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
card.plainApdu(SELECT_CARD);
print("Lectura de tarjeta: " + card.SW.toString(HEX)");

READ_DATA = new ByteString("FF B0 00 20 B0", HEX);
data = card.plainApdu(READ_DATA);
print("Resultado de lectura de datos: " + card.SW.toString(HEX));

// CALCULO DEL HASH DE LOS DATOS
var crypto = new Crypto();
var dataHash = crypto.digest(Crypto.SHA_256, data);

// CIFRADO DEL HASH CON AES256
var myKey = new ByteString("00112233445566778899AABBCCDDEEFFFFEEDDCCBBAA99887766554433221100", HEX);
var myAESKey = new Key();
myAESKey.setComponent(Key.AES, myKey);

var myAESCypher = new Crypto("AES_CBC");
var signature = myAESCypher.encrypt(myAESKey, Crypto.AES_CBC, dataHash);

// ESCRITURA DE FIRMA DESDE E0h
PRESENT_PSC = new ByteString("FF 20 00 00 03 FF FF FF", HEX);
card.plainApdu(PRESENT_PSC);
print("Resultado ingreso PIN: " + card.SW.toString(HEX));

WRITE_SIGNATURE_CARD = new ByteString("FF D0 00 E0 20", HEX);

// No podemos concatenarlo como en ALTA_USER porque "signature" es ya un ByteString binario
var fullAPDU = WRITE_SIGNATURE_CARD.concat(signature);
card.plainApdu(apduCompleta);
print("Resultado escritura firma: " + card.SW.toString(HEX));

//No se si hacer esto o en el resto de scripts hacer card.reset manteniendo la tarjeta dentro y ya
//card.close();
//print("Card closed");

