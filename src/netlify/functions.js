import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT_EMAIL = 'juanmigarcia3@hotmail.es';

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
      }),
      {
        status: 405,
      },
    );
  }

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
        }),
        {
          status: 400,
        },
      );
    }

    const { error } = await resend.emails.send({
      from: 'Open Cells App <onboarding@resend.dev>',

      to: [RECIPIENT_EMAIL],

      subject: `New notification from ${name}`,

      html: `
        <h2>New notification</h2>

        <p>
          <strong>Name:</strong>
          ${name}
        </p>

        <p>
          <strong>Email:</strong>
          ${email}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>
          ${message}
        </p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,

        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({
        error: 'Email could not be sent',
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
