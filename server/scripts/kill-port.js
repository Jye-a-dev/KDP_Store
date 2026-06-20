const { execSync } = require('child_process');

const port = process.argv[2] || 3000;

try {
  if (process.platform === 'win32') {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1];
        if (parseInt(pid) > 0) {
          pids.add(pid);
        }
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`[Kill-Port] Đã tắt process PID ${pid} trên port ${port}`);
      } catch (err) {
        // Ignore
      }
    }
  } else {
    try {
      execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`[Kill-Port] Đã tắt processes trên port ${port}`);
    } catch (err) {
      // Ignore
    }
  }
} catch (error) {
  // Ignore
}
