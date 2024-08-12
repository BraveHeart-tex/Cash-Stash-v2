import { env } from "@/env";
import {
  FOREGROUND_COLOR,
  FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES,
  MUTED_FOREGROUND_COLOR,
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
import { Link } from "@react-email/components";

type ForgotPasswordEmailProps = {
  url: string;
};

const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const ForgotPasswordEmail = ({ url }: ForgotPasswordEmailProps) => (
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
    <Preview>Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            height="72"
            src={`${baseUrl}/static/cashstash-logo.png`}
            alt="CashStash"
          />
        </Section>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={heroText}>
          Hi there! We received a request to reset your password for your Cash
          Stash account. To reset your password, please click the link below.
        </Text>

        <Text>
          This code will expire in {FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES}{" "}
          minutes, so don't wait too long to use it.
        </Text>
        <Link href={url}>Click here to reset your password</Link>

        <Text style={text}>
          If you didn't request a password reset, you can ignore this email.
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

export default ForgotPasswordEmail;

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

const text = {
  color: FOREGROUND_COLOR,
  fontSize: "14px",
  lineHeight: "24px",
};
