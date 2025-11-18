import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Endpoint to get DID API keys (public versions to validate on frontend)
router.get('/api/did-keys', async (req: Request, res: Response) => {
  try {
    // Send safe versions of the keys - only enough to validate they exist
    // Never expose full API keys to client
    res.json({
      agentId: process.env.DID_AGENT_ID || null,
      apiKey: process.env.DID_API_KEY ? true : null
    });
  } catch (error) {
    console.error('Error fetching DID keys:', error);
    res.status(500).json({ error: 'Failed to retrieve DID keys' });
  }
});

// Endpoint to create a new talk with the DID agent
router.post('/api/did-agent/talk', async (req: Request, res: Response) => {
  try {
    const { text, presenter_id = 'kgn-KqCZSo' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Get API key from environment
    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DID API key is not configured' });
    }
    
    // Create talk using D-ID API
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: "text",
          input: text,
          provider: {
            type: "microsoft",
            voice_id: "en-US-ChristopherNeural",
            voice_config: {
              style: "Calm"
            }
          }
        },
        config: {
          fluent: true,
          pad_audio: 0,
          stitch: true,
        },
        presenter_id,
        driver_id: "mdo-gpt",
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('D-ID API error:', errorData);
      return res.status(response.status).json({ 
        error: errorData.message || 'Error communicating with D-ID API'
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error creating talk:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create talk'
    });
  }
});

// Endpoint to check the status of a talk
router.get('/api/did-agent/talk/:id', async (req: Request, res: Response) => {
  try {
    const talkId = req.params.id;
    
    // Get API key from environment
    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DID API key is not configured' });
    }
    
    // Check talk status
    const response = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('D-ID API error:', errorData);
      return res.status(response.status).json({ 
        error: errorData.message || 'Error communicating with D-ID API'
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error checking talk status:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to check talk status'
    });
  }
});

export default router;