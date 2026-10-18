print("**************************************************************************");
print("************** COMPROBACION DE DATOS LEGITIMOS MIRANDO FIRMA *************");
print("**************************************************************************");

card = new Card();
//En vez de sacar y volver a meter la tarjeta, hacemos reset con ella ya dentro
card.reset(Card.RESET_COLD);
print("RESET CARD exitoso");

SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
card.plainApdu(SELECT_CARD);
print("Lectura de tarjeta: " + card.SW.toString(HEX));

READ_CARD_DATA = new ByteString("FF B0 00 20 B0", HEX);
READ_CARD_SIGNATURE = new ByteString("FF B0 00 E0 20", HEX);

data = card.plainApdu(READ_CARD_DATA);
print("Resultado de lectura de datos: " + card.SW.toString(HEX));
signature = card.plainApdu(READ_CARD_SIGNATURE);
print("Resultado de lectura de firma: " + card.SW.toString(HEX));

// CALCULO DEL HASH DE LOS DATOS
var crypto = new Crypto();
var dataHash = crypto.digest(Crypto.SHA_256, data);

// Desencriptación de la firma
var myKey = new ByteString("00112233445566778899AABBCCDDEEFFFFEEDDCCBBAA99887766554433221100", HEX);
var myAESKey = new Key();
myAESKey.setComponent(Key.AES, myKey);

// AES-CBC necesita un IV de 16 bytes (tiene que ser el mismo que al firmar)
var IV = new ByteString("00000000000000000000000000000000", HEX);
hashSignature = crypto.decrypt(myAESKey, Crypto.AES_CBC, signature, IV);

// Comparación de datos con firma
if (dataHash.equals(hashSignature)) {
    print("\nInformación de la tarjeta legítima: No se han detectado modificaciones");
} else {
    print("\nTarjeta ilegalmente alterada: Se han detectado modificaciones anormales");
}

//No se si hacer esto o en el resto de scripts hacer card.reset manteniendo la tarjeta dentro y ya
//card.close();
//print("Card closed");