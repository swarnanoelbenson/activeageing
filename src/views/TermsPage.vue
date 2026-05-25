<template>
  <div class="page">
    <AppNavbar />
    <main class="main">

      <div class="hero">
        <h1 class="title">Terms of Service</h1>
        <p class="effective">Effective date: 1 January 2026</p>
      </div>

      <div class="content">
        <p class="intro">
          Please read these Terms of Service carefully before using the ActiveAgeing Australia
          website and wellness tools. By accessing or using our service, you agree to be bound
          by these terms. If you do not agree, please do not use our service.
        </p>

        <section class="section">
          <h2>1. About ActiveAgeing</h2>
          <p>ActiveAgeing Australia is a wellness platform designed to support adults aged 65 and over in maintaining and improving their physical activity levels. Our tools include a wellness check-in survey, personalised exercise recommendations, pose estimation guidance, a route planner, and a community events directory.</p>
        </section>

        <section class="section">
          <h2>2. Not Medical Advice</h2>
          <div class="disclaimer-box">
            <p><strong>Important health disclaimer:</strong> The information, exercises, and recommendations provided by ActiveAgeing are for general wellness and informational purposes only. They do not constitute medical advice, diagnosis, or treatment.</p>
          </div>
          <p>Always consult your doctor or a qualified healthcare professional before starting any new exercise program, particularly if you have a pre-existing medical condition, injury, or health concern. If you experience pain, dizziness, shortness of breath, or any other discomfort during exercise, stop immediately and seek medical attention.</p>
          <p>ActiveAgeing does not accept any responsibility or liability for injury or harm resulting from following recommendations on this platform.</p>
        </section>

        <section class="section">
          <h2>3. Eligibility</h2>
          <p>Our service is intended for adults aged 18 and over, with a primary focus on adults aged 65 and over. By using our service, you confirm that you are at least 18 years of age. Users under 18 should only use this service under adult supervision.</p>
        </section>

        <section class="section">
          <h2>4. Acceptable Use</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You must not:</p>
          <ul>
            <li>Use the service in any way that violates applicable Australian or international laws or regulations</li>
            <li>Attempt to gain unauthorised access to any part of our platform or infrastructure</li>
            <li>Transmit any harmful, offensive, or disruptive content</li>
            <li>Scrape, copy, or redistribute our content without prior written permission</li>
            <li>Use automated tools to access or interact with the service in ways that place unreasonable load on our servers</li>
          </ul>
        </section>

        <section class="section">
          <h2>5. Intellectual Property</h2>
          <p>All content on this platform — including text, images, exercise guides, logos, and software — is owned by or licensed to ActiveAgeing Australia. You may not reproduce, distribute, modify, or create derivative works without our express written consent.</p>
          <p>Exercise images and descriptions are provided for personal, non-commercial use only.</p>
        </section>

        <section class="section">
          <h2>6. Camera and Device Permissions</h2>
          <p>The interactive pose estimation feature requests access to your device camera. Camera access is entirely voluntary — the feature works without it using the step-image guide instead. All camera processing occurs locally in your browser; no video or image data is transmitted to our servers. You can revoke camera access at any time through your browser settings.</p>
        </section>

        <section class="section">
          <h2>7. Third-Party Links and Services</h2>
          <p>Our platform may link to third-party websites and services including Eventbrite event listings. These third-party services have their own terms and privacy policies, which we encourage you to review. We are not responsible for the content, accuracy, or practices of any third-party sites.</p>
        </section>

        <section class="section">
          <h2>8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, ActiveAgeing Australia and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from:</p>
          <ul>
            <li>Your use of or inability to use our service</li>
            <li>Any injury or health event resulting from following exercise recommendations</li>
            <li>Errors or inaccuracies in the wellness check-in results</li>
            <li>Temporary unavailability of our service</li>
          </ul>
          <p>Our total liability to you for any claim shall not exceed the amount you paid us (if any) in the 12 months preceding the claim.</p>
        </section>

        <section class="section">
          <h2>9. Service Availability</h2>
          <p>We strive to keep ActiveAgeing available at all times, but we do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice. We are not liable for any consequences of such changes.</p>
        </section>

        <section class="section">
          <h2>10. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Victoria, Australia. Any disputes arising from these Terms or your use of our service shall be subject to the exclusive jurisdiction of the courts of Victoria.</p>
        </section>

        <section class="section">
          <h2>11. Changes to These Terms</h2>
          <p>We may update these Terms of Service from time to time to reflect changes to our service or legal requirements. Updated terms will be posted on this page with a revised effective date. Your continued use of the service after any changes constitutes your acceptance of the new terms.</p>
        </section>

        <section class="section">
          <h2>12. Contact Us</h2>
          <p>If you have questions about these Terms of Service, please contact us:</p>
          <div class="contact-block">
            <p><strong>ActiveAgeing Australia</strong></p>
            <p>Email: nswa0005@student.monash.edu</p>
            <p>Website: https://activeageing.vercel.app</p>
          </div>
        </section>
      </div>

    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.page {
  min-height: 100vh;
  background: #f4f1eb;
  font-family: 'Poppins', sans-serif;
  color: #1a2e2b;
  display: flex;
  flex-direction: column;
}

.main {
  max-width: 860px;
  margin: 0 auto;
  padding: 60px 40px 80px;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.hero {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid #d8d2c8;
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 8px;
}

.effective {
  font-size: 14px;
  color: #7a8c88;
  margin: 0;
}

.intro {
  font-size: 16px;
  line-height: 1.8;
  color: #3a4a48;
  margin-bottom: 40px;
}

.content { display: flex; flex-direction: column; }

.section {
  padding: 28px 0;
  border-bottom: 1px solid #e0dbd2;
}

.section:last-child { border-bottom: none; }

.section h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 14px;
}

.section p {
  font-size: 15px;
  line-height: 1.8;
  color: #3a4a48;
  margin: 0 0 12px;
}

.section ul {
  padding-left: 20px;
  margin: 8px 0 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section ul li {
  font-size: 15px;
  line-height: 1.7;
  color: #3a4a48;
}

.disclaimer-box {
  background: #fff4e0;
  border-left: 4px solid #e0a020;
  border-radius: 8px;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.disclaimer-box p {
  margin: 0;
  color: #5a3a00;
}

.contact-block {
  background: #e8f4f3;
  border-radius: 12px;
  padding: 18px 22px;
  margin-top: 8px;
}

.contact-block p {
  margin: 4px 0;
  font-size: 15px;
  color: #0f3d35;
}

@media (max-width: 768px) {
  .main { padding: 32px 20px 60px; }
  .title { font-size: 28px; }
  .section h2 { font-size: 17px; }
}
</style>
