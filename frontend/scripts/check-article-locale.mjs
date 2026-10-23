import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(existsSync);

if (!browserCandidates.length) {
  throw new Error('Chrome or Edge is required for the article locale check.');
}

const profile = mkdtempSync(join(tmpdir(), 'orbit-notes-locale-'));
const port = 9333;
const baseUrl = process.env.VITE_TEST_URL ?? 'http://localhost:5173';
const browser = spawn(browserCandidates[0], [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const waitFor = async (read, timeout = 15_000) => {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await read();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await delay(150);
  }
  throw lastError ?? new Error('Timed out waiting for the page.');
};

const connect = async () => {
  const targets = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (!response.ok) return null;
    const list = await response.json();
    return list.find((target) => target.type === 'page') ?? null;
  });

  const socket = new WebSocket(targets.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  return {
    close: () => socket.close(),
    send: (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    }),
  };
};

let client;
try {
  client = await connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  await client.send('Page.navigate', { url: `${baseUrl}/` });
  await delay(1_500);
  await client.send('Runtime.evaluate', {
    expression: "localStorage.setItem('orbit-notes-locale', 'zh')",
  });

  await client.send('Page.navigate', {
    url: `${baseUrl}/articles/virtual-task-list`,
  });

  const expectedTitle = '从 20fps 到 50fps：重构 300+ 条任务列表';
  const readPage = async () => {
    const result = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('.dialog-hero h1')?.textContent?.trim() ?? '';
        const body = document.querySelector('.reader-content')?.innerText?.trim() ?? '';
        return title && body ? {
          lang: document.documentElement.lang,
          title,
          summary: document.querySelector('.dialog-hero__excerpt')?.textContent?.trim() ?? '',
          body,
          headings: [...document.querySelectorAll('.reader-content h2')].map((heading) => heading.textContent?.trim()),
        } : null;
      })()`,
      returnByValue: true,
    });
    return result.result.value;
  };

  const chinesePage = await waitFor(readPage);
  if (chinesePage.title !== expectedTitle) throw new Error('The article title is not Chinese before switching the site locale.');
  await client.send('Runtime.evaluate', {
    expression: "document.querySelector('.language-button')?.click()",
  });
  const page = await waitFor(async () => {
    const current = await readPage();
    return current?.lang === 'en' ? current : null;
  });

  const failures = [];
  if (page.lang !== 'en') failures.push(`document language is "${page.lang}"`);
  if (page.title !== expectedTitle) failures.push(`article title changed to "${page.title}"`);
  if (!/[\u3400-\u9fff]/u.test(page.summary)) failures.push('Chinese article summary was translated or removed');
  if (!/[\u3400-\u9fff]/u.test(page.body)) failures.push('Chinese article body was translated or removed');
  if (!page.headings.some((heading) => /[\u3400-\u9fff]/u.test(heading))) failures.push('Chinese article headings are missing');

  await client.send('Page.navigate', { url: `${baseUrl}/articles` });
  const cardTitles = await waitFor(async () => {
    const result = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const titles = [...document.querySelectorAll('.note-card h3')].map((title) => title.textContent?.trim()).filter(Boolean);
        return titles.length ? titles : null;
      })()`,
      returnByValue: true,
    });
    return result.result.value;
  });
  if (!cardTitles.includes(expectedTitle)) failures.push('Chinese article card title is missing after switching the site locale');

  if (failures.length) {
    throw new Error(`Article locale check failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('Article content remains Chinese when the site interface locale changes.');
} finally {
  client?.close();
  if (browser.exitCode === null) {
    const exited = new Promise((resolve) => browser.once('exit', resolve));
    browser.kill();
    await Promise.race([exited, delay(3_000)]);
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      rmSync(profile, { recursive: true, force: true });
      break;
    } catch (error) {
      if (attempt === 4) console.warn(`Could not remove temporary browser profile: ${profile}`);
      else await delay(300);
    }
  }
}
