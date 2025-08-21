import React, { useEffect } from 'react';
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
import { useTheme } from '../Context/ThemeContext';

const Terms = () => {
  const { fonts, gradients, colors } = useTheme();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          bgcolor: colors.primary,
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
            Terms of Service
          </Typography>
          
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: colors.lottieTeal }} />}
            aria-label="breadcrumb"
            sx={{
              color: 'white',
              '& a': { color: 'rgba(255,255,255,0.7)' },
              '& a:hover': { color: colors.lottieTeal }
            }}
          >
            <Link component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="white">Terms of Service</Typography>
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
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the medcredpro.com website (the "Service") operated by MedCredPro ("us", "we", or "our").
            </Typography>
            
            <Typography variant="body1" paragraph>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              1. Use of Service
            </Typography>
            <Typography variant="body1" paragraph>
              MedCredPro provides medical credential verification services to healthcare professionals and organizations. Our Service includes credential verification, credential monitoring, background checks, and related services for the healthcare industry.
            </Typography>
            <Typography variant="body1" paragraph>
              You must provide accurate, current, and complete information during the registration process and keep your account information up-to-date at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              2. Service Fees and Payment
            </Typography>
            <Typography variant="body1" paragraph>
              Some of our Services are offered on a fee basis. You agree to pay all fees or charges to your account based on our fees, charges, and billing terms in effect at the time a fee or charge is due and payable. You must provide us with a valid credit card (Visa, MasterCard, or any other issuer accepted by us) or PayPal account as a condition to signing up for the paid Services.
            </Typography>
            <Typography variant="body1" paragraph>
              Payments are processed securely through our payment processor. By providing your payment information, you authorize us to charge your payment method for the services you have selected.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              3. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              The Service and its original content, features, and functionality are and will remain the exclusive property of MedCredPro and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MedCredPro.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              4. User Content
            </Typography>
            <Typography variant="body1" paragraph>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
            </Typography>
            <Typography variant="body1" paragraph>
              By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              5. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              In no event shall MedCredPro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              6. Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </Typography>
            <Typography variant="body1" paragraph>
              MedCredPro does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              7. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              These Terms shall be governed and construed in accordance with the laws of Texas, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              8. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              9. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </Typography>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about these Terms, please contact us at:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>MedCredPro</strong><br />
              123 Healthcare Ave<br />
              Rio Grande City, TX 78582<br />
              (956) 555-6789<br />
              legal@medcredpro.com
            </Typography>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default Terms; 