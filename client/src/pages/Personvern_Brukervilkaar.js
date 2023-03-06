import React from 'react'

function PB({env}){
    return(
        <div style={{margin:"1rem", marginTop:"6rem"}}>
        <h1 style={{fontSize:"xx-large", textDecoration:"underline"}}>Terms of Use</h1>

<p>Welcome to {env.bedrift}'s website. By accessing or using this website, you agree to be bound by these Terms of Use.
 If you do not agree to these terms, please do not use the website.</p>

<h2>Use of the Website</h2>
<p>You may use the website to make appointments at our hair salon. By using the website, you represent and warrant
that you are at least 18 years of age or have the permission of a parent or guardian. 
You agree to provide accurate and complete information when making an appointment.
</p>

<h2>Intellectual Property</h2>
<p>All content on the website, including text, images, graphics, and logos, is the property
 of {env.bedrift} or its licensors and is protected by applicable copyright and trademark laws.</p>

<h2>Limitation of Liability</h2>
<p>{env.bedrift} is not liable for any damages arising from the use of the website or the inability
 to use the website, including direct, indirect, incidental, or consequential damages.</p>

<h2>Indemnification</h2>
<p>You agree to indemnify and hold {env.bedrift} and its affiliates, employees, agents, and representatives
 harmless from and against any and all claims, liabilities, damages, losses, and expenses, including reasonable
  attorneys' fees, arising from your use of the website.</p>

<h2>Governing Law</h2>
<p>These Terms of Use shall be governed by and construed in accordance with the laws of Norway.</p>

<h1 style={{fontSize:"xx-large", textDecoration:"underline"}}>Privacy Policy</h1>

<p>{env.bedrift} is committed to protecting your privacy. This Privacy Policy describes the types 
of information we collect and how we use and protect that information.</p>

<h2>Information We Collect</h2>
<p>When you make an appointment on our website, we collect your name, phone number,
time of the appointment, location, duration, treatments, and the name of the employee you are visiting.
  We do not store any information provided after the date of the appointment. All data about you will be deleted from our systems
  within 24 (twentyfour) hours after the appointment.</p>

<h2>How We Use Your Information</h2>
<p>We use your information to schedule your appointment and to contact you about your appointment if needed.
 </p>

<h2>How We Protect Your Information</h2>
<p>We take the security of your information seriously and use industry-standard measures to protect your data.
 Your information is stored in a protected NoSQL cluster on servers in the Nordic countries Norway and Sweden.
  The data is deleted the same evening as the appointment.
   Our employees are the only ones authorized to access your information and they are required to keep your information confidential.
    We use a
    protected route that requires MFA to access data about our appointments. 
    </p>

<h2>Third-Party Services</h2>
<p>We use Strex.no SMS API to send text messages to your phone number about your appointment. The data is sent
 securely with SSL encryption to an Azure cloud hosting service that sends the text message to the phone number provided. The textmessage
 is sent immediately when you make an appointment with us. </p>

<h2>User Rights</h2>
<p>You have the right to contact our salon by email or telephone and delete your data respectively by providing us with the correct
    information about your appointment.
 If you want to change your data, we will delete your appointment respectively
  and you will have the possibility to make another appointment with corrected data.</p>

<h2>Changes to the Policy</h2>
<p>We may update this Privacy Policy from time to time, and the affected customers will be notified
 in a respectively manner through our social media and our website.</p>

If you have any questions, please contact us at our email address provided at our website and we will get back to you as soon as possible.
        </div>
    )
}

export default React.memo(PB);