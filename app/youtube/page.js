// app/youtube/page.js
'use client';

import { Input, Button, Spacer, Container, Row, Card, Text } from '@nextui-org/react';

export default function YouTubePage() {
  return (
    <Container
      display="flex"
      alignItems="center"
      justify="center"
      css={{
        minHeight: '100vh',
        backgroundColor: '#000', 
        padding: '20px',
      }}
    >
      <Card
        css={{
          mw: '500px',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#111', 
        }}
      >
        <Card.Body>
          <Text h3 css={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
            YouTube Link Submission
          </Text>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Enter YouTube Link"
            css={{
              backgroundColor: '#333',
              color: '#fff',
            }}
          />
          <Spacer y={1} />
          <Row justify="space-between">
            <Button
              auto
              flat
              color="error"
              css={{
                width: '48%',
              }}
            >
              Delete
            </Button>
            <Button
              auto
              color="primary"
              css={{
                width: '48%',
              }}
            >
              Send
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
