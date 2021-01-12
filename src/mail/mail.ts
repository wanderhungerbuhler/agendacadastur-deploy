import nodemailer from 'nodemailer';

import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import { google } from 'googleapis';

interface MailProps {
  name: string | string[];
  email: string | string[];
  cadastur: string | string[];
  date: string | string[];
  hour: string | string[];
}

export default async function Mail({ name, email, cadastur, date, hour }: MailProps) {

  const parsedDate = parseISO(String(date));

  const newDate = format(parsedDate, "'Dia' dd 'de' MMMM 'de' yyyy", { locale: pt });

  const OAuth2 = google.auth.OAuth2;

  const oAuth2Client = new OAuth2(process.env.EMAIL_CLIENT_ID, process.env.EMAIL_CLIENT_SECRET, process.env.EMAIL_REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      accessToken: String(accessToken),
    }
  });

  transporter.sendMail({
    from: `TurisRio - Cadastur <${process.env.EMAIL_USER}>`,
    to: `"${name}" <${email}>`,
    subject: 'TurisRio - Agendamento realizado com sucesso!',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
      <div style="max-width: 1000px; width: 100%;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto;">
          <h1 style="font-family: 'Poppins', sans-serif; background: #00457C;
            padding: 10px; color: #F0F0F5; letter-spacing: -2px; border-top-left-radius: 7px; border-top-right-radius: 7px;">
            <img src="https://drive.google.com/uc?export=view&id=1AOWJ9DkRFxgakGjhCwnbdm5FrVGP4PVY" width="150" height="50" style="margin:0 auto; display: block;" /><br />
            Olá, ${name}
          </h1>

          <div style="padding: 0 10px;">
            <p style="font-size: 15px; font-family: 'Poppins', sans-serif; color: #383838;">
              Seu agendamento para <b>Retirada de Carteira</b> foi realizado com sucesso!
            </p>

            <p style="font-size: 15px; font-family: 'Poppins', sans-serif; color: #383838;">
              Este e-mail, é o comprovante do seu agendamento para o atendimento escolhido
              em nosso portal de serviços.
            </p>

            <p style="font-size: 15px; font-family: 'Poppins', sans-serif; color: #383838;">
              Abaixo, está a confirmação detalhada do seu agendamento.
            </p>

            <div style="margin: 0 auto;">
              <img
                width="590"
                height="290"
                src="https://agendacadastur.vercel.app/api/agendamento?name=${name}&email=${email}&cadastur=${cadastur}&date=${date}&hour=${hour}"
              />
            </div>

            <div style="margin: 0 auto;">
              <h2 style="color:#00457C; font-weight: 900; text-align:center;">${newDate} às ${hour}<h2>
            </div>

            <p style="font-size: 12px; text-align: center; font-family: 'Poppins', sans-serif; color: #383838;">
              *Em caso de dúvidas, pedimos que entre em contato através dos números:
            </p>
            <p style="font-size: 12px; text-align: center; font-family: 'Poppins', sans-serif; color: #383838;">
              <b>(21) 3367-6324</b> | <b>(21) 96621-3364</b> | <b>(21) 96621-5685</b> | <b>(21) 99958-7101</b>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  }).then(result => console.log('Email sent...', result))
  .catch(error => {
    console.log(error.message);
  });


}
