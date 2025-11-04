db.hermesconfigs.insertOne({
  spreedSheetConsumer: {
    executionIntervalTimeInMinutes: 1,
    fileHasTitles: true,
    maxNumberOfRowsToRetreive: 10,
    columnsConfiguration: [{ "propertyName": "firstName", "columnNumber": 1, "dataType": "string" }, { "propertyName": "lastName", "columnNumber": 2, "dataType": "string" }, { "propertyName": "debtAmount", "columnNumber": 3, "dataType": "number" }, { "propertyName": "mobilePhoneNumber", "columnNumber": 4, "dataType": "string" }, { "propertyName": "emailAddress", "columnNumber": 5, "dataType": "string" }],
  },
  batchProcessor: {
    allowedSenders: ["email", "sms", "whatsapp"]
  },
  smsSender: {
		messageTemplate: "Hola {{firstName}}, Recibí tu info por Facebook. Mas de $40,000 en deudas? Llama 786-550-4525",
		phoneNumberFrom: "19495367539"
	},
  emailSender: {
		emailTemplate: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/></head><body style="font-family: Verdana"><div style="margin: 5%; padding: 2%; color: #161616; background-color: #f1f1f1"><div style="width: 100%; background: #f1f1f1 !important"><img src="{logoImage}" style="width: 75px; height: 75px; text-align: left; margin-bottom: 0"/></div><div style="width: 100%; text-align: center; display: block; color: #474747"><h1>¡Podemos Ayudarte con tu Deuda!</h1><hr style="background-color: #3a3a3a;margin-bottom: 20px !important;height: 0.5px;"/></div><div><h4 style="color: #161616">Hola {firstName}!</h4><p style="color: #161616">Hemos Recibido su consulta para opciones financieras por un monto mayor a {debtAmount}. Ahorra muchísimo cada mes!</p><p style="color: #161616">Llamanos AHORA al <a href="tel:+17865504525">+17865504525</a> para conocer tu caso y como podemos ayudarte.</p><p style="color: #161616">Nuestra calificación es A+.</p><br /><p style="color: #161616">Saludos Cordiales</p><br /></div></div></body></html>',
		emailTemplateLogo: 'https://vsm-pltf.s3.amazonaws.com/logo2.png',
		emailFromAddress: 'dreamteam@vidasoftmedia.com',
		emailSubject: 'Podemos ayudarte con tu deuda'
	}
});