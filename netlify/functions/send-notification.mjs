import { Resend } from 'resend';

const RECIPIENT_EMAIL = 'jaegeresp@gmail.com';

const ALLOWED_ORIGINS = [
  'https://juan451.github.io',
  'https://open-cells-task-manager-app.netlify.app',
  'http://localhost:5173',
  'http://localhost:8888',
];

function getCorsHeaders(origin) {
  const headers = {
    'Content-Type': 'application/json',

    'Access-Control-Allow-Headers': 'Content-Type',

    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

export default async (request) => {
  const origin = request.headers.get('origin');

  const corsHeaders = getCorsHeaders(origin);

  /*
   * GitHub Pages y Netlify tienen orígenes diferentes.
   *
   * Antes del POST, el navegador realiza una petición
   * OPTIONS para comprobar la política CORS.
   */
  if (request.method === 'OPTIONS') {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({
          error: 'Origin not allowed',
        }),
        {
          status: 403,
          headers: corsHeaders,
        },
      );
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  /*
   * La función solamente admite POST.
   */
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: corsHeaders,
      },
    );
  }

  /*
   * Si el POST viene de otro dominio, lo rechazamos.
   *
   * Las peticiones sin Origin se permiten porque pueden
   * proceder de herramientas server-side.
   */
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(
      JSON.stringify({
        error: 'Origin not allowed',
      }),
      {
        status: 403,
        headers: corsHeaders,
      },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'Email service is not configured',
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
        }),
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const result = await resend.emails.send({
      from: 'Open Cells App <onboarding@resend.dev>',

      /*
       * Este destinatario se controla exclusivamente
       * desde backend.
       *
       * El usuario no puede modificarlo desde React.
       */
      to: [RECIPIENT_EMAIL],

      subject: `Suggestion from ${name}`,

      text: `
New suggestion

Name: ${name}
Contact email: ${email}

Message:
${message}
      `,
    });

    if (result.error) {
      console.error('Resend error:', result.error);

      return new Response(
        JSON.stringify({
          error: result.error.message,
        }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: result.data?.id,
      }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error('Error sending notification:', error);

    return new Response(
      JSON.stringify({
        error: 'The suggestion could not be sent.',
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
