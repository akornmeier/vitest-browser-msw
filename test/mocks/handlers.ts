import { http, HttpResponse } from "msw";

// Create sample HTML responses for different test scenarios
const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic Test Page</title>
</head>
<body>
  <div id="app">
    <h1>Basic Test Page</h1>
    <p data-testid="paragraph">This is a test paragraph</p>
    <button id="test-button">Click me</button>
  </div>
</body>
</html>
`;

const formHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Test Page</title>
</head>
<body>
  <div id="app">
    <h1>Form Test Page</h1>
    <form id="test-form">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" data-testid="name-input" />
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" data-testid="email-input" />
      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  </div>
</body>
</html>
`;

const jsonData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ],
};

// Define the handlers
export const handlers = [
  // HTML endpoints
  http.get("/test/basic", () => {
    return new HttpResponse(basicHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  http.get("/test/form", () => {
    return new HttpResponse(formHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),

  // JSON API endpoints
  http.get("/api/users", () => {
    return HttpResponse.json(jsonData);
  }),

  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    const user = jsonData.users.find((user) => user.id === Number(id));

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),
];
