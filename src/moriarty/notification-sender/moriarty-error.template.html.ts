export const content = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  style="font-family: 'PT Sans', Helvetica;"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Contacto desde Sitio Web</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="margin: 0; padding: 0; background-color: #fff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="width: 100%; height: fit-content; background: #000;">
          <img
            alt=""
            src="https://absque-public-stuff.s3.amazonaws.com/udc-logo-transp-750x400.png"
            style="
              min-width: 15%;
              max-width: 22%;
              display: block;
              margin-left: auto;
              margin-right: auto;
            "
          />
        </td>
      </tr>

      <tr>
        <td style="width: 100%; height: fit-content;">
          <h1 style="text-align: center; font-size: 44px; margin-top: 4%;">
           Error en Moriarty 
          </h1>
        </td>
      </tr>

      <tr>
        <td>
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="70%"
            style="margin-left: 15%; margin-right: 15%;"
          >
            <tr>
              <td width="22%">
                <h5
                  style="
                    margin-top: 2%;
                    margin-bottom: 0.5%;
                    font-size: 20px;
                    color: #6e767e;
                  "
                >
                  Fecha:
                </h5>
              </td>
              <td width="78%">
                <p
                  style="
                    margin-top: 0.5%;
                    margin-bottom: 0.5%;
                    font-size: 28px;
                    text-align: left;
                    margin-right: 25%;
                    width: 100%;
                  "
                >
                  {{errorDate}}
                </p>
              </td>
            </tr>
            <tr>
              <td width="22%">
                <h5
                  style="
                    margin-top: 2%;
                    margin-bottom: 0.5%;
                    font-size: 20px;
                    color: #6e767e;
                  "
                >
                  Descripción:
                </h5>
              </td>
              <td width="78%">
                <p
                  style="
                    margin-top: 0.5%;
                    margin-bottom: 0.5%;
                    font-size: 28px;
                    text-align: left;
                    margin-right: 25%;
                    width: 100%;
                  "
                >
                  {{errorDescription}}
                </p>
              </td>
            </tr>
          </table>
          <hr
            style="
              border: none;
              background-color: #000;
              margin-top: 1%;
              margin-bottom: 20px !important;
              height: 0.5px;
            "
          />
        </td>
      </tr>
      <tr>
        <td width=" 100%">
          <div style="text-align: center;">
            <p class="mt-1 text-center text-lightgrey w-100 mb-0" style="margin-bottom: 0;color: #DFDFDF;">
              <small class="align-middle">Desarrollado por</small>
            </p>
            <a href="https://www.absquesoft.com/" target="_blank">
              <img class="img-fluid" src="https://absque-public-stuff.s3.amazonaws.com/absqueosft_logo_grey.png"
                style="width: 15.5rem !important;height:auto !important;" class="mt-0 mb-3" />
            </a>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
