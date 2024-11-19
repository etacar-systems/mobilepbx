import { Request, Response, NextFunction } from "express";
import axios from "axios";

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v21.0';
const BUSINESS_MANAGER_ID = "414468124911774";
const ACCESS_TOKEN = "EAAaKy9XEVsMBO0h1ZAxl3vpgMD9I3RqDgnc7gpzEXgei3fRHCX8ZAKnOCGPFrPcNYQDR3YtFy9FbP1WF8prMufLolZAZBtdV5uhtZAtmlHcazXzZCSMcafHmZBbwz1UbIFtsptnkVnZBlCm41SRyyz0BzcHNDFqoUZAZCaEX9flWmIJfRZAejZCyUxl0pZAlDjZCURacGXhDp5MtbZBHZC6F5o9qBR7dBBJEo4zusz06o5cE7xPwCi0ZD";

export const whatsappLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { businessName, businessEmail } = req.body;

  try {
    const appResponse = await axios.post(
      `${FACEBOOK_GRAPH_API}/${BUSINESS_MANAGER_ID}/apps`,

      {
        name: businessName,
        primary_contact_email: businessEmail,
        app_type: 'MESSENGER_BOT',
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const appId = appResponse.data.id;

    await axios.post(
      `${FACEBOOK_GRAPH_API}/${appId}/whatsapp_business_api`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const numberResponse = await axios.get(
      `${FACEBOOK_GRAPH_API}/${appId}/phone_numbers`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const testNumber = numberResponse.data.data[0]?.display_phone_number;

    const tokenResponse = await axios.post(
      `${FACEBOOK_GRAPH_API}/${appId}/access_tokens`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const token = tokenResponse.data.access_token;

    res.json({
      status: 'App created successfully',
      appId,
      testNumber,
      token,
    });
  } catch (error:any) {
    console.error('Error creating WhatsApp app:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to create WhatsApp app',
      error: error.response?.data || error.message,
    });
  }
};
