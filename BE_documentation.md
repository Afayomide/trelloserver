# 1.Add a New Task to the Task Board

## Create and Insert a Task into the Database

- **URL**: `/tasks`
- **Method**: `POST`
- **Description**: Adds a new task to the task board by inserting the task details into the database. It also logs the creation of the task in the task history.
- **Request Body**:
  - **`title`** (required): The title of the task (string).
  - **`description`** (required): The description of the task (string).
  - **`tag`** (required): The tag associated with the task (string).
  - **`column_id`** (required): The ID of the column in which the task belongs (number).
  - **`tag_bg`** (optional): The background color for the tag (string, e.g., hex color code).
  - **`tag_color`** (optional): The color for the tag text (string, e.g., hex color code).
- **Response**:
  - **Success Response**:
    - **Code**: `201 Created`
    - **Content**: JSON object containing a success message and the details of the created task.
    - **Example**:
      ```json
      {
        "message": "Task successfully added!",
        "task": {
          "id": 1,
          "title": "New Task",
          "description": "This is a new task.",
          "tag": "urgent",
          "column_id": 2,
          "position": 0,
          "tag_bg": "#FF0000",
          "tag_color": "#FFFFFF"
        }
      }
      ```
  - **Error Responses**:
    - **Code**: `400 Bad Request` – Required fields are missing in the request body.
      - **Content**:
        ```json
        {
          "error": "All fields are required."
        }
        ```
    - **Code**: `500 Internal Server Error` – Server error occurred while processing the request.
      - **Content**:
        ```json
        {
          "error": "Something went wrong. Please try again later."
        }
        ```

### Flow:

1. **Input Validation**:
   - The server checks if all required fields (`title`, `description`, `tag`) are provided in the request body.
   - If any required field is missing, it returns a `400` error with a message indicating that all fields are required.

2. **Insert Task into Database**:
   - The server inserts the task data into the `tasks` table in the database.
   - The task is given an initial `position` value of `0` (indicating the task’s order in the column).
   - The task is assigned to a column identified by `column_id`.
   - After inserting the task, the database returns the created task object.

3. **Log Task Creation**:
   - The server inserts an entry into the `task_history` table to log the creation of the task.
   - This log includes the `task_id`, `action` (`created`), `column_id`, `position`, and `title` of the task.
   
4. **Return Response**:
   - After successfully adding the task and logging the creation, the server returns a `201` success response with the created task details.

5. **Error Handling**:
   - If an error occurs during the task creation process (e.g., database issue), a `500` error response is sent with a generic error message.
   - If any required fields are missing, a `400` error response is returned indicating that all fields are required.

### Key Fields:

- **`title`**: The title of the task (required).
- **`description`**: A detailed description of the task (required).
- **`tag`**: A tag to categorize or label the task (required).
- **`column_id`**: The ID of the column in which the task belongs (required).
- **`tag_bg`**: The background color of the task's tag (optional).
- **`tag_color`**: The color of the text on the task's tag (optional).
- **`position`**: An integer representing the position of the task in the column (default is `0`).


### Error Handling:

The function handles errors in the following ways:
- **`400` Bad Request**: If the required fields are not included in the request body, a `400` error is returned with the message "All fields are required."
- **`500` Internal Server Error**: If there is an issue with the database query or any other server-side issue, a `500` error is returned with a generic message "Something went wrong. Please try again later."

This function ensures that tasks are added to the board and logged in the system with appropriate error handling and response structure.





# 2.Fetch Tasks from the Task Board

## Retrieve All Tasks or Filter by Column ID

- **URL**: `/tasks`
- **Method**: `GET`
- **Description**: Fetches tasks from the task board. You can optionally filter the tasks by specifying a `column_id` in the query parameters. The tasks are returned in ascending order of their `position`.
- **Request Query Parameters**:
  - **`column_id`** (optional): The ID of the column from which to fetch tasks. If provided, only tasks from the specified column will be returned.
