import AnalizadorVisitor from "./generated/AnalizadorVisitor.js";

export default class VisitorImpl extends AnalizadorVisitor {

    visitPrograma(ctx) {

        for (const instruccion of ctx.instruccion()) {
            this.visit(instruccion);
        }

        return null;
    }

    visitInstruccion(ctx) {
        return this.visit(ctx.repeticion());
    }

    visitRepeticion(ctx) {

        let condicion = false;

        do {

            for (const sentencia of ctx.sentencia()) {

                const resultado =
                    this.visit(sentencia);

                if (resultado === "SALIR") {
                    return;
                }
            }

            condicion =
                this.visit(ctx.condicion());

        } while (!condicion);

        return null;
    }

    visitSentencia(ctx) {

        if (ctx.terminar()) {
            return this.visit(ctx.terminar());
        }

        for (const salida of ctx.salida()) {
            this.visit(salida);
        }

        return null;
    }

    visitSalida(ctx) {

        const texto =
            ctx.CADENA()
               .getText()
               .slice(1, -1);

        console.log(texto);

        return null;
    }

    visitTerminar(ctx) {
        return "SALIR";
    }

    visitCondicion(ctx) {

        return ctx.getText() === "verdadero";
    }
}