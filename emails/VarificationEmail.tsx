import { 
    Html, 
    Head, 
    Font, 
    Preview, 
    Heading, 
    Row, 
    Section, 
    Text, 
    Button 
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps){
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font 
                    fontFamily="Roboto" 
                    fallbackFontFamily="Verdana" 
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
                        format: 'woff2'
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>

            <Preview>Here's your verification code: {otp}</Preview>

            <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <Row>
                    <Heading as="h2">Hello, {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the verification code below to complete your registration.
                    </Text>
                </Row>
                <Row>
                    <Text 
                        style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold', 
                            color: '#333', 
                            margin: '10px 0' 
                        }}
                    >
                        {otp}
                    </Text>
                </Row>
                <Row>
                    <Button 
                        href="https://yourapp.com/verify" 
                        style={{ 
                            backgroundColor: '#007bff', 
                            color: '#fff', 
                            padding: '10px 20px', 
                            borderRadius: '5px', 
                            textDecoration: 'none' 
                        }}
                    >
                        Verify Now
                    </Button>
                </Row>
            </Section>
        </Html>
    );
}
