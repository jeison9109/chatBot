const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowSecundario = addKeyword(["2", "siguiente"]).addAnswer([
  "📄 Aquí tenemos el flujo secundario",
]);

const flujoMachineAlarm = addKeyword(["alarmar", "alarma", "alarm"]).addAnswer(
  ["Por favor seleccione el tipo de *alarma*: "],
  {
    buttons: [
      { body: "POC CERRADO" },
      { body: "MAQUINA NO ESTA EN EL POC" },
      { body: "MAQUINA TRASLADADA" },
      { body: "APAGADA EXHIBIDA" },
      { body: "APAGADA ALMACENADA" },
      { body: "NO PERMITEN INGRESO" },
    ],
  }
);

// const flujoMachineAlarm = addKeyword(["alarmar", "alarma"]).addAnswer(
//   "Alarmar por operacion? responda *Si*",
//   { capture: true },
//   async (ctx, { flowDynamic, endFlow }) => {
//     if (ctx.body != "Si") {
//       await flowDynamic([
//         {
//           body: [
//             "Alarmar maquina por localizacion?, ingrese la palabra *localizacion*",
//           ],
//         },
//       ]);
//       console.log("msj2", ctx.body);
//       return endFlow();
//     } else {
//     }
//   }
// );

const flowFormulario = addKeyword(["Hola", "ole", "buenas"])
  .addAnswer("🙌 Hola bienvenido a este *Chatbot*")
  .addAnswer(
    "👉*BMB* ingrese por favor el numero de maquina",
    { capture: true },
    async (ctx, { flowDynamic, endFlow }) => {
      await flowDynamic([
        {
          body: "BMB recibido",
        },
      ]);
      console.log("msj1", ctx.body);
      return endFlow();
    }
  )
  .addAnswer(
    "👉*POC* ingrese por favor el nombre del poc",
    { capture: true },
    async (ctx, { flowDynamic, endFlow }) => {
      await flowDynamic([
        {
          body: "POC recibido",
        },
      ]);
      console.log("msj2", ctx.body);
      return endFlow();
    }
  )
  .addAnswer("ingrese la palabra *alarmar*", { delay: 1500 }, null, [
    flujoMachineAlarm,
  ]);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowFormulario, flujoMachineAlarm]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
