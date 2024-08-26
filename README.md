# emailz
![image](https://github.com/user-attachments/assets/15ea0caf-90d5-460c-8ef8-7cec2fd2eaa6)

Emailz is a tool to simplify copying/pasting email templates to services like Salesforce.  Previously, the department had a Google Docs document that housed all of our email templates.  It was a long document that was inefficient to comb through and find the correct email template, especially when you just needed something simple like a training template.  I decided to make Emailz, a browser extension that fetches all of our email templates from a Google Sheets document and lists them in a neat order.  You can copy email templates simply by clicking on the name of it or the copy button next to the name.  You can also favorite the email template for easy access by clicking the favorite button (stored in localStorage).

This tool was made with React and uses the Google Sheets as a "database" for all templates.  The Google Sheets document stores each template's body as HTML, which gets copied to the clipboard from the application.
