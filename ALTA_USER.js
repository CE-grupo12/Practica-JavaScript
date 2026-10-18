print("******************************************************");
print("************** DAR DE ALTA NUEVO USUARIO *************");
print("******************************************************");

card = new Card();
// En vez de sacar y volver a meter la tarjeta, hacemos reset con ella ya dentro
card.reset(Card.RESET_COLD);
print("RESET CARD exitoso");

SELECT_CARD = new ByteString("FF A4 00 00 01 06", HEX);
card.plainApdu(SELECT_CARD);
print("Lectura de tarjeta: " + card.SW.toString(HEX));

PRESENT_PSC = new ByteString("FF 20 00 00 03 FF FF FF", HEX);
card.plainApdu(PRESENT_PSC);
print("Resultado ingreso PIN: " + card.SW.toString(HEX));

// Obtención de fecha actual para campo fecha
var f = new Date();

var dia = f.getDate(); if(dia < 10){dia = "0".concat(dia)};
var mes = f.getMonth() + 1; anno = f.getFullYear(); if(mes < 10){mes = "0".concat(mes)};
var anno = f.getFullYear(); if(anno < 10){anno = "0".concat(anno)};

WRITE_CARD_20h = new ByteString("FF D0 00 20 10", HEX); DATA_20h = new ByteString(" DATOS  USUARIO ", ASCII);
WRITE_CARD_30h = new ByteString("FF D0 00 30 10", HEX); DATA_30h = new ByteString("---PERSONALES---", ASCII);
WRITE_CARD_40h = new ByteString("FF D0 00 40 10", HEX); DATA_40h = new ByteString("ID:211026       ", ASCII);
WRITE_CARD_50h = new ByteString("FF D0 00 50 10", HEX); DATA_50h = new ByteString("SERGIO          ", ASCII);
WRITE_CARD_60h = new ByteString("FF D0 00 60 10", HEX); DATA_60h = new ByteString("PASTOR          ", ASCII);
WRITE_CARD_70h = new ByteString("FF D0 00 70 10", HEX); DATA_70h = new ByteString("MESAS           ", ASCII);
WRITE_CARD_80h = new ByteString("FF D0 00 80 10", HEX); DATA_80h = new ByteString("DESDE:" + dia + "/" + mes + "/" + anno, ASCII);
WRITE_CARD_90h = new ByteString("FF D0 00 90 10", HEX); DATA_90h = new ByteString("----MONEDERO----", ASCII);
WRITE_CARD_A0h = new ByteString("FF D0 00 A0 10", HEX); DATA_A0h = new ByteString("SALDO:50$       ", ASCII); // Bono de bienvenida de 50$
WRITE_CARD_B0h = new ByteString("FF D0 00 B0 10", HEX); DATA_B0h = new ByteString("DESCUENTO:0$    ", ASCII);
// NO USADOS POR AHORA, MODIFICAR SI SE DECIDE AÑADIR MÁS DATOS
WRITE_CARD_C0h = new ByteString("FF D0 00 C0 10", HEX); DATA_C0h = new ByteString("                ", ASCII);

WRITE_CARD_D0h = new ByteString("FF D0 00 D0 10", HEX); DATA_D0h = new ByteString("-----FIRMA------", ASCII);

card.plainApdu(new ByteString(WRITE_CARD_20h + " " + DATA_20h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_30h + " " + DATA_30h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_40h + " " + DATA_40h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_50h + " " + DATA_50h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_60h + " " + DATA_60h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_70h + " " + DATA_70h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_80h + " " + DATA_80h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_90h + " " + DATA_90h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_A0h + " " + DATA_A0h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_B0h + " " + DATA_B0h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_C0h + " " + DATA_C0h, HEX));
card.plainApdu(new ByteString(WRITE_CARD_D0h + " " + DATA_D0h, HEX));

// Resultado del último WRITE_CARD, suponemos que el resto han ido bien

print(card.SW.toString(HEX) + ": Usuario registrado correctamente");

// No se si hacer esto o en el resto de scripts hacer card.reset manteniendo la tarjeta dentro y ya
// card.close();
// print("Card closed");