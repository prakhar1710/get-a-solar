import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <SEOHead
        title="Privacy Policy"
        description="How Get A Solar collects, uses, and protects your personal data when you connect with solar vendors in India."
        canonicalUrl="/privacy-policy"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Effective Date: September 19, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Who We Are</h2>
            <p className="text-foreground leading-relaxed">
              Get A Solar connects homeowners with trusted solar vendors to help you find the 
              best solar installation deals. We make solar shopping simple by bringing multiple 
              competitive bids directly to you.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-primary mb-3">What You Share With Us</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Your name and contact details (phone number, email address)</li>
              <li>Your home address for solar installation assessment</li>
              <li>Basic property information (roof type, electricity usage)</li>
              <li>Your solar project requirements and preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Your IP address and browser type</li>
              <li>Pages you visit on our website</li>
              <li>Time spent on our platform</li>
              <li>Device information</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">How We Use Your Information</h2>
            <p className="text-foreground mb-4">We use your data to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Connect you with qualified solar vendors in your area</li>
              <li>Send you competitive solar installation quotes</li>
              <li>Communicate about your solar project inquiries</li>
              <li>Improve our matching service</li>
              <li>Send relevant solar savings tips and updates (with your permission)</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Who We Share Your Information With</h2>
            
            <h3 className="text-xl font-medium text-primary mb-3">Solar Vendors</h3>
            <p className="text-foreground mb-4">
              We share your project details with up to 4 pre-screened solar installation 
              companies who will provide you with quotes. These vendors receive:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Your name and contact information</li>
              <li>Property address</li>
              <li>Solar project requirements</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">Service Providers</h3>
            <p className="text-foreground mb-4">We work with trusted companies that help us:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Send emails and SMS notifications</li>
              <li>Analyze website traffic</li>
              <li>Store data securely</li>
              <li>Process customer inquiries</li>
            </ul>
            
            <p className="text-foreground font-medium">
              We never sell your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Your Rights</h2>
            <p className="text-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-foreground">
              To exercise these rights, email us at{' '}
              <a href="mailto:privacy@getasolar.in" className="text-primary hover:underline">
                privacy@getasolar.in
              </a>{' '}
              or call our support team.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data Security</h2>
            <p className="text-foreground mb-4">We protect your information using:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Industry-standard encryption</li>
              <li>Secure servers</li>
              <li>Limited access controls</li>
              <li>Regular security audits</li>
            </ul>
            <p className="text-foreground">
              While we take data protection seriously, no internet transmission is 100% secure. 
              We cannot guarantee absolute security but we do our best to protect your information.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data Retention</h2>
            <p className="text-foreground mb-4">We keep your information for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Active inquiries: Until your solar project is completed plus 2 years</li>
              <li>Marketing list: Until you unsubscribe</li>
              <li>Legal compliance: As required by law</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Cookies</h2>
            <p className="text-foreground mb-4">Our website uses cookies to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Remember your preferences</li>
              <li>Analyze website performance</li>
              <li>Provide relevant content</li>
            </ul>
            <p className="text-foreground">
              You can control cookies through your browser settings.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Changes to This Policy</h2>
            <p className="text-foreground">
              We may update this policy occasionally. We'll notify you of significant changes via 
              email or website notification.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
            <p className="text-foreground mb-4">Questions about your privacy? Reach out:</p>
            <ul className="list-none space-y-2 text-foreground">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@getasolar.in" className="text-primary hover:underline">
                  privacy@getasolar.in
                </a>
              </li>
              <li><strong>Phone:</strong> +91 94621 87082</li>
              <li><strong>Address:</strong> 1-N-14 Talwandi, Kota, Rajasthan, 324005</li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;