- **Response**:
  - **Success Response**:
    - **Code**: `200 OK`
    - **Content**: JSON array containing the list of tasks.
    - **Example**:
      ```json
      [
        {
          "id": 1,
          "title": "New Task",
          "description": "This is a new task.",
          "tag": "urgent",
          "column_id": 2,
          "position": 0,
          "tag_bg": "#FF0000",
          "tag_color": "#FFFFFF"
        },
        {
          "id": 2,
          "title": "Another Task",
          "description": "This task needs attention.",
          "tag": "low-priority",
          "column_id": 3,
          "position": 1,
          "tag_bg": "#FFFF00",
          "tag_color": "#000000"
        }
      ]
      ```
  - **Error Responses**:
    - **Code**: `500 Internal Server Error` – Server error occurred while processing the request.
      - **Content**:
        ```json
        {
          "error": "Failed to fetch tasks"
        }
        ```

### Flow:

1. **Column ID Filter**:
   - If a `column_id` is provided in the query parameters, the server adds a filter to only return tasks belonging to that column.
   - If no `column_id` is provided, all tasks are fetched.

2. **SQL Query**:
   - The function constructs an SQL query to fetch tasks from the `tasks` table.
   - It uses an `ORDER BY` clause to sort the tasks in ascending order of their `position`, ensuring that tasks are returned in the correct order.

3. **Database Interaction**:
   - The query is executed using `pool.query()` to fetch tasks from the database.
   - If a `column_id` is provided, the query will filter tasks by the specified `column_id`.

4. **Return Response**:
   - If the tasks are successfully fetched, a `200 OK` response is returned with the task details in the response body.
   - If there is any error during the fetching process (e.g., database connection error), a `500` error response is returned with a generic error message.


### Error Handling:

The function handles errors as follows:
- **`500` Internal Server Error**: If there is an issue with the database query or any other server-side issue, a `500` error is returned with the message "Failed to fetch tasks".

This function allows users to fetch tasks from the task board, with an optional filter by `column_id`, and ensures they are displayed in the correct order based on their `position`.







# 3.Update Task Details

## Update the Column or Position of a Task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Description**: Updates the column and/or position of an existing task. This action also logs the change in the `task_history` table. The task's details will be updated based on the provided data in the request body.
- **Request Parameters**:
  - **`id`** (required): The ID of the task to update.
- **Request Body**:
  - **`column_id`** (required): The new column ID where the task should be moved.
  - **`position`** (required): The new position of the task within the column.
- **Response**:
  - **Success Response**:
    - **Code**: `200 OK`
    - **Content**: A confirmation message indicating the task has been updated.
    - **Example**:
      ```json
      "Task Updated"
      ```
  - **Error Responses**:
    - **Code**: `404 Not Found` – Task not found.
      - **Content**:
        ```json
        {
          "error": "Task not found"
        }
        ```
    - **Code**: `500 Internal Server Error` – An error occurred during the task update process.
      - **Content**:
        ```json
        {
          "error": "Something went wrong. Please try again later."
        }
        ```

### Flow:

1. **Fetch Task**:
   - The function starts by fetching the task from the database using the provided `id` in the request parameters.
   - If the task is not found, a `404` response with an error message is returned.

2. **Log Task History**:
   - If the task is found, an entry is inserted into the `task_history` table to log the action (task update) along with the task's current `column_id`, `position`, and `title`.

3. **Update Task**:
   - The task's `column_id` and `position` are updated with the new values provided in the request body.
   - The update is executed through an `UPDATE` SQL query.

4. **Return Response**:
   - If the update is successful, a `200 OK` response is sent, confirming the task has been updated.
   - If there’s any error, a `500` error response is returned with the error message.

### Database Interaction:

- **`tasks` Table**: The query updates the following fields in the `tasks` table:
  - `column_id`: The new column to which the task is assigned.
  - `position`: The new position of the task within the column.

- **`task_history` Table**: An entry is inserted into the `task_history` table to log the task update:
  - `task_id`: The ID of the task being updated.
  - `action`: The action performed ("updated").
  - `column_id`: The column ID of the task before the update.
  - `position`: The position of the task before the update.
  - `title`: The title of the task.

### Error Handling:

The function handles errors as follows:
- **`404 Not Found`**: If the task with the specified `id` is not found in the database, a `404` response with the message `"Task not found"` is returned.
- **`500 Internal Server Error`**: If there is an issue with the task update or database interaction, a `500` error is returned with the appropriate error message.

This function allows users to update a task's column and position, while ensuring that changes are logged in the history for auditing purposes.







# 4.Delete Task

