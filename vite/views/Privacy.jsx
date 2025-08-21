import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          bgcolor: '#1A2238',
          color: 'white',
          py: 6,
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Privacy Policy
          </Typography>
          
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: '#F9BF29' }} />}
            aria-label="breadcrumb"
            sx={{ 
              color: 'white',
              '& a': { color: 'rgba(255, 255, 255, 0.7)' },
              '& a:hover': { color: '#F9BF29' }
            }}
          >
            <Link component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="white">Privacy Policy</Typography>
          </Breadcrumbs>
        </Container>
      </Box>
      
      <Box sx={{ py: 6, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ fontStyle: 'italic' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
            
            <Typography variant="body1" paragraph>
              MedCredPro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by MedCredPro. This Privacy Policy applies to our website, medcredpro.com, and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or otherwise communicate with us.
            </Typography>
            <Typography variant="body1" paragraph>
              The personal information we collect may include:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  Name, email address, phone number, and other contact information
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Professional credentials and qualifications
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Billing information and payment details
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Information you provide when you communicate with us
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Log data, device information, and usage information automatically collected when you use our Service
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use the information we collect for various purposes, including:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  To provide, maintain, and improve our Services
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To process and complete transactions, and send related information including confirmation notices
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To verify medical credentials as part of our core service
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To respond to your comments, questions, and requests
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To send technical notices, updates, security alerts, and administrative messages
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To provide customer service and support
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To communicate with you about products, services, offers, and events, and provide news and information we think will be of interest to you
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  To monitor and analyze trends, usage, and activities in connection with our Service
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Information Sharing and Disclosure
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell or rent your personal information to third parties. We may share your personal information in the following situations:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>For Legal Reasons:</strong> We may share information if we believe disclosure is necessary or appropriate to comply with any law, regulation, legal process, or governmental request.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>With Your Consent:</strong> We may share information with third parties when we have your consent to do so.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
            </Typography>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Your Rights and Choices
            </Typography>
            <Typography variant="body1" paragraph>
              You have several rights regarding your personal information:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>Access and Update:</strong> You can access and update certain information about you from your account settings.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>Opt-Out:</strong> You may opt out of receiving promotional communications from us by following the instructions in those communications or by contacting us.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>Data Retention:</strong> We retain personal information for as long as necessary to provide the services you have requested, or for other essential purposes such as complying with our legal obligations.
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review this Privacy Policy periodically for the latest information on our privacy practices.
            </Typography>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>MedCredPro</strong><br />
              123 Healthcare Ave<br />
              Rio Grande City, TX 78582<br />
              (956) 555-6789<br />
              privacy@medcredpro.com
            </Typography>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default Privacy; 