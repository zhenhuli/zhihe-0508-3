const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

function findFreePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findFreePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function main() {
  console.log('🔍 正在查找空闲端口...');
  
  const serverPort = await findFreePort(3001);
  console.log(`✅ 后端端口: ${serverPort}`);
  
  const clientPort = await findFreePort(serverPort + 1);
  console.log(`✅ 前端端口: ${clientPort}`);
  
  console.log('\n🚀 启动会员订阅管理系统...');
  console.log(`   后端: http://localhost:${serverPort}`);
  console.log(`   前端: http://localhost:${clientPort}`);
  console.log('');
  
  const serverEnv = { ...process.env, PORT: serverPort.toString() };
  const clientEnv = { 
    ...process.env, 
    PORT: clientPort.toString(), 
    API_PORT: serverPort.toString(),
    NEXT_PUBLIC_API_PORT: serverPort.toString()
  };
  
  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'server'),
    env: serverEnv,
    stdio: 'pipe'
  });
  
  const clientProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    env: clientEnv,
    stdio: 'pipe'
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`[SERVER] ${data.toString().trim()}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`[SERVER] ${data.toString().trim()}`);
  });
  
  clientProcess.stdout.on('data', (data) => {
    console.log(`[CLIENT] ${data.toString().trim()}`);
  });
  
  clientProcess.stderr.on('data', (data) => {
    console.error(`[CLIENT] ${data.toString().trim()}`);
  });
  
  const cleanup = () => {
    console.log('\n🛑 正在停止服务...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ 后端服务退出，代码: ${code}`);
      clientProcess.kill();
      process.exit(code);
    }
  });
  
  clientProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ 前端服务退出，代码: ${code}`);
      serverProcess.kill();
      process.exit(code);
    }
  });
}

main().catch((err) => {
  console.error('❌ 启动失败:', err);
  process.exit(1);
});
