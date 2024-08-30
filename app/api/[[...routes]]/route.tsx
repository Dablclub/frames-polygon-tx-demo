/** @jsxImportSource frog/jsx */

import { Button, Frog, parseEther } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { Box, Heading, Text, VStack, vars } from '../../ui';

const recipientAddress =
  '0x9e9Be4c2Fd64788cde3d6fb324C8Ea52822A2C2B' as `0x${string}`;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'Send MATIC and Love - Polygon PoS',
  ui: { vars },
});

app.frame('/', (c) => {
  return c.res({
    action: '/select',
    image: (
      <Box grow alignVertical="center" backgroundColor="purple500" padding="32">
        <VStack gap="4">
          <Heading size="48">Choose an Action</Heading>
          <Text size="32">Do you want to send Matic or Love?</Text>
        </VStack>
      </Box>
    ),
    intents: [
      <Button value="matic">Send Matic</Button>,
      <Button value="love">Send Love ❤️</Button>,
    ],
  });
});

app.frame('/select', (c) => {
  const { buttonValue } = c;

  if (buttonValue === 'matic') {
    return c.res({
      action: '/confirm-matic',
      image: (
        <Box grow alignVertical="center" backgroundColor="blue500" padding="32">
          <VStack gap="4">
            <Heading size="48">Confirm Matic Transaction</Heading>
            <Text size="32">Press the button to send Matic</Text>
          </VStack>
        </Box>
      ),
      intents: [
        <Button.Transaction target="/send-pos-mainnet">Confirm Send Matic</Button.Transaction>,
      ],
    });
  } else if (buttonValue === 'love') {
    return c.res({
      action: '/',
      image: (
        <Box grow alignVertical="center" backgroundColor="pink500" padding="32">
          <VStack gap="4">
            <Heading size="48">Love Sent ❤️</Heading>
            <Text size="32">Thank you for spreading the love!</Text>
          </VStack>
        </Box>
      ),
      intents: [<Button value="back">Back to Home</Button>],
    });
  }

  return c.res({
    image: (
      <Box grow alignVertical="center" backgroundColor="red500" padding="32">
        <VStack gap="4">
          <Heading size="48">Error</Heading>
          <Text size="32">Invalid action selected.</Text>
        </VStack>
      </Box>
    ),
    intents: [<Button value="back">Back to Home</Button>],
  });
});

app.transaction('/send-pos-mainnet', (c) => {
  const inputText = c.inputText || '1';
  return c.send({
    chainId: 'eip155:137',
    to: recipientAddress,
    value: parseEther(inputText),
  });
});

app.frame('/send-pos-mainnet', (c) => {
  return c.res({
    action: '/',
    image: (
      <Box grow alignVertical="center" backgroundColor="green500" padding="32">
        <VStack gap="4">
          <Heading size="48">Matic Sent!</Heading>
          <Text size="32">You successfully sent MATIC.</Text>
        </VStack>
      </Box>
    ),
    intents: [<Button value="back">Back to Home</Button>],
  });
});


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
