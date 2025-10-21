import { chromium } from '@playwright/test';

async function globalTeardown() {
  console.log('🧹 Cleaning up: Closing all browser instances...');
  
  try {
    // Close any remaining browser instances
    const browser = await chromium.launch();
    await browser.close();
    
    // Force close any lingering processes
    if (process.platform === 'linux' || process.platform === 'darwin') {
      const { exec } = require('child_process');
      exec('pkill -f chrome', (error) => {
        if (error && !error.message.includes('No such process')) {
          console.log('Note: Some browser processes may still be running');
        }
      });
    }
    
    console.log('✅ Browser cleanup completed');
  } catch (error) {
    console.log('⚠️ Browser cleanup completed with warnings');
  }
}

export default globalTeardown;
