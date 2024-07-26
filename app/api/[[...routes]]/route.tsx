/** @jsxImportSource frog/jsx */

import { Button, Frog, parseEther, TextInput } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { erc20Abi } from 'viem';
import { Box, Heading, Text, VStack, vars } from '../../ui';

const xocTokenAddress =
  '0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf' as `0x${string}`;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: 'Frog Frame',
  ui: { vars },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  return c.res({
    image: (
      <Box grow alignVertical="center" backgroundColor="purple500" padding="32">
        <VStack gap="4">
          <Heading size="48">Polygon Frame Tx</Heading>
          <Text size="32">send a tip to mel 😎</Text>
        </VStack>
      </Box>
    ),
    intents: [
      <TextInput placeholder="Value" />,
      <Button.Transaction target="/send-matic">Send MATIC</Button.Transaction>,
      <Button.Transaction target="/send-xoc">Send XOC</Button.Transaction>,
    ],
  });
});

app.transaction('/send-matic', (c) => {
  const inputText = c.inputText || '';
  return c.send({
    chainId: 'eip155:137',
    to: '0xF54f4815f62ccC360963329789d62d3497A121Ae',
    value: parseEther(inputText),
  });
});

app.transaction('/send-xoc', (c) => {
  const inputText = c.inputText || '';
  return c.contract({
    abi: erc20Abi,
    functionName: 'transfer',
    args: ['0xF54f4815f62ccC360963329789d62d3497A121Ae', parseEther(inputText)],
    chainId: 'eip155:137',
    to: xocTokenAddress,
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