## Delete a Task and Log its History

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Description**: Deletes an existing task from the system. This action also logs the task deletion in the `task_history` table. The task is identified by its unique `id`.
- **Request Parameters**:
  - **`id`** (required): The ID of the task to delete.
- **Response**:
  - **Success Response**:
    - **Code**: `200 OK`
    - **Content**: A confirmation message indicating the task has been deleted and its history has been updated.
    - **Example**:
      ```json
      "Task Deleted and history updated."
      ```
  - **Error Responses**:
    - **Code**: `404 Not Found` – Task not found.
      - **Content**:
        ```json
        {
          "error": "Task not found."
        }
        ```
    - **Code**: `500 Internal Server Error` – An error occurred while deleting the task or logging the history.
      - **Content**:
        ```json
        {
          "error": "Something went wrong. Please try again later."
        }
        ```

### Flow:

1. **Fetch Task**:
   - The function starts by fetching the task from the database using the provided `id` in the request parameters.
   - If the task is not found (i.e., `taskResult.rows.length === 0`), a `404` response with an error message is returned.

2. **Log Task History**:
   - If the task is found, an entry is inserted into the `task_history` table to log the deletion. This entry contains:
     - The `task_id`
     - The action (`"deleted"`)
     - The `column_id`, `position`, `title`, `description`, and `tag` of the task.

3. **Delete Task**:
   - The task is deleted from the `tasks` table using the `DELETE` SQL query.

4. **Return Response**:
   - If the deletion is successful, a `200 OK` response is sent, confirming that the task has been deleted and its history updated.
   - If there’s any error, a `500` error response is returned with the error message.

### Database Interaction:

- **`tasks` Table**: The task is deleted from the `tasks` table using the `DELETE` SQL query.
  
- **`task_history` Table**: An entry is inserted into the `task_history` table to log the task deletion. This includes:
  - `task_id`: The ID of the deleted task.
  - `action`: The action performed ("deleted").
  - `column_id`: The column ID of the task.
  - `position`: The position of the task.
  - `title`: The title of the task.
  - `description`: The description of the task.
  - `tag`: The tag associated with the task.

### Error Handling:

The function handles errors as follows:
- **`404 Not Found`**: If the task with the specified `id` is not found in the database, a `404` response with the message `"Task not found"` is returned.
- **`500 Internal Server Error`**: If there is an issue with the task deletion or database interaction, a `500` error is returned with the appropriate error message.

This function allows users to delete a task and ensures that the task's deletion is properly logged for historical reference.






# 5.Get All Task History

## Fetch All Task History

- **URL**: `/task-history`
- **Method**: `GET`
- **Description**: Fetches all records from the task history, ordered by the most recent creation date.
- **Response**:
  - **Success Response**:
    - **Code**: `200 OK`
    - **Content**: A message indicating the task history has been fetched successfully, along with an array of task history records.
    - **Example**:
      ```json
      {
        "message": "Task history fetched successfully!",
        "history": [
          {
            "task_id": 1,
            "action": "created",
            "column_id": 2,
            "position": 1,
            "title": "Task 1",
            "description": "Description of Task 1",
            "tag": "Tag1",
            "created_at": "2025-01-05T12:00:00Z"
          },
          {
            "task_id": 2,
            "action": "updated",
            "column_id": 1,
            "position": 2,
            "title": "Task 2",
            "description": "Description of Task 2",
            "tag": "Tag2",
            "created_at": "2025-01-04T11:00:00Z"
          }
        ]
      }
      ```
  - **Error Responses**:
    - **Code**: `500 Internal Server Error` – An error occurred while fetching task history.
      - **Content**:
        ```json
        {
          "error": "Something went wrong. Please try again later."
        }
        ```

### Flow:

1. **Fetch Task History**:
   - The function queries the `task_history` table to retrieve all task history records, ordered by the `created_at` field in descending order. This ensures that the most recent task history is returned first.

2. **Return Response**:
   - If the query is successful, a `200 OK` response is sent, containing a success message and an array of task history records.
   - If there is an error during the query execution, a `500 Internal Server Error` response is returned with an error message.

### Error Handling:

- **`500 Internal Server Error`**: If there is any issue with the database query or fetching data, a `500` error response is returned with the message `"Something went wrong. Please try again later."`.


