import {
  FOREGROUND_COLOR,
  MUTED_FOREGROUND_COLOR,
  PRIMARY_COLOR,
  PRIMARY_FOREGROUND_COLOR,
} from "@/lib/constants";
import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SlackConfirmEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const RegisterConfirmEmail = ({
  validationCode,
}: SlackConfirmEmailProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Arial"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v3/U4UJrUEs8kVcJ5xkMwKcSg.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Confirm your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            height="72"
            src={`${baseUrl}/static/cashstash-logo.png`}
            alt="CashStash"
          />
        </Section>
        <Heading style={h1}>Confirm your email address</Heading>
        <Text style={heroText}>
          Hi there! Thanks for signing up for <i>Cash Stash</i>. Your
          confirmation code is below - enter it in your open browser window and
          we'll help you get signed in.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{validationCode}</Text>
        </Section>

        <Text style={text}>
          If you didn't sign up for this service, there's nothing to worry
          about, you can safely ignore it.
        </Text>

        <Section>
          <Text style={footerText}>
            Bora Karaca Inc. Turkey
            <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default RegisterConfirmEmail;

const footerText = {
  fontSize: "12px",
  color: MUTED_FOREGROUND_COLOR,
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  fontFamily: "Montserrat, sans-serif",
  color: FOREGROUND_COLOR,
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: PRIMARY_COLOR,
  color: PRIMARY_FOREGROUND_COLOR,
  borderRadius: "8px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: FOREGROUND_COLOR,
  fontSize: "14px",
  lineHeight: "24px",
};
