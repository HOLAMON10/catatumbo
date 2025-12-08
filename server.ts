import app from './src/app';
import { CommonFunctions } from './src/common/common-functions';
import { PrintColorType } from './src/enums/print-color-type.enum';

const port = process.env.PORT || 8080;
//const port = 8080;
let listenServer = app.listen(port, (): void => {
	CommonFunctions.PrintConsoleColor(
		'catatumbo backend'.concat(' is listening on port ' + port.toString()),
		PrintColorType.yellow
	);
});

export { listenServer };
