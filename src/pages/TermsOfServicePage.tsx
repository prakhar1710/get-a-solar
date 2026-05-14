import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { Separator } from '@/components/ui/separator';

const TermsOfServicePage = () => {
  return (
    <MainLayout>
      <SEOHead
        title="Terms of Service"
        description="The terms and conditions governing your use of the Get A Solar marketplace and services."
        canonicalUrl="/terms-of-service"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-primary mb-2">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Effective Date: September 19, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground leading-relaxed">
              By using Get A Solar's website and services, you agree to these terms. If you don't 
              agree, please don't use our platform.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Our Service</h2>
            <p className="text-foreground leading-relaxed">
              Get A Solar is a marketplace that connects homeowners with solar installation 
              vendors. We are not a solar installer ourselves. We facilitate connections and 
              comparisons but don't guarantee any specific outcomes or savings.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Your Responsibilities</h2>
            <p className="text-foreground mb-4">When using our service, you agree to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Provide accurate information about yourself and your property</li>
              <li>Use the service only for legitimate solar installation inquiries</li>
              <li>Respond professionally to vendor communications</li>
              <li>Not misuse or attempt to hack our platform</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">4. How Our Matching Works</h2>
            <p className="text-foreground mb-4">When you submit a solar inquiry:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>We share your information with up to 4 qualified vendors</li>
              <li>Vendors contact you directly with quotes</li>
              <li>You choose whether to proceed with any vendor</li>
              <li>We don't charge you for our matching service</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">5. No Guarantees</h2>
            <p className="text-foreground mb-4">We don't guarantee:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Specific solar savings amounts</li>
              <li>Vendor performance or installation quality</li>
              <li>Availability of government incentives</li>
              <li>Project completion timelines</li>
            </ul>
            <p className="text-foreground">
              All vendor relationships are between you and the vendor directly.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">6. Vendor Network</h2>
            <p className="text-foreground mb-4">Solar vendors in our network are:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Pre-screened for basic qualifications</li>
              <li>Independent contractors, not our employees</li>
              <li>Responsible for their own quotes and work</li>
            </ul>
            <p className="text-foreground">
              We don't control vendor pricing, quality, or business practices.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">7. Intellectual Property</h2>
            <p className="text-foreground">
              All content on Get A Solar (logos, text, design) belongs to us. You can't copy, 
              modify, or distribute our content without written permission.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">8. User Content</h2>
            <p className="text-foreground mb-4">If you submit reviews or feedback:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>You grant us permission to use it for marketing</li>
              <li>You confirm it's accurate and not misleading</li>
              <li>We can remove content that violates our guidelines</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">9. Limitation of Liability</h2>
            <p className="text-foreground mb-4">Get A Solar is not responsible for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Vendor workmanship or installation issues</li>
              <li>Actual energy savings differing from estimates</li>
              <li>Disputes between you and vendors</li>
              <li>Indirect or consequential damages</li>
            </ul>
            <p className="text-foreground">
              Our maximum liability is limited to ₹1,000.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">10. Indemnification</h2>
            <p className="text-foreground mb-4">You agree to protect Get A Solar from claims arising from:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Your use of our service</li>
              <li>Your violation of these terms</li>
              <li>Your disputes with vendors</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">11. Dispute Resolution</h2>
            <p className="text-foreground mb-4">Any disputes will be:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>First attempted through good faith negotiation</li>
              <li>Then through binding arbitration in Kota, Rajasthan</li>
              <li>Governed by Indian law</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">12. Termination</h2>
            <p className="text-foreground mb-4">We can suspend or terminate your access if you:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Violate these terms</li>
              <li>Provide false information</li>
              <li>Abuse our platform</li>
              <li>Engage in fraudulent activity</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">13. Changes to Terms</h2>
            <p className="text-foreground">
              We may update these terms. Continued use after changes means you accept the new terms.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">14. Contact Information</h2>
            <p className="text-foreground mb-4">For questions about these terms:</p>
            <ul className="list-none space-y-2 text-foreground">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@getasolar.com" className="text-primary hover:underline">
                  legal@getasolar.com
                </a>
              </li>
              <li><strong>Phone:</strong> +91 8114414256</li>
              <li><strong>Address:</strong> 1-N-14 Talwandi, Kota, Rajasthan, 324005</li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage;