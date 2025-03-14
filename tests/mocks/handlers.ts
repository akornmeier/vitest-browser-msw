// tests/mocks/handlers.ts
import { http, HttpResponse } from "msw";

// Custom configurable fixture
interface CustomPageOptions {
  includeMissingAlt?: boolean;
  includeContrastIssues?: boolean;
  includeMissingLabels?: boolean;
  includeHeadingSkip?: boolean;
}

// HTML fixture with various accessibility issues
const pageWithIssues = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessibility Test Page</title>
</head>
<body>
  <header>
    <div>Site Logo</div> <!-- Should be a heading or have appropriate role -->
    <nav>
      <!-- Missing nav landmarks -->
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
  
  <main>
    <section>
      <h2>Image Issues</h2>
      <img src="/images/hero.jpg"> <!-- Missing alt text -->
      <img src="/images/icon.png" alt=""> <!-- Empty alt text -->
      <img src="/images/decorative.jpg" alt="decorative" role="presentation"> <!-- Decorative image with alt text -->
    </section>

    <section>
      <h2>Form Issues</h2>
      <form>
        <input type="text" placeholder="Enter your name"> <!-- Missing label -->
        <select> <!-- Missing label -->
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        <button style="background-color: #777; color: #999;">Submit</button> <!-- Contrast issue -->
      </form>
    </section>
    
    <section>
      <h2>Structure Issues</h2>
      <h4>Improper heading level</h4> <!-- Skipped heading level -->
      <div role="button">Click me</div> <!-- Missing keyboard accessibility -->
      <div aria-label=""> <!-- Empty aria-label -->
        Empty label content
      </div>
    </section>
  </main>
  
  <footer>
    <div style="color: #aaa; background-color: #eee;">
      Low contrast text in footer
    </div>
  </footer>
</body>
</html>
`;

// HTML fixture with no accessibility issues
const accessiblePage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessible Test Page</title>
</head>
<body>
  <header>
    <h1>Site Title</h1>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section aria-labelledby="images-heading">
      <h2 id="images-heading">Images</h2>
      <img src="/images/hero.jpg" alt="Hero image showing our product">
      <img src="/images/icon.png" alt="Small icon">
      <img src="/images/decorative.jpg" alt="" role="presentation">
    </section>

    <section aria-labelledby="form-heading">
      <h2 id="form-heading">Form</h2>
      <form>
        <div>
          <label for="name">Name:</label>
          <input id="name" type="text">
        </div>
        <div>
          <label for="options">Select an option:</label>
          <select id="options">
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
        <button style="background-color: #000; color: #fff;">Submit</button>
      </form>
    </section>
  </main>
  
  <footer>
    <p style="color: #000; background-color: #fff;">
      High contrast text in footer
    </p>
  </footer>
</body>
</html>
`;

// Specific issue-focused fixtures
const missingAltPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Missing Alt Text Test</title>
</head>
<body>
  <main>
    <h1>Images Without Alt Text</h1>
    <img src="/image1.jpg">
    <img src="/image2.jpg">
    <img src="/image3.jpg">
  </main>
</body>
</html>
`;

const contrastIssuePage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Contrast Issues Test</title>
</head>
<body>
  <main>
    <h1>Contrast Issues</h1>
    <p style="color: #aaa; background-color: #eee;">Low contrast text example 1</p>
    <p style="color: #888; background-color: #ddd;">Low contrast text example 2</p>
    <button style="color: #777; background-color: #ccc;">Low contrast button</button>
  </main>
</body>
</html>
`;

const getCustomIssuesPage = (options: CustomPageOptions = {}) => {
  const {
    includeMissingAlt = false,
    includeContrastIssues = false,
    includeMissingLabels = false,
    includeHeadingSkip = false,
  } = options;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Custom Test Page</title>
    </head>
    <body>
      <main>
        <h1>Test Page</h1>
        
        ${
          includeMissingAlt
            ? '<img src="/test.jpg">'
            : '<img src="/test.jpg" alt="Test image">'
        }
        
        ${
          includeContrastIssues
            ? '<p style="color: #aaa; background-color: #eee;">Low contrast text</p>'
            : '<p style="color: #000; background-color: #fff;">High contrast text</p>'
        }
        
        ${
          includeMissingLabels
            ? '<input type="text" placeholder="Name">'
            : '<label for="name">Name:</label><input id="name" type="text">'
        }
        
        ${
          includeHeadingSkip
            ? "<h1>Main Heading</h1><h3>Skipped h2</h3>"
            : "<h1>Main Heading</h1><h2>Proper heading</h2>"
        }
      </main>
    </body>
    </html>
  `;
};

// MSW handlers
export const handlers = [
  // Base test pages
  http.get("/test-pages/issues", () => {
    return HttpResponse.text(pageWithIssues, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  http.get("/test-pages/accessible", () => {
    return HttpResponse.text(accessiblePage, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  // Specific issue pages
  http.get("/test-pages/missing-alt", () => {
    return HttpResponse.text(missingAltPage, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  http.get("/test-pages/contrast", () => {
    return HttpResponse.text(contrastIssuePage, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  // Dynamic page with query parameters
  http.get("/test-pages/custom", ({ request }) => {
    const url = new URL(request.url);

    const options = {
      includeMissingAlt: url.searchParams.get("missingAlt") === "true",
      includeContrastIssues: url.searchParams.get("contrast") === "true",
      includeMissingLabels: url.searchParams.get("missingLabels") === "true",
      includeHeadingSkip: url.searchParams.get("headingSkip") === "true",
    };

    return HttpResponse.text(getCustomIssuesPage(options), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),
];
