import { Resend } from 'resend';

const RECIPIENT_EMAIL = 'jaegeresp@gmail.com';

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const result = await resend.emails.send({
      from: 'Open Cells App <onboarding@resend.dev>',

      // El usuario NO puede modificar este destinatario.
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
          headers: {
            'Content-Type': 'application/json',
          },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};
