import { Body, Container, Head, Heading, Html, Img, Section, Text } from '@react-email/components'

interface BinRestaurantVerifyEmailProps {
  code: string
  title: string
  customerName?: string
}

const logoUrl = 'https://raw.githubusercontent.com/Quan-Vo-Dinh/qr-ordering-frontend/refs/heads/main/public/banner4.png'
const avatarUrl = 'https://raw.githubusercontent.com/Quan-Vo-Dinh/qr-ordering-frontend/refs/heads/main/public/bin1.png'

export const VerifyEmail = ({ code, title, customerName }: BinRestaurantVerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Section style={brandContainer}>
            <Img src={`${logoUrl}`} width="100" height="100" alt="Bin Restaurant" style={logoImage} />
            <Heading style={brandName}>BIN RESTAURANT</Heading>
            <Text style={tagline}>Where every meal is crafted with passion.</Text>
          </Section>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Section style={welcomeSection}>
            <Img src={`${avatarUrl}`} width="64" height="64" alt="Bin Restaurant Chef" style={chefImage} />
            <Heading style={titleStyle}>{title}</Heading>
          </Section>

          <Text style={greeting}>Welcome {customerName || 'there'}!</Text>

          <Text style={description}>Please enter this verification code to complete your registration:</Text>

          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>

          <Text style={expiryNote}>Code expires in 5 minutes</Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footer}>© 2025 Bin Restaurant. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

VerifyEmail.PreviewProps = {
  code: '847293',
  title: 'Verify Your Account',
  customerName: 'Vo Dinh Quan',
} as BinRestaurantVerifyEmailProps

export default VerifyEmail

// Shadcn UI inspired styles
const main = {
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif",
  padding: '20px 0',
} as const

const container = {
  backgroundColor: '#1a1a1a', // Dark gray for contrast
  border: '1px solid #333333', // Darker border
  borderRadius: '12px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
} as const

const header = {
  backgroundColor: '#000000', // Black header
  padding: '16px',
  textAlign: 'center' as const,
} as const

const brandContainer = {
  textAlign: 'center' as const,
  marginBottom: '12px',
} as const

const logoImage = {
  display: 'block',
  margin: '0 auto 8px',
} as const

const brandName = {
  color: '#ffffff', // White text for contrast
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '1px',
  margin: '0',
  textAlign: 'center' as const,
} as const

const tagline = {
  color: '#cccccc', // Light gray for tagline
  fontSize: '13px',
  fontWeight: 400,
  margin: '0',
  textAlign: 'center' as const,
  letterSpacing: '0.5px',
} as const

const content = {
  padding: '20px 40px',
} as const

const welcomeSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
} as const

const chefImage = {
  borderRadius: '50%',
  margin: '0 auto 20px',
  display: 'block',
  border: '3px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
} as const

const titleStyle = {
  color: '#ffffff', // White for title
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '28px',
  margin: '0',
  textAlign: 'center' as const,
} as const

const greeting = {
  color: '#e0e0e0', // Light gray for greeting
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
} as const

const description = {
  color: '#e0e0e0', // Light gray for description
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 36px',
  textAlign: 'center' as const,
} as const

const codeContainer = {
  backgroundColor: '#000000', // Black background for code container
  borderRadius: '8px',
  margin: '32px 0',
  padding: '24px',
  textAlign: 'center' as const,
  border: '1px solid #444444', // Dark gray border
} as const

const codeStyle = {
  color: '#ffffff', // White text for code
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '1',
  margin: '0',
  textAlign: 'center' as const,
  fontFamily: "Monaco, 'Courier New', monospace",
} as const

const expiryNote = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '24px 0 0',
  textAlign: 'center' as const,
} as const

const footerSection = {
  padding: '24px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#1a1a1a', // Dark gray for footer
} as const

const footer = {
  color: '#cccccc', // Light gray for footer text
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
} as const

const _link = {
  color: '#3b82f6',
  textDecoration: 'underline',
} as const
