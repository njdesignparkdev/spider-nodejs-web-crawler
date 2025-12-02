# Spider Scraping API Documentation

A high-performance web scraping API built with Express.js and spider-rs, featuring API key authentication, rate limiting, and concurrent request handling.

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Error Codes](#error-codes)
- [Usage Examples](#usage-examples)

## Authentication

All requests to the `/scrap` endpoint require API key authentication.

### API Key Header
Include your API key in the `X-API-Key` header:

```
X-API-Key: your-api-key-here
```

### Setup
1. Copy `.env.example` to `.env`
2. Set your `API_KEY` in the `.env` file
3. Start the server with `node simple-api.js`

## Endpoints

### POST /scrap
Scrape a website and extract structured data.

**Authentication:** Required (API Key)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "X-API-Key": "your-api-key-here"
}
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "mode": "single",
  "maxPages": 100,
  "extractImagesFlag": true,
  "extractLinksFlag": true,
  "detectTechnologiesFlag": true
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | Yes | - | The URL to scrape |
| `mode` | string | No | `"single"` | Scraping mode: `"single"` or `"multipage"` |
| `maxPages` | number | No | `500` | Maximum number of pages to crawl (multipage mode) |
| `extractImagesFlag` | boolean | No | `true` | Extract images from pages |
| `extractLinksFlag` | boolean | No | `true` | Extract links from pages |
| `extractMeta` | boolean | No | `true` | Extract meta tags |
| `detectTechnologiesFlag` | boolean | No | `true` | Detect technologies used |
| `detectCMSFlag` | boolean | No | `true` | Detect CMS platform |

### GET /health
Check API health status.

**Authentication:** Not required

**Response:**
```json
{
  "status": "OK",
  "message": "Comprehensive scraper API is running",
  "timestamp": "2024-12-02T05:30:00.000Z",
  "uptime": 3600
}
```

### GET /status
Get server status and metrics.

**Authentication:** Not required

**Response:**
```json
{
  "status": "OK",
  "activeRequests": 5,
  "maxConcurrentRequests": 50,
  "queuedRequests": 0,
  "memoryUsage": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 87654321,
    "external": 1234567
  },
  "uptime": 3600,
  "timestamp": "2024-12-02T05:30:00.000Z"
}
```

## Request Format

### Single Page Scraping
```json
{
  "url": "https://example.com",
  "mode": "single"
}
```

### Multi-Page Scraping
```json
{
  "url": "https://example.com",
  "mode": "multipage",
  "maxPages": 50
}
```

## Response Format

### Success Response
```json
{
  "url": "https://example.com",
  "mode": "single",
  "summary": {
    "totalPages": 1,
    "totalLinks": 25,
    "totalImages": 10,
    "totalMetaTags": 8,
    "totalFavicons": 2,
    "technologiesFound": 3,
    "technologies": ["React", "Webpack", "Google Analytics"],
    "favicons": [
      {
        "href": "https://example.com/favicon.ico",
        "sizes": "32x32",
        "type": "image/x-icon",
        "rel": "icon"
      }
    ],
    "cmsDetected": false
  },
  "pages": [
    {
      "url": "https://example.com",
      "statusCode": 200,
      "title": "Example Domain",
      "html": "<!DOCTYPE html>...",
      "content": "Example Domain This domain is for use in...",
      "links": [...],
      "images": [...],
      "metaTags": [...],
      "technologies": [...],
      "favicons": [...],
      "timestamp": "2024-12-02T05:30:00.000Z"
    }
  ],
  "extractedData": {
    "links": ["https://example.com/page1", "https://example.com/page2"],
    "images": ["https://example.com/image1.jpg"],
    "metaTags": [...],
    "technologies": ["React", "Webpack"],
    "favicons": [...],
    "cms": {
      "type": "unknown",
      "version": null,
      "plugins": []
    }
  },
  "performance": {
    "startTime": "2024-12-02T05:30:00.000Z",
    "endTime": "2024-12-02T05:30:05.000Z",
    "totalTime": 5000,
    "pagesPerSecond": 0.2
  },
  "responseTime": 5000,
  "timestamp": "2024-12-02T05:30:05.000Z"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_API_KEY` | 401 | API key not provided in X-API-Key header |
| `INVALID_API_KEY` | 401 | API key is invalid |
| `MISSING_API_KEY_CONFIG` | 500 | Server not configured with API_KEY |
| `MISSING_URL` | 400 | URL parameter is required |
| `INVALID_URL` | 400 | URL format is invalid |
| `INVALID_MODE` | 400 | Mode must be "single" or "multipage" |
| `SCRAPING_ERROR` | 500 | General scraping error occurred |

### Error Response Format
```json
{
  "error": "Authentication required",
  "message": "API key is required. Please provide X-API-Key header",
  "code": "MISSING_API_KEY",
  "timestamp": "2024-12-02T05:30:00.000Z"
}
```

## Usage Examples

### cURL

#### Single Page Scraping
```bash
curl -X POST http://localhost:3001/scrap \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "url": "https://example.com",
    "mode": "single"
  }'
```

#### Multi-Page Scraping
```bash
curl -X POST http://localhost:3001/scrap \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "url": "https://example.com",
    "mode": "multipage",
    "maxPages": 50,
    "extractImagesFlag": true,
    "extractLinksFlag": true,
    "detectTechnologiesFlag": true
  }'
```

### JavaScript (Node.js with Axios)

```javascript
const axios = require('axios');

async function scrapWebsite(url, options = {}) {
  try {
    const response = await axios.post('http://localhost:3001/scrap', {
      url: url,
      mode: options.mode || 'single',
      maxPages: options.maxPages || 100,
      extractImagesFlag: options.extractImages !== false,
      extractLinksFlag: options.extractLinks !== false,
      detectTechnologiesFlag: options.detectTechnologies !== false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// Usage
scrapWebsite('https://example.com', { mode: 'single' })
  .then(data => {
    console.log('Scraped data:', data);
  })
  .catch(error => {
    console.error('Scraping failed:', error);
  });
```

### JavaScript (Fetch API)

```javascript
async function scrapWebsite(url, apiKey) {
  const response = await fetch('http://localhost:3001/scrap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      url: url,
      mode: 'single',
      extractImagesFlag: true,
      extractLinksFlag: true,
      detectTechnologiesFlag: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Usage
scrapWebsite('https://example.com', 'your-api-key-here')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Python (requests)

```python
import requests
import os

def scrape_website(url, api_key, mode='single', max_pages=100):
    endpoint = 'http://localhost:3001/scrap'
    
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': api_key
    }
    
    payload = {
        'url': url,
        'mode': mode,
        'maxPages': max_pages,
        'extractImagesFlag': True,
        'extractLinksFlag': True,
        'detectTechnologiesFlag': True
    }
    
    response = requests.post(endpoint, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        error = response.json()
        raise Exception(f"Error {response.status_code}: {error.get('message')}")

# Usage
try:
    api_key = os.getenv('API_KEY')
    data = scrape_website('https://example.com', api_key)
    print(data)
except Exception as e:
    print(f"Scraping failed: {e}")
```

### Integration with Next.js API Route

If you're using this scraping service from a Next.js application (as mentioned in your setup), your Next.js `/api/scrape` route should forward the API key:

```typescript
// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, mode, maxPages, extractImagesFlag, extractLinksFlag, detectTechnologiesFlag } = body;

    // Forward request to scraping service with API key
    const response = await fetch(`${process.env.SCRAPER_API_BASE_URL}/scrap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SCRAPER_API_KEY || ''
      },
      body: JSON.stringify({
        url,
        mode,
        maxPages,
        extractImagesFlag,
        extractLinksFlag,
        detectTechnologiesFlag
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed', message: error.message },
      { status: 500 }
    );
  }
}
```

## Rate Limiting

The API includes rate limiting to prevent abuse:
- **300 requests per minute** per IP address
- **50 concurrent requests** maximum
- Requests exceeding the limit will receive a 429 error

## Best Practices

1. **Store API Keys Securely**: Never commit API keys to version control
2. **Use Environment Variables**: Store the API key in `.env` file
3. **Handle Errors Gracefully**: Always check for error responses
4. **Respect Rate Limits**: Implement exponential backoff for retries
5. **Monitor Usage**: Use the `/status` endpoint to monitor server health
6. **Choose Appropriate Mode**: Use `single` mode for faster single-page scraping

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
