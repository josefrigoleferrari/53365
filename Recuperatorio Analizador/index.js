import antlr4, {
    CharStreams,
    CommonTokenStream
} from "antlr4";

import fs from "fs";

import AnalizadorLexer from "./generated/AnalizadorLexer.js";
import AnalizadorParser from "./generated/AnalizadorParser.js";

import VisitorImpl from "./VisitorImpl.js";
import TranslatorImpl from "./TranslatorImpl.js";

class CustomErrorListener extends antlr4.error.ErrorListener {

    syntaxError(
        recognizer,
        offendingSymbol,
        line,
        column,
        msg
    ) {

        console.error(
            `Error sintáctico en línea ${line}, columna ${column}: ${msg}`
        );
    }
}

function main() {

    let input;

    try {

        input = fs.readFileSync(
            "input.txt",
            "utf8"
        );

    } catch (error) {

        console.error(
            "No se pudo leer input.txt"
        );

        return;
    }

    const chars =
        CharStreams.fromString(input);

    const lexer =
        new AnalizadorLexer(chars);

    const tokenStream =
        new CommonTokenStream(lexer);

    tokenStream.fill();

    console.log("\n=== TABLA DE TOKENS ===\n");

  tokenStream.tokens.forEach(token => {

    if (token.type !== antlr4.Token.EOF) {

        const nombre =
            AnalizadorLexer.symbolicNames[token.type]
            || `TOKEN_${token.type}`;

        console.log(
            `${token.text} -> ${nombre}`
        );
    }
});

    const parser =
        new AnalizadorParser(tokenStream);

    parser.removeErrorListeners();

    parser.addErrorListener(
        new CustomErrorListener()
    );

    parser.buildParseTrees = true;

    const tree = parser.programa();

if (parser.syntaxErrorsCount > 0) {
    console.log("La entrada contiene errores.");
    return;
}

console.log("\n=== ÁRBOL DE DERIVACIÓN ===\n");
console.log(tree.toStringTree(parser.ruleNames));

    console.log(
        "\nEntrada válida."
    );

    console.log(
        "\n=== ÁRBOL SINTÁCTICO ===\n"
    );

    console.log(
        tree.toStringTree(
            parser.ruleNames
        )
    );

    console.log(
        "\n=== TRADUCCIÓN A JAVASCRIPT ===\n"
    );

    const translator =
        new TranslatorImpl();

    const codigoJS =
        translator.visit(tree);

    console.log(codigoJS);

    console.log(
        "\n=== INTERPRETACIÓN ===\n"
    );

    const interpreter =
        new VisitorImpl();

    interpreter.visit(tree);
}

main();