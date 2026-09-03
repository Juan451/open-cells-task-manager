import { Resend } from 'resend';

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
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  if (!apiKey) {
    console.error('RESEND_API_KEY is missing');

    return new Response(
      JSON.stringify({
        error: 'RESEND_API_KEY is not configured',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  if (!recipientEmail) {
    console.error('RECIPIENT_EMAIL is missing');

    return new Response(
      JSON.stringify({
        error: 'RECIPIENT_EMAIL is not configured',
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

      to: [recipientEmail],

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

    console.log('Resend result:', result);

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
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({
        error: error.message,
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
