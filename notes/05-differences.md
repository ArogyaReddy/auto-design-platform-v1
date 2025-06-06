```js

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payroll Portal Demo (Complex Elements Lab)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
        body {
            margin: 0;
            background: #f6f9fc;
            font-family: 'Segoe UI', Arial, sans-serif;
        }

        .banner {
            background: linear-gradient(90deg, #f9d923 0%, #f78ca2 100%);
            padding: 16px;
            text-align: center;
            font-size: 1.1em;
        }

        .container {
            max-width: 920px;
            margin: 32px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 18px #0001;
            padding: 32px;
        }

        .header {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo {
            width: 46px;
            height: 46px;
            border-radius: 8px;
            background: #19c8fa;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 2em;
        }

        nav {
            margin-left: auto;
        }

        nav a {
            color: #19c8fa;
            font-weight: bold;
            text-decoration: none;
            margin: 0 8px;
        }

        nav a.active {
            border-bottom: 2px solid #19c8fa;
        }

        .form-row {
            margin-bottom: 16px;
        }

        label {
            display: block;
            font-weight: 500;
            margin-bottom: 3px;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 7px 10px;
            font-size: 1em;
            border: 1px solid #ccc;
            border-radius: 6px;
            margin-top: 5px;
            box-sizing: border-box;
        }

        .form-row.radio label,
        .form-row.checkbox label {
            display: inline-flex;
            align-items: center;
            margin-right: 18px;
            font-weight: normal;
        }

        .form-row.radio input,
        .form-row.checkbox input {
            width: auto;
            margin-right: 5px;
            margin-top: 0;
        }

        .btn {
            background: #19c8fa;
            color: #fff;
            border: none;
            padding: 8px 22px;
            border-radius: 6px;
            font-size: 1em;
            cursor: pointer;
        }

        .btn.secondary {
            background: #0b95a2;
        }

        .btn:active {
            filter: brightness(0.92);
        }

        .table-wrap {
            overflow-x: auto;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 18px 0;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #f3fafe;
        }

        .floating,
        .modal,
        .fullscreen-modal {
            display: none;
            position: fixed;
            z-index: 1100;
            background: #fff;
            box-shadow: 0 4px 22px #3333;
            border-radius: 12px;
        }

        .floating.active {
            display: block;
            top: 18%;
            right: 2%;
            width: 290px;
            padding: 24px;
        }

        .modal.active {
            display: block;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 390px;
            padding: 32px;
        }

        .fullscreen-modal.active {
            display: flex;
            flex-direction: column;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            padding: 0;
            align-items: center;
            justify-content: center;
            border-radius: 0;
            box-sizing: border-box;
        }

        .fullscreen-modal .content {
            background: #fff;
            border-radius: 16px;
            padding: 48px;
            box-shadow: 0 8px 40px #0004;
            width: 60vw;
            max-width: 700px;
        }

        .overlay {
            display: none;
            position: fixed;
            z-index: 1000;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(16, 28, 48, 0.30);
        }

        .overlay.active {
            display: block;
        }

        .logout-btn {
            margin-left: 10px;
        }

        .file-upload {
            margin-bottom: 18px;
        }

        .payroll-info {
            background: #e8f7fb;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .info-btn {
            color: #19c8fa;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2em;
            padding: 0 5px;
        }

        .shadow-host,
        .iframe-section-host {
            margin: 24px 0 0 0;
            padding: 16px;
            border: 2px dashed #19c8fa;
            border-radius: 7px;
        }

        .iframe-section-host {
            border-color: #f78ca2;
        }

        .btn-close {
            background: none;
            border: none;
            color: #aaa;
            font-size: 1.5em;
            cursor: pointer;
            position: absolute;
            padding: 5px;
        }

        .floating .btn-close {
            top: 5px;
            right: 10px;
            font-size: 1.1em;
        }

        .modal .btn-close {
            top: 10px;
            right: 15px;
        }

        .fullscreen-modal .btn-close {
            top: 32px;
            right: 40px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 12px;
                margin: 16px auto;
            }

            .fullscreen-modal .content {
                width: 95vw;
                padding: 24px;
            }

            .header {
                flex-direction: column;
                align-items: flex-start;
            }

            nav {
                margin-left: 0;
                margin-top: 10px;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
            }

            nav a {
                margin: 5px 8px 5px 0;
            }

            .logout-btn {
                margin-left: auto;
            }
        }
    </style>
</head>

<body>
    <div class="banner">📢 Payroll processing this week! <b>Submit timesheets by Friday 5pm.</b></div>
    <div class="container" id="main-app">
        <div class="header">
            <div class="logo">💸</div>
            <h2>PayRoll Demo Portal</h2>
            <nav id="main-nav" style="display:none">
                <a href="#dashboard" id="nav-dash" class="active">Dashboard</a>
                <a href="#profile" id="nav-prof">Profile</a>
                <a href="#docs" id="nav-docs">Documents</a>
                <a href="#logout" id="nav-logout" class="logout-btn btn secondary">Logout</a>
            </nav>
        </div>

        <form id="login-form" autocomplete="on">
            <h3>Login to Payroll</h3>
            <div class="form-row">
                <label for="username-login">Username</label>
                <input id="username-login" type="text" name="username" required autofocus value="testuser">
            </div>
            <div class="form-row">
                <label for="password-login">Password</label>
                <input id="password-login" type="password" name="password" required value="password">
            </div>
            <button class="btn" type="submit">Login</button>
        </form>

        <div id="dashboard" style="display:none">
            <h3>Welcome, <span id="user-welcome">testuser</span>!</h3>
            <div class="payroll-info">
                <span>💬 <b>Latest Info:</b> Your last payslip is available. Download below.</span>
                <button class="info-btn" onclick="showFloating()" aria-label="Show help">&#9432; Help</button>
            </div>
            <button class="btn" onclick="showModal()">Add Payroll Entry</button>
            <button class="btn secondary" onclick="showFullscreenModal()">Open Fullscreen Modal</button>

            <h4>Payslips</h4>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>File</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2025-05-31</td>
                            <td>$3,210.00</td>
                            <td>✅ Paid</td>
                            <td><a href="#" onclick="fakeDownload('payslip_may.pdf'); return false;"
                                    download="payslip_may.pdf">Download</a></td>
                        </tr>
                        <tr>
                            <td>2025-04-30</td>
                            <td>$3,150.00</td>
                            <td>✅ Paid</td>
                            <td><a href="#" onclick="fakeDownload('payslip_apr.pdf'); return false;"
                                    download="payslip_apr.pdf">Download</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="shadow-host" id="shadow-host">
                (Custom Shadow Payroll Widget L0 placeholder)
            </div>

            <hr style="margin: 24px 0;">
            <h3>iframe Section</h3>
            <div class="iframe-section-host">
                <h4>Main Page Content Above iframe</h4>
                <p>This text is on the main page, outside the iframe.</p>
                <iframe id="same-origin-iframe" title="Same Origin Iframe Content"
                    style="width: 100%; height: 350px; border: 1px solid #ccc;"></iframe>
                <p>This text is on the main page, below the iframe.</p>
            </div>
        </div>

        <div id="profile" style="display:none">
            <h3>👤 Profile</h3>
            <form id="profile-form">
                <div class="form-row">
                    <label for="fullname-profile">Full Name</label>
                    <input id="fullname-profile" type="text" name="fullname" value="Test User">
                </div>
                <div class="form-row">
                    <label for="email-profile">Email</label>
                    <input id="email-profile" type="email" name="email" value="test@paydemo.com">
                </div>
                <fieldset class="form-row radio">
                    <legend>Preferred Contact:</legend>
                    <label><input type="radio" name="pref-contact" value="email" checked> Email</label>
                    <label><input type="radio" name="pref-contact" value="sms"> SMS</label>
                </fieldset>
                <div class="form-row checkbox">
                    <label><input type="checkbox" name="notifications" checked> Receive Notifications</label>
                </div>
                <div class="form-row">
                    <label for="country-select">Country</label>
                    <select id="country-select" name="country">
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="about-profile">About You</label>
                    <textarea id="about-profile" rows="3" name="about">Loves payroll automation.</textarea>
                </div>
                <div class="form-row file-upload">
                    <label for="file-upload-profile">Upload ID Proof</label>
                    <input type="file" id="file-upload-profile" name="id_proof" accept=".jpg,.png,.pdf">
                </div>
                <button class="btn" type="submit">Update Profile</button>
            </form>
        </div>

        <div id="docs" style="display:none">
            <h3>📄 Company Documents</h3>
            <ul>
                <li><a href="#" onclick="fakeDownload('employee_handbook.pdf'); return false;" download>Employee
                        Handbook</a></li>
                <li><a href="#" onclick="fakeDownload('leave_policy.pdf'); return false;" download>Leave Policy</a>
                </li>
            </ul>
        </div>
    </div>

    <div class="overlay" id="modalOverlay" onclick="closeAllModals();"></div>
    <div class="modal" id="testModal">
        <button class="btn-close" onclick="closeModal()" aria-label="Close">&times;</button>
        <h3>Add Payroll Entry</h3>
        <form id="payroll-entry-form">
            <div class="form-row">
                <label for="emp-modal">Employee</label>
                <input id="emp-modal" type="text" name="emp" value="Test User">
            </div>
            <div class="form-row">
                <label for="date-modal">Date</label>
                <input id="date-modal" type="date" name="date">
            </div>
            <div class="form-row">
                <label for="amount-modal">Amount</label>
                <input id="amount-modal" type="number" name="amount" value="3200">
            </div>
            <fieldset class="form-row radio">
                <legend>Payment Mode:</legend>
                <label><input type="radio" name="mode-modal" value="bank" checked> Bank Transfer</label>
                <label><input type="radio" name="mode-modal" value="cash"> Cash</label>
            </fieldset>
            <div class="form-row checkbox">
                <label><input type="checkbox" name="notify-modal" checked> Send Notification</label>
            </div>
            <button class="btn" type="submit">Submit</button>
            <button class="btn secondary" type="button" onclick="closeModal()">Cancel</button>
        </form>
    </div>
    <div class="floating" id="floatingWindow">
        <button class="btn-close" onclick="closeFloating()" aria-label="Close">&times;</button>
        <h4>Need Help?</h4>
        <p>For payroll questions, email <a href="mailto:support@paydemo.com">support@paydemo.com</a></p>
        <button class="btn secondary" onclick="closeFloating()">Close</button>
    </div>
    <div class="fullscreen-modal" id="fullscreenModal">
        <button class="btn-close" onclick="closeFullscreenModal()" aria-label="Close">&times;</button>
        <div class="content">
            <h3>Full Screen Modal</h3>
            <p>This is a full-screen modal dialog. Useful for approvals, big forms, or anything else.</p>
            <button class="btn" onclick="closeFullscreenModal()">OK</button>
        </div>
    </div>

    <script>
        // Ensures DOM is fully loaded before scripts run, good practice
        document.addEventListener('DOMContentLoaded', function () {

            // --------- SPA Routing/State
            let currentUser = null;
            const loginForm = document.getElementById('login-form');
            const mainNav = document.getElementById('main-nav');
            const userWelcome = document.getElementById('user-welcome');
            const pages = ['dashboard', 'profile', 'docs'];
            const navLinks = {
                dashboard: document.getElementById('nav-dash'),
                profile: document.getElementById('nav-prof'),
                docs: document.getElementById('nav-docs')
            };

            if (loginForm) {
                loginForm.onsubmit = function (e) {
                    e.preventDefault();
                    currentUser = this.username.value || 'testuser';
                    loginForm.style.display = 'none';
                    if (mainNav) mainNav.style.display = 'flex';
                    showPage('dashboard');
                    if (userWelcome) userWelcome.textContent = currentUser;
                };
            }

            Object.keys(navLinks).forEach(pageId => {
                if (navLinks[pageId]) {
                    navLinks[pageId].onclick = function (e) {
                        e.preventDefault();
                        showPage(pageId);
                        return false;
                    };
                }
            });

            const navLogout = document.getElementById('nav-logout');
            if (navLogout) {
                navLogout.onclick = function (e) {
                    e.preventDefault();
                    if (mainNav) mainNav.style.display = 'none';
                    if (loginForm) loginForm.style.display = '';
                    pages.forEach(id => {
                        const pageEl = document.getElementById(id);
                        if (pageEl) pageEl.style.display = 'none';
                    });
                    currentUser = null;
                    if (loginForm && loginForm.username) loginForm.username.value = '';
                    if (loginForm && loginForm.password) loginForm.password.value = '';
                    return false;
                };
            }

            function showPage(id) {
                pages.forEach(pageId => {
                    const pageEl = document.getElementById(pageId);
                    if (pageEl) pageEl.style.display = 'none';
                });
                const targetPage = document.getElementById(id);
                if (targetPage) targetPage.style.display = '';

                Object.values(navLinks).forEach(link => link && link.classList.remove('active'));
                if (navLinks[id]) navLinks[id].classList.add('active');
            }

            // ------------- Modal/Floating logic
            const modalOverlay = document.getElementById('modalOverlay');
            const testModal = document.getElementById('testModal');
            const floatingWindow = document.getElementById('floatingWindow');
            const fullscreenModal = document.getElementById('fullscreenModal');

            // Make functions global or ensure they are accessible via onclick
            window.showModal = function () { if (testModal) testModal.classList.add('active'); if (modalOverlay) modalOverlay.classList.add('active'); }
            window.closeModal = function () { if (testModal) testModal.classList.remove('active'); if (modalOverlay) modalOverlay.classList.remove('active'); }
            window.showFloating = function () { if (floatingWindow) floatingWindow.classList.add('active'); }
            window.closeFloating = function () { if (floatingWindow) floatingWindow.classList.remove('active'); }
            window.showFullscreenModal = function () { if (fullscreenModal) fullscreenModal.classList.add('active'); if (modalOverlay) modalOverlay.classList.add('active'); }
            window.closeFullscreenModal = function () { if (fullscreenModal) fullscreenModal.classList.remove('active'); if (modalOverlay) modalOverlay.classList.remove('active'); }
            window.closeAllModals = function () { closeModal(); closeFullscreenModal(); }
            window.fakeDownload = function (name) { alert(`Simulating download of: ${name}`); }


            // Shadow DOM - Open (Original L0)
            const shadowHostL0 = document.getElementById('shadow-host');
            let shadowRootL0 = null;
            if (shadowHostL0) {
                shadowRootL0 = shadowHostL0.attachShadow({ mode: 'open' });
                shadowRootL0.innerHTML = `
                    <style>
                      .shadow-payroll { background: #f1feee; border: 1px solid #d2ede4; border-radius: 7px; padding: 16px; margin-top: 12px;}
                      .shadow-payroll input, .shadow-payroll select, .shadow-payroll button { border: 1px solid #a2a2f2; margin-top: 5px; padding: 5px; border-radius: 3px; box-sizing: border-box;}
                      .shadow-payroll button { background-color: #5cb85c; color:white; cursor:pointer;}
                      .shadow-payroll table { width: 90%; margin-top:10px; border-collapse: collapse;}
                      .shadow-payroll th, .shadow-payroll td { border: 1px solid #baddc4; padding: 5px; text-align:left;}
                      label { display: block; margin-bottom: 2px; }
                    </style>
                    <div class="shadow-payroll">
                      <h4>Shadow Payroll Widget L0</h4>
                      <form id="shadow-form-L0">
                        <label for="shadow-input-L0">Shadow Input L0:</label>
                        <input type="text" id="shadow-input-L0" value="Shadow Data L0"><br>
                        <label for="shadow-combo-L0">Shadow Combo L0:</label>
                        <select id="shadow-combo-L0">
                          <option>Shadow 1</option>
                          <option>Shadow 2</option>
                        </select><br>
                        <button type="button" id="shadow-submit-L0">Submit L0</button>
                      </form>
                      <table>
                        <thead><tr><th>Shadow Table L0</th></tr></thead>
                        <tbody><tr><td>Value L0</td></tr></tbody>
                      </table>
                      <a href="#" id="shadow-link-L0">Shadow Link L0</a>
                      <div id="nested-host-container-L1" style="margin-top:15px; padding:10px; border:1px dashed purple;">
                          (Placeholder for Nested Shadow Host L1)
                      </div>
                    </div>
                `;
                // Add event listener for button inside shadow DOM L0
                const shadowButtonL0 = shadowRootL0.getElementById('shadow-submit-L0');
                if (shadowButtonL0) shadowButtonL0.onclick = () => alert('Shadow L0 Submit!');
                const shadowLinkL0 = shadowRootL0.getElementById('shadow-link-L0');
                if (shadowLinkL0) shadowLinkL0.onclick = (e) => { e.preventDefault(); alert('Shadow L0 Link clicked!'); };
            } else {
                console.error("Main shadow-host (L0) not found.");
            }

            // NEW: Populate Same-Origin iframe with Shadow DOM Content
            const iframeElement = document.getElementById('same-origin-iframe');
            if (iframeElement) {
                const iframeContent = 
                    '<!DOCTYPE html>' +
                    '<html lang="en">' +
                    '<head><title>Iframe Content</title>' +
                    '<meta charset="UTF-8">' +
                    '<style>' +
                    '    body { font-family: Segoe UI, Arial, sans-serif; margin: 10px; background-color: #e6f7ff; color: #333; }' +
                    '    #iframe-shadow-host-L1 { margin-top:10px; padding:10px; border:1px dashed #007bff; border-radius: 5px; }' +
                    '    button { padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top:5px;}' +
                    '    input, select { margin-top:5px; padding:5px; border-radius:3px; border:1px solid #ccc; box-sizing: border-box;}' +
                    '    label {display: block; margin-bottom: 2px;}' +
                    '</style>' +
                    '</head>' +
                    '<body>' +
                    '    <h3>Content Inside Same-Origin iframe</h3>' +
                    '    <p>This is text directly inside the iframe\'s main document.</p>' +
                    '    <button id="iframe-button-main">Button in iframe (main)</button>' +
                    '    <div id="iframe-shadow-host-L1">' +
                    '        (iframe\'s Shadow Host L1 Container)' +
                    '    </div>' +
                    '    <script>' +
                    '        try {' +
                    '            const iframeShadowHostL1 = document.getElementById(\'iframe-shadow-host-L1\');' +
                    '            if(iframeShadowHostL1) {' +
                    '                const iframeShadowRootL1 = iframeShadowHostL1.attachShadow({ mode: \'open\' });' +
                    '                iframeShadowRootL1.innerHTML = ' +
                    '                    \'<style>\' +' +
                    '                    \'    p { color: green; font-weight: bold; }\' +' +
                    '                    \'    button { background-color: #28a745 !important; }\' +' +
                    '                    \'    #input-in-iframe-shadow-L1 { border-color: green; }\' +' +
                    '                    \'    #iframe-shadow-button-L1 { background-color: #ffc107 !important; color: black;}\' +' +
                    '                    \'</style>\' +' +
                    '                    \'<p>Text: Shadow DOM (L1) inside iframe.</p>\' +' +
                    '                    \'<label for="input-in-iframe-shadow-L1">Input (iframe\\\'s L1 shadow):</label>\' +' +
                    '                    \'<input type="text" id="input-in-iframe-shadow-L1" value="Input in iframe\\\'s shadow L1">\' +' +
                    '                    \'<button id="iframe-shadow-button-L1">Button (iframe\\\'s L1 shadow)</button>\';' +
                    '                const btnInIframeShadowL1 = iframeShadowRootL1.getElementById(\'iframe-shadow-button-L1\');' +
                    '                if(btnInIframeShadowL1) btnInIframeShadowL1.onclick = () => alert("Button in iframe\\\'s Shadow L1 clicked!");' +
                    '            } else {' +
                    '                console.error("iframe-shadow-host-L1 not found in iframe DOM.");' +
                    '            }' +
                    '        } catch(e) {' +
                    '            console.error("Error creating shadow DOM in iframe:", e);' +
                    '        }' +
                    '    <\/script>' +
                    '</body>' +
                    '</html>';
                iframeElement.setAttribute('srcdoc', iframeContent);
                // Add listener for button inside iframe's main document
                iframeElement.onload = function () {
                    try {
                        const btnInIframeMain = iframeElement.contentDocument.getElementById('iframe-button-main');
                        if (btnInIframeMain) btnInIframeMain.onclick = () => alert("Button in iframe's main document clicked!");
                    } catch (e) {
                        console.warn("Could not attach listener to button in iframe main document (possibly due to srcdoc timing or access):", e);
                    }
                };

            } else {
                console.warn("iframeElement with ID 'same-origin-iframe' not found.");
            }

            // NEW: Add a Nested Shadow DOM Example to the Main Page's Initial Shadow DOM (L0)
            if (shadowRootL0) {
                const nestedHostContainerL1_InL0 = shadowRootL0.getElementById('nested-host-container-L1');
                if (nestedHostContainerL1_InL0) {
                    nestedHostContainerL1_InL0.innerHTML = ''; // Clear placeholder

                    const nestedShadowHostL1 = document.createElement('div');
                nestedShadowHostL1.id = 'nested-shadow-host-L1-actual';
                nestedShadowHostL1.style.padding = "10px";
                nestedShadowHostL1.style.border = "1px dashed darkmagenta";
                nestedHostContainerL1_InL0.appendChild(nestedShadowHostL1);

                const nestedShadowRootL1 = nestedShadowHostL1.attachShadow({ mode: 'open' });
                nestedShadowRootL1.innerHTML = 
                    '<style>' +
                    '    b { color: darkmagenta; }' +
                    '    #deep-button-L1 { background: #6f42c1; color:white; padding:5px; border:none; border-radius:3px; cursor:pointer; margin-top:5px;}' +
                    '    #nested-host-container-L2 { margin-top:10px; padding:10px; border:1px dashed teal;}' +
                    '    label { display: block; margin-bottom: 2px; }' +
                    '    input { margin-top: 5px; padding: 5px; border-radius: 3px; border: 1px solid #ccc; box-sizing: border-box;}' +
                    '</style>' +
                    '<b>Text: Nested Shadow DOM (L1) on main page (inside L0 shadow).</b><br>' +
                    '<label for="input-L1-shadow">Input L1 Shadow:</label>' +
                    '<input type="text" id="input-L1-shadow" value="Input L1"><br>' +
                    '<button id="deep-button-L1">Deep Button L1</button>' +
                    '<div id="nested-host-container-L2">' +
                    '    (Placeholder for Nested Shadow Host L2)' +
                    '</div>';
                const btnDeepL1 = nestedShadowRootL1.getElementById('deep-button-L1');
                    if (btnDeepL1) btnDeepL1.onclick = () => alert('Deep Button L1 clicked!');

                    const nestedHostContainerL2_InL1 = nestedShadowRootL1.getElementById('nested-host-container-L2');
                    if (nestedHostContainerL2_InL1) {
                        nestedHostContainerL2_InL1.innerHTML = ''; // Clear placeholder

                        const nestedShadowHostL2 = document.createElement('div');
                        nestedShadowHostL2.id = 'nested-shadow-host-L2-actual';
                        nestedShadowHostL2.style.padding = "10px";
                        nestedShadowHostL2.style.border = "1px dashed darkcyan";
                        nestedHostContainerL2_InL1.appendChild(nestedShadowHostL2);

                        const nestedShadowRootL2 = nestedShadowHostL2.attachShadow({ mode: 'open' });
                        nestedShadowRootL2.innerHTML = 
                            '<style>' +
                            '    em { color: darkcyan; font-weight:bold; }' +
                            '    #very-deep-button-L2 { background: #fd7e14; color:white; padding:5px; border:none; border-radius:3px; cursor:pointer; margin-top:5px;}' +
                            '    label { display: block; margin-bottom: 2px; }' +
                            '    input { margin-top: 5px; padding: 5px; border-radius: 3px; border: 1px solid #ccc; box-sizing: border-box;}' +
                            '</style>' +
                            '<em>Text: Nested Shadow DOM (L2) on main page (inside L1 shadow).</em><br>' +
                            '<label for="very-deep-input-L2">Input L2 Shadow:</label>' +
                            '<input type="text" id="very-deep-input-L2" value="Very Deep Input L2"><br>' +
                            '<button id="very-deep-button-L2">Deeper Button L2</button>';
                        const btnVeryDeepL2 = nestedShadowRootL2.getElementById('very-deep-button-L2');
                        if (btnVeryDeepL2) btnVeryDeepL2.onclick = () => alert('Deeper Button L2 clicked!');
                    }
                } else {
                    console.error("Could not find 'nested-host-container-L1' in the initial L0 shadow DOM.");
                }
            } else {
                console.error("Initial shadowRootL0 for 'shadow-host' was not found. Cannot append nested shadow DOMs.");
            }

            const fileUploadProfile = document.getElementById('file-upload-profile');
            if (fileUploadProfile) {
                fileUploadProfile.addEventListener('change', function () {
                    if (this.files && this.files.length > 0) {
                        alert('File "' + this.files[0].name + '" selected for profile!');
                    }
                });
            }

            document.getElementById('profile-form')?.addEventListener('submit', function (e) { e.preventDefault(); alert('Profile form submitted (demo).'); });
            document.getElementById('payroll-entry-form')?.addEventListener('submit', function (e) { e.preventDefault(); alert('Payroll entry form submitted (demo).'); });

        }); // End of DOMContentLoaded
    </script>
</body>

</html>