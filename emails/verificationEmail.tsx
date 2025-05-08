import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Body,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html lang="en">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KF0mCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontStyle="normal"
            fontWeight={400}
          />
        </Head>
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Body>
          <Section style={{ padding: '20px' }}>
            <Row>
              <Heading as="h2">Hello {username},</Heading>
            </Row>
            <Row>
              <Text>
                Thank you for registering. Please use the following verification code to complete your registration:
              </Text>
            </Row>
            <Row>
              <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {otp}
              </Text>
            </Row>
            <Row>
              <Text>If you did not request this code, you can safely ignore this email.</Text>
            </Row>
          </Section>
        </Body>
      </Html>
    );
  }
  