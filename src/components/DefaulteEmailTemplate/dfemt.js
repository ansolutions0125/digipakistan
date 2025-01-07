module.exports = function (content) {
  return `
          
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    "
  >
    <header style="background-color: #4caf50; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to DigiSkills Training Program</h1>
    </header>

    <section style="padding: 20px;">
      <h2 style="color: #4caf50; font-size: 20px; margin-top: 0;">Hello</h2>
      <p style="font-size: 16px; color: #555;">
        Thank you for enrolling in our training program. We are excited to have you on board! Below are your login details:
      </p>

      <div
        style="
          background-color: #f4f9f4;
          border: 1px solid #e0e0e0;
          padding: 15px 20px;
          border-radius: 6px;
          margin-top: 15px;
        "
      >
        ${content}
      </div>

      <p style="font-size: 16px; color: #555; margin-top: 20px;">
        Best regards, <br />The DigiSkills Team
      </p>
    </section>

    <footer
      style="
        background-color: #f0f0f0;
        padding: 15px;
        text-align: center;
        font-size: 14px;
        color: #888;
      "
    >
      © 2024 DigiSkills Training Program. All rights reserved.
    </footer>
  </div>

  
      `;
};
