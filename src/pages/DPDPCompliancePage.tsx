import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';

const DPDPCompliancePage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-primary mb-2">DPDP Compliance</h1>
          <p className="text-muted-foreground mb-2">Digital Personal Data Protection Act, 2023 Compliance Statement</p>
          <p className="text-muted-foreground mb-8">Last Updated: September 19, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Commitment to DPDP Act 2023</h2>
            <p className="text-foreground leading-relaxed">
              Get A Solar fully complies with India's Digital Personal Data Protection Act, 2023. 
              We handle your personal data responsibly and transparently.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Lawful Basis for Processing</h2>
            <p className="text-foreground mb-4">We process your personal data based on:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li><strong>Your Consent:</strong> You explicitly agree when submitting solar inquiries</li>
              <li><strong>Legitimate Purpose:</strong> To provide our solar vendor matching service</li>
              <li><strong>Legal Compliance:</strong> When required by Indian law</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Your Rights Under DPDP Act</h2>
            
            <h3 className="text-xl font-medium text-primary mb-3">1. Right to Information</h3>
            <p className="text-foreground mb-4">You can request details about:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>What personal data we hold</li>
              <li>How we process it</li>
              <li>Who we share it with</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">2. Right to Correction and Erasure</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Update incorrect information anytime</li>
              <li>Request deletion of your data</li>
              <li>We'll comply unless legally required to retain it</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">3. Right to Grievance Redressal</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>File complaints about data handling</li>
              <li>Get responses within 7 working days</li>
              <li>Escalate to the Data Protection Board if needed</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">4. Right to Nomination</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Nominate someone to manage your data in case of incapacity</li>
              <li>Provide nomination details through your account settings</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data of Children</h2>
            <p className="text-foreground">
              We don't knowingly collect data from anyone under 18 years. Solar installations 
              require property ownership, typically limited to adults.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Cross-Border Data Transfer</h2>
            <p className="text-foreground mb-4">
              Your data is primarily stored in India. If we transfer data internationally, we ensure:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>The country has adequate data protection laws</li>
              <li>We use standard contractual clauses</li>
              <li>Your rights remain protected</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Consent Management</h2>
            
            <h3 className="text-xl font-medium text-primary mb-3">Giving Consent</h3>
            <p className="text-foreground mb-4">When you submit a solar inquiry, you consent to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Collection of your contact and property details</li>
              <li>Sharing information with solar vendors</li>
              <li>Receiving quotes and follow-ups</li>
            </ul>

            <h3 className="text-xl font-medium text-primary mb-3">Withdrawing Consent</h3>
            <p className="text-foreground mb-4">You can withdraw consent anytime:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Email: <a href="mailto:dpo@getasolar.com" className="text-primary hover:underline">dpo@getasolar.com</a></li>
              <li>Call our support team</li>
              <li>Use the unsubscribe link in emails</li>
            </ul>
            <p className="text-foreground">
              <strong>Note:</strong> Withdrawing consent doesn't affect past processing or legal obligations.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data Fiduciary Details</h2>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-medium text-primary mb-4">Get A Solar (Data Fiduciary)</h3>
              <ul className="list-none space-y-2 text-foreground">
                <li><strong>Data Protection Officer:</strong> Anita Malav</li>
                <li><strong>Email:</strong> <a href="mailto:dpo@getasolar.com" className="text-primary hover:underline">dpo@getasolar.com</a></li>
                <li><strong>Grievance Officer:</strong> Anita Malav</li>
                <li><strong>Grievance Email:</strong> <a href="mailto:grievance@getasolar.com" className="text-primary hover:underline">grievance@getasolar.com</a></li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data Retention</h2>
            <p className="text-foreground mb-4">We follow these retention periods:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Active inquiries: 3 years from last interaction</li>
              <li>Completed projects: 5 years for service records</li>
              <li>Marketing data: Until consent withdrawn</li>
              <li>Legal records: As required by law</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Security Measures</h2>
            <p className="text-foreground mb-4">We protect your data through:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Encryption in transit and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Data Breach Notification</h2>
            <p className="text-foreground mb-4">If a data breach occurs, we will:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Notify you within 72 hours if your data is affected</li>
              <li>Inform the Data Protection Board as required</li>
              <li>Take immediate steps to minimize harm</li>
              <li>Provide guidance on protective measures</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Grievance Redressal Mechanism</h2>
            
            <h3 className="text-xl font-medium text-primary mb-3">How to File a Grievance</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground">
              <li>Email <a href="mailto:grievance@getasolar.com" className="text-primary hover:underline">grievance@getasolar.com</a> with your concern</li>
              <li>Include your name, contact details, and issue description</li>
              <li>We'll acknowledge receipt within 24 hours</li>
              <li>Resolution provided within 7 working days</li>
            </ol>

            <h3 className="text-xl font-medium text-primary mb-3">Escalation Process</h3>
            <p className="text-foreground mb-4">If unsatisfied with our response:</p>
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground">
              <li>Request escalation to senior management</li>
              <li>If still unresolved, approach the Data Protection Board</li>
              <li>Board contact details available at <a href="https://www.dpb.gov.in" className="text-primary hover:underline">www.dpb.gov.in</a></li>
            </ol>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Automated Decision Making</h2>
            <p className="text-foreground mb-4">We use automated systems to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Match you with relevant solar vendors</li>
              <li>Filter vendors based on your location</li>
              <li>Rank vendors by ratings and reviews</li>
            </ul>
            <p className="text-foreground">
              You can request human review of automated decisions by contacting us.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Updates to Compliance</h2>
            <p className="text-foreground mb-4">
              We regularly review and update our DPDP compliance. Check this page quarterly 
              for updates. Major changes will be communicated via email.
            </p>
            
            <h3 className="text-xl font-medium text-primary mb-3">Compliance Audits</h3>
            <p className="text-foreground mb-4">We conduct:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Annual internal audits</li>
              <li>Third-party assessments every 2 years</li>
              <li>Continuous monitoring of data practices</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact Our Data Protection Officer</h2>
            <p className="text-foreground mb-4">For DPDP-related queries:</p>
            <ul className="list-none space-y-2 text-foreground">
              <li><strong>Data Protection Officer:</strong> Anita Malav</li>
              <li><strong>Email:</strong> <a href="mailto:dpo@getasolar.com" className="text-primary hover:underline">dpo@getasolar.com</a></li>
              <li><strong>Phone:</strong> +91 8114414256</li>
              <li><strong>Office Hours:</strong> Monday-Friday, 9 AM - 6 PM IST</li>
              <li><strong>Response Time:</strong> Within 48 hours</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Your Responsibility</h2>
            <p className="text-foreground mb-4">Please:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
              <li>Provide accurate information</li>
              <li>Keep your contact details updated</li>
              <li>Review our policies regularly</li>
              <li>Report any suspected data misuse immediately</li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default DPDPCompliancePage;