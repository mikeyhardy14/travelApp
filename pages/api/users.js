// pages/api/users.js
export default async function handler(req, res) {
  // Mock 20 sample users
  const mockUsersFromDB = [
    { id: "user-001", name: "Jane Doe", email: "jane.doe@example.com", role: "admin" },
    { id: "user-002", name: "John Smith", email: "john.smith@example.com", role: "editor" },
    // { id: "user-003", name: "Alice Johnson", email: "alice.johnson@example.com", role: "viewer" },
    // { id: "user-004", name: "Bob Wilson", email: "bob.wilson@example.com", role: "editor" },
    // { id: "user-005", name: "Mary Clark", email: "mary.clark@example.com", role: "viewer" },
    // { id: "user-006", name: "James Brown", email: "james.brown@example.com", role: "admin" },
    // { id: "user-007", name: "Patricia Davis", email: "patricia.davis@example.com", role: "viewer" },
    // { id: "user-008", name: "Robert Miller", email: "robert.miller@example.com", role: "editor" },
    // { id: "user-009", name: "Linda Taylor", email: "linda.taylor@example.com", role: "editor" },
    // { id: "user-010", name: "David Anderson", email: "david.anderson@example.com", role: "viewer" },
    // { id: "user-011", name: "Sarah Thomas", email: "sarah.thomas@example.com", role: "viewer" },
    // { id: "user-012", name: "Michael Jackson", email: "michael.jackson@example.com", role: "admin" },
    // { id: "user-013", name: "Emma Moore", email: "emma.moore@example.com", role: "viewer" },
    // { id: "user-014", name: "William Martinez", email: "william.martinez@example.com", role: "editor" },
    // { id: "user-015", name: "Olivia Garcia", email: "olivia.garcia@example.com", role: "viewer" },
    // { id: "user-016", name: "Ethan Rodriguez", email: "ethan.rodriguez@example.com", role: "editor" },
    // { id: "user-017", name: "Sophia Hernandez", email: "sophia.hernandez@example.com", role: "viewer" },
    // { id: "user-018", name: "Isabella Lopez", email: "isabella.lopez@example.com", role: "viewer" },
    // { id: "user-019", name: "Benjamin Gonzalez", email: "benjamin.gonzalez@example.com", role: "admin" },
    // { id: "user-020", name: "Charlotte Perez", email: "charlotte.perez@example.com", role: "editor" }
  ];

  // Simulate a DB request delay
  await new Promise(resolve => setTimeout(resolve, 200));

  res.status(200).json(mockUsersFromDB);
}
