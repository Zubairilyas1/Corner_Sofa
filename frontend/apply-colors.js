const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../homepageidea.html');
const outputPath = path.join(__dirname, 'public/home-styled.html');

let html = fs.readFileSync(inputPath, 'utf8');

const cssInjection = `
<style>
  /* Injected Premium Color Palette */
  :root {
    --color-base-text: 78, 34, 15 !important; /* #4E220F */
    --color-base-background-1: 247, 241, 222 !important; /* #F7F1DE */
    --color-base-background-2: 176, 186, 153 !important; /* #B0BA99 */
    --color-base-solid-button-labels: 247, 241, 222 !important;
    --color-base-outline-button-labels: 157, 102, 56 !important; /* #9D6638 */
    --color-base-accent-1: 157, 102, 56 !important; /* #9D6638 */
    --color-base-accent-2: 197, 168, 128 !important; /* #C5A880 */
    --payment-terms-background-color: #F7F1DE !important;
  }
  
  body, .color-background-1, .gradient {
    background-color: #F7F1DE !important;
    color: #4E220F !important;
  }
  
  .color-background-2 {
    background-color: #B0BA99 !important;
  }
  
  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, .rich-text__heading {
    color: #4E220F !important;
  }
  
  .button, .btn, form button {
    background-color: #9D6638 !important;
    color: #F7F1DE !important;
    border-color: #9D6638 !important;
  }
  
  .button--secondary {
    background-color: #B0BA99 !important;
    color: #4E220F !important;
    border-color: #B0BA99 !important;
  }
  
  .header-wrapper, .footer {
    background-color: #1A1A1A !important;
    color: #F7F1DE !important;
  }
  
  .header__heading-link, .footer-block__heading, .footer__list-item a {
    color: #F7F1DE !important;
  }

  .card__inner {
    background-color: #fff !important;
  }
</style>
`;

html = html.replace('</head>', cssInjection + '</head>');

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

fs.writeFileSync(outputPath, html);
console.log('Successfully injected CSS and saved to public/home-styled.html');
