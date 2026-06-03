grammar Analizador;

// ---------------- PARSER RULES ----------------

programa
    : instruccion+ EOF
    ;

instruccion
    : repeticion
    ;

repeticion
    : REPETIR LLAVE_IZQ sentencia* LLAVE_DER HASTA condicion PUNTOYCOMA
    ;

sentencia
    : salida+
    | terminar
    ;

salida
    : IMPRIMIR PAR_IZQ CADENA PAR_DER PUNTOYCOMA
    ;

terminar
    : SALIR PUNTOYCOMA
    ;

condicion
    : VERDADERO
    | FALSO
    ;

// ---------------- LEXER RULES ----------------

REPETIR     : 'repetir';
HASTA       : 'hasta';
IMPRIMIR    : 'imprimir';
SALIR       : 'salir';
VERDADERO   : 'verdadero';
FALSO       : 'falso';

LLAVE_IZQ   : '{';
LLAVE_DER   : '}';
PAR_IZQ     : '(';
PAR_DER     : ')';
PUNTOYCOMA  : ';';

CADENA
    : '"' (~["\r\n])* '"'
    ;

WS
    : [ \t\r\n]+ -> skip
    ;