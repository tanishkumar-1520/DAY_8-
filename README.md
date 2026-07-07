# Project Overview


This is a Hospital Management System web application designed to digitize and manage patient registration and medical records smoothly. It provides a simple, clean, and responsive user interface where hospital staff can add new patient logs, view existing records in real-time, and delete entries as needed without any manual page reloads.  
JS



**Technologies Used**

The application is built entirely using lightweight, standard web technologies:

**Frontend:**

**a) HTML (index.html):**  Structures the dashboard layout, containing the patient registration form and the records data table.  
HTML

**b) CSS (style.css):**  Provides a modern, responsive grid layout, clean typography ('Inter' font), and specialized styling for interactive form components and buttons.  



**c) JavaScript (app.js):**  Implements vanilla JS and the modern Fetch API to handle form submissions, dynamically update the table UI, and process DELETE requests asynchronously.  



**Backend:**

**Node.js & Express (server.js):**  Creates a reliable REST API backend utilizing the latest Express v5 framework to manage HTTP requests (GET, POST, DELETE) and serve static dashboard files.  



**Database / Storage:**

**a) JSON Storage (patients.json): **
Acts as the primary structured database where patient records are stored as an array of objects for fast retrieval and filtering.  


**b) Text Logging (patients.txt): **

Functions as an immutable data backup or text-based history log, appending text entries sequentially for every registered patient.  


**1. The Dashboard View:**

You will see a dual-column layout split elegantly into two primary containers:  

**a) Left Side (Register Patient Form):**  Input fields requiring a patient's Name, Age, and Disease, followed by an "Add Patient" button.  


**b) Right Side (Patient Records Table):**  A structured table displaying current hospital data under headings for ID, Name, Age, Disease, Date, and an Action column.  


**2. Registering a Patient:**


a) When you fill out the fields (e.g., Name: Tanish Kumar, Age: 21, Disease: Fever) and click submit, an automatic asynchronous POST request is fired to /books.  


b) An alert box pops up reading "Patient added!".  


c) The system automatically generates a unique ID timestamp (Date.now()) and captures the current local date.  


d) The table seamlessly updates to show the new record without forcing a browser refresh.  


**3. Behind-the-Scenes File Synchronization :**

The moment a patient is registered, the backend dynamically handles file storage:  


a) patients.json appends the details inside a clean JSON array structure.  


b) patients.txt instantly appends a human-readable text row separated by visual divider dashes.  


**4. Deleting a Record :**

a) Clicking the red "Delete" button next to any patient record triggers a confirmation alert box asking "Delete this record?".  


b) Upon confirmation, a DELETE request is sent to the backend endpoint /books/:id.  


c) The record is completely filtered out and removed from patients.json, an alert reads "Deleted!", and the user interface table is immediately refreshed to show the updated current data. (Note: The text log file safely retains the chronological entry history).  



#Open Terminal :


## Step 1 :

```
npm init -y
```

## Step 2 :

-install package :

```
npm install express cors
```




__________________________________________________________________________________________________________________________________________

**AUTHOR :**

Tanish Kumar
