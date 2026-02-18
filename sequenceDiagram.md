# Sequence Diagram – TaskFlow Task Management Application

## Main Flow: User Creates and Manages a Task (End-to-End)

This sequence diagram shows the complete flow from user login to creating a task, viewing tasks, and marking one as complete.

---

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthController
    participant AuthService
    participant TaskController
    participant TaskService
    participant TaskRepository
    participant Database

    %% --- Login Flow ---
    User->>Frontend: Enter email & password → Click Login
    Frontend->>AuthController: POST /api/auth/login { email, password }
    AuthController->>AuthService: authenticate(email, password)
    AuthService->>Database: SELECT user WHERE email = ?
    Database-->>AuthService: User record
    AuthService->>AuthService: Validate password hash
    AuthService-->>AuthController: JWT Token
    AuthController-->>Frontend: 200 OK { token }
    Frontend->>Frontend: Store JWT in localStorage

    %% --- Create Task Flow ---
    User->>Frontend: Fill task form → Click "Create Task"
    Frontend->>TaskController: POST /api/tasks { title, description, priority, dueDate, categoryId }
    Note over Frontend,TaskController: Authorization: Bearer <JWT>
    TaskController->>TaskController: Validate JWT (middleware)
    TaskController->>TaskService: createTask(userId, taskDTO)
    TaskService->>TaskService: Validate input fields
    TaskService->>TaskRepository: save(Task entity)
    TaskRepository->>Database: INSERT INTO tasks (...)
    Database-->>TaskRepository: Saved Task with ID
    TaskRepository-->>TaskService: Task object
    TaskService-->>TaskController: Task DTO
    TaskController-->>Frontend: 201 Created { task }
    Frontend->>User: Show new task in list

    %% --- View Tasks Flow ---
    User->>Frontend: Navigate to "My Tasks"
    Frontend->>TaskController: GET /api/tasks?status=pending
    TaskController->>TaskService: getTasksByUser(userId, filters)
    TaskService->>TaskRepository: findByUserIdAndFilters(userId, filters)
    TaskRepository->>Database: SELECT * FROM tasks WHERE user_id = ? AND status = ?
    Database-->>TaskRepository: List of tasks
    TaskRepository-->>TaskService: List<Task>
    TaskService-->>TaskController: List<TaskDTO>
    TaskController-->>Frontend: 200 OK [ tasks array ]
    Frontend->>User: Display task list

    %% --- Mark Task Complete Flow ---
    User->>Frontend: Click "Mark as Done" on a task
    Frontend->>TaskController: PATCH /api/tasks/{id}/complete
    TaskController->>TaskService: markTaskComplete(taskId, userId)
    TaskService->>TaskRepository: findById(taskId)
    TaskRepository->>Database: SELECT * FROM tasks WHERE id = ?
    Database-->>TaskRepository: Task record
    TaskRepository-->>TaskService: Task object
    TaskService->>TaskService: Check task belongs to user
    TaskService->>TaskRepository: updateStatus(taskId, "DONE")
    TaskRepository->>Database: UPDATE tasks SET status = 'DONE' WHERE id = ?
    Database-->>TaskRepository: Success
    TaskRepository-->>TaskService: Updated Task
    TaskService-->>TaskController: Updated TaskDTO
    TaskController-->>Frontend: 200 OK { updatedTask }
    Frontend->>User: Task marked as complete ✓
```

---

## Flow Summary

| Step | Description |
|---|---|
| **1. Login** | User authenticates; receives JWT token |
| **2. Create Task** | JWT is validated; task is saved to DB via Service → Repository |
| **3. View Tasks** | Tasks are fetched with optional filters |
| **4. Mark Complete** | Task ownership is verified; status updated to DONE |

---

## Notes

- **JWT Middleware** validates every protected request before it reaches the controller.
- **TaskService** contains all business logic (validation, ownership checks).
- **TaskRepository** is the only layer that directly interacts with the database.
- This follows the **Layered Architecture** pattern strictly.
