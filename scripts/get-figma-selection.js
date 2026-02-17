#!/usr/bin/env node

/**
 * Script to get design context from Figma Desktop MCP server
 * Usage: node scripts/get-figma-selection.js
 */

import http from 'http';

const MCP_URL = 'http://127.0.0.1:3845/mcp';

async function makeRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now()
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3845,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.result);
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function getDesignContext() {
  try {
    console.log('🎨 Connecting to Figma Desktop MCP server...\n');

    const result = await makeRequest('tools/call', {
      name: 'get_design_context',
      arguments: {}
    });

    console.log('✅ Design Context Retrieved:\n');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('- Figma Desktop is open');
    console.error('- Dev Mode is enabled (Shift+D)');
    console.error('- MCP server is enabled in Dev Mode');
    console.error('- A component is selected in Figma');
    process.exit(1);
  }
}

getDesignContext();
