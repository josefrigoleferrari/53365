import AnalizadorVisitor from "./generated/AnalizadorVisitor.js";

export default class TranslatorImpl extends AnalizadorVisitor {

    visitPrograma(ctx) {

        let codigo = "";

        for (const instruccion of ctx.instruccion()) {
            codigo += this.visit(instruccion);
        }

        return codigo;
    }

    visitInstruccion(ctx) {
        return this.visit(ctx.repeticion());
    }

    visitRepeticion(ctx) {

        let cuerpo = "";

        for (const sentencia of ctx.sentencia()) {
            cuerpo += this.visit(sentencia);
        }

        const condicion =
            this.visit(ctx.condicion());

        return `
do {
${cuerpo}
} while (!(${condicion}));
`;
    }

    visitSentencia(ctx) {

        if (ctx.terminar()) {
            return this.visit(ctx.terminar());
        }

        let codigo = "";

        for (const salida of ctx.salida()) {
            codigo += this.visit(salida);
        }

        return codigo;
    }

    visitSalida(ctx) {

        return `console.log(${ctx.CADENA().getText()});\n`;
    }

    visitTerminar(ctx) {

        return "// salir\n";
    }

    visitCondicion(ctx) {

        return ctx.getText() === "verdadero"
            ? "true"
            : "false";
    }
}