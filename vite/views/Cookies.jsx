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

const Cookies = () => {
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
            Cookie Policy
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
            <Typography color="white">Cookie Policy</Typography>
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
              This Cookie Policy explains how MedCredPro ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website at medcredpro.com ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              What Are Cookies?
            </Typography>
            <Typography variant="body1" paragraph>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </Typography>
            <Typography variant="body1" paragraph>
              Cookies set by the website owner (in this case, MedCredPro) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Why Do We Use Cookies?
            </Typography>
            <Typography variant="body1" paragraph>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for analytics and other purposes.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Types of Cookies We Use
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Essential Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website, you cannot refuse them without impacting how our Website functions.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Performance and Functionality Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Analytics and Customization Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you in order to enhance your experience.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Advertising Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              How Can You Control Cookies?
            </Typography>
            <Typography variant="body1" paragraph>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by adjusting the settings in your web browser.
            </Typography>
            <Typography variant="body1" paragraph>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <Link href="https://www.aboutcookies.org" target="_blank" rel="noopener">www.aboutcookies.org</Link> or <Link href="https://www.allaboutcookies.org" target="_blank" rel="noopener">www.allaboutcookies.org</Link>.
            </Typography>
            <Typography variant="body1" paragraph>
              Find out how to manage cookies on popular browsers:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <Link href="https://support.google.com/accounts/answer/61416" target="_blank" rel="noopener">Google Chrome</Link>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <Link href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener">Mozilla Firefox</Link>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <Link href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener">Microsoft Edge</Link>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <Link href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener">Safari</Link>
                </Typography>
              </li>
            </ul>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Changes to This Cookie Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </Typography>
            <Typography variant="body1" paragraph>
              The date at the top of this Cookie Policy indicates when it was last updated.
            </Typography>
            
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Where Can You Get Further Information?
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about our use of cookies or other technologies, please contact us at:
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

export default Cookies; 