export const generateEventTicketEmailTemplate = ({
    attendeeName,
    eventTitle,
    eventDate,
    eventLocation,
    ticketId,
  }: {
    attendeeName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    ticketId: string;
  }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your Event Ticket</title>
      <style>
        @media only screen and (max-width: 620px) {
          table.body h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          table.body p,
          table.body ul,
          table.body ol,
          table.body td,
          table.body span,
          table.body a {
            font-size: 16px !important;
          }
          table.body .wrapper,
          table.body .article {
            padding: 10px !important;
          }
          table.body .content {
            padding: 0 !important;
          }
          table.body .container {
            padding: 0 !important;
            width: 100% !important;
          }
          table.body .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
        }
      </style>
    </head>
    <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; width: 100%; background-color: #f6f6f6;">
        <tr>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
          <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;">
            <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main" style="border-collapse: separate; width: 100%; background: #ffffff; border-radius: 3px;">
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                          <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #4F46E5; font-size: 32px; font-weight: bold; margin: 0; margin-bottom: 10px;">Your Event Ticket</h1>
                            <p style="color: #666; font-size: 16px; margin: 0;">Thank you for registering!</p>
                          </div>
                          
                          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <h2 style="color: #333; font-size: 20px; margin: 0 0 15px 0;">Event Details</h2>
                            <p style="margin: 0 0 10px 0;"><strong>Event:</strong> ${eventTitle}</p>
                            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${eventDate}</p>
                            <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${eventLocation}</p>
                            <p style="margin: 0; font-family: monospace; color: #4F46E5;"><strong>Ticket ID:</strong> ${ticketId}</p>
                          </div>
  
                          <div style="text-align: center;">
                            <p style="margin-bottom: 20px; color: #666;">Your ticket is attached to this email. You can also download it from your confirmation page.</p>
                            <a href="${process.env.NEXT_PUBLIC_URL}/events/confirmation?ticket=${ticketId}" style="background-color: #4F46E5; border-radius: 5px; box-sizing: border-box; color: #ffffff; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize;">View Confirmation</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- END MAIN CONTENT AREA -->
              </table>
  
              <!-- START FOOTER -->
              <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                  <tr>
                    <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;">
                      <span>This email was sent by Kitwek Victoria. Please do not reply to this email.</span>
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
            </div>
          </td>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
  `;