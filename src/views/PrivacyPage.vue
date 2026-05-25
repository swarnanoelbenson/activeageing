<template>
  <div class="page">
    <AppNavbar />
    <main class="main">

      <div class="hero">
        <h1 class="title">Privacy Policy</h1>
        <p class="effective">Effective date: 1 January 2026</p>
      </div>

      <div class="content">
        <p class="intro">
          ActiveAgeing Australia ("we", "us", or "our") is committed to protecting your privacy.
          This Privacy Policy explains what information we collect, how we use it, and your rights
          in relation to that information when you use our website and wellness check-in tools.
        </p>

        <section class="section">
          <h2>1. Information We Collect</h2>
          <h3>1.1 Information you provide</h3>
          <p>When you complete the wellness check-in survey, we collect your responses to questions about physical activity frequency, session duration, sedentary time, sleep hours, and rest quality. We do not ask for your name, email address, or any other personally identifying information.</p>
          <h3>1.2 Usage data</h3>
          <p>We may automatically collect non-personal technical information such as your browser type, device type, operating system, and pages visited. This data is used solely to improve the performance and reliability of our service.</p>
          <h3>1.3 Camera access</h3>
          <p>If you choose to use the interactive pose estimation feature, your device camera is accessed locally in your browser. Video frames are processed entirely on your device using the MediaPipe library — no video, images, or pose data are ever transmitted to our servers or stored.</p>
        </section>

        <section class="section">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To calculate your personalised wellness category and exercise recommendations</li>
            <li>To display your results on-screen and store them temporarily in your browser's local storage</li>
            <li>To improve the accuracy and relevance of recommendations over time using aggregated, anonymised data</li>
            <li>To monitor and improve the technical performance of our service</li>
          </ul>
          <p>We do not use your information for advertising, and we do not sell or share your data with third parties for marketing purposes.</p>
        </section>

        <section class="section">
          <h2>3. Local Storage</h2>
          <p>Your survey answers and wellness results are saved in your browser's local storage so that your results persist between visits on the same device. This data never leaves your device unless you explicitly share it. You can clear this data at any time by clearing your browser's site data.</p>
        </section>

        <section class="section">
          <h2>4. Third-Party Services</h2>
          <p>Our service integrates with the following third-party platforms:</p>
          <ul>
            <li><strong>Eventbrite</strong> — to display upcoming community events. Eventbrite's own Privacy Policy governs data you provide when registering for those events.</li>
            <li><strong>MediaPipe (Google)</strong> — a browser-based pose estimation library loaded from a CDN. No data is sent to Google during its use.</li>
            <li><strong>OpenRouteService</strong> — to provide route planning functionality. Only start and end coordinates are sent for route calculation.</li>
          </ul>
        </section>

        <section class="section">
          <h2>5. Data Retention</h2>
          <p>Survey responses stored in our database are retained in anonymised, aggregated form only. No personally identifiable records are kept. Browser-stored data (local storage) is retained until you clear it yourself.</p>
        </section>

        <section class="section">
          <h2>6. Your Rights</h2>
          <p>Under Australian privacy law and the Australian Privacy Principles (APPs), you have the right to:</p>
          <ul>
            <li>Access any personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of any future data collection</li>
          </ul>
          <p>Because we collect no personally identifying information, there is generally no individual record to access or correct. If you have questions or concerns, please contact us at the address below.</p>
        </section>

        <section class="section">
          <h2>7. Security</h2>
          <p>We take reasonable steps to protect the information we hold against misuse, interference, loss, and unauthorised access. All data in transit is encrypted using HTTPS. Our backend infrastructure is hosted on Vercel and AWS RDS with industry-standard security configurations.</p>
        </section>

        <section class="section">
          <h2>8. Children's Privacy</h2>
          <p>ActiveAgeing is designed for adults aged 65 and over. We do not knowingly collect information from children under 18. If you believe a child has submitted information through our service, please contact us so we can remove it promptly.</p>
        </section>

        <section class="section">
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our service after any changes constitutes acceptance of the updated policy.</p>
        </section>

        <section class="section">
          <h2>10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact:</p>
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

.content { display: flex; flex-direction: column; gap: 0; }

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

.section h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1a5c52;
  margin: 16px 0 8px;
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
