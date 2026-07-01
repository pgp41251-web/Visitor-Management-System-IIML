# IIM Lucknow Visitor Management System (VMS) Portal

A premium, modern, and highly interactive **Visitor Management System (VMS)** portal designed for the Indian Institute of Management Lucknow (IIML) campus. It streamlines security check-ins, tracks campus visitors in real time, and issues printable entry passes.

## Features

- **Branding & Custom Aesthetics**: Deep Navy Blue & Gold colors matching IIM Lucknow's brand identity. Integrated with a live clock and professional crest.
- **Analytics Dashboard**: Real-time counter metrics tracking *Currently Checked-In*, *Total Visits Today*, and *Checked Out Today*.
- **Check-In Registration**: Validate and register new visitors with fields for Name, Phone, Email, Purpose of Visit, Host details, Vehicle number, and Government ID verification.
- **Real-Time Logs Monitor**: Searchable database supporting state-based filters (e.g. Active Check-ins, Checked Out, or All logs).
- **High-Fidelity Digital Pass**: Generates a high-quality printable gate pass featuring a status badge and a simulated security QR code scan area.
- **Local Storage Persistence**: Saves check-ins to the browser's `localStorage` so data is preserved even after page refresh. Includes pre-seeded mock records for demonstration.
- **Responsive Layout**: Designed to work smoothly on full-screen security station displays as well as tablets and mobile devices.

## Running Locally

To run the application, simply open the `index.html` file in any modern web browser.

Alternatively, you can run a local development server for testing:

### Option 1: Python
If you have Python installed, run this command in your project directory:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option 2: Node.js (npx)
If you have Node.js installed, run:
```bash
npx serve
```
Then visit the URL displayed in the terminal.

## Project Structure
- `index.html`: Web page markup and layouts.
- `style.css`: Custom theme styling, responsiveness, animations, and printable stylesheets.
- `app.js`: State manager, interactive logic, check-in validation, and rendering functions.
- `README.md`: Documentation (this file).

---
*Created by Antigravity AI Assistant.*
