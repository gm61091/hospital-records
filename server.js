const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const PORT = 3000;

const db = pgp('postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn'); // Update with your database credentials

app.use(express.json());


// Update the discharge_date of all patients with the condition "Flu" to the current date
app.put('/patients/updateDischargeDate', async (req, res) => {
    await db.none('UPDATE patients SET discharge_date = CURRENT_DATE WHERE condition = $1', ['Flu']);
        res.send('Discharge dates updated for patients with the condition "Flu".');
});

// Delete the patient with the longest stay in the hospital
app.delete('/patients/deleteLongestStay', async (req, res) => {
    await db.none('DELETE FROM patients WHERE id = (SELECT id FROM patients ORDER BY discharge_date - admission_date DESC LIMIT 1)');
    res.send('Deleted patient with the longest stay in the hospital.');
});

// Show all female patients over the age of 50
app.get('/patients/femaleOver50', async (req, res) => {
    const femaleOver50 = await db.any('SELECT * FROM patients WHERE gender = $1 AND age > $2', ['Female', 50]);
    res.json(femaleOver50);
});

// Show the average age of all patients with the condition "Diabetes"
app.get('/patients/averageAgeDiabetes', async (req, res) => {
    const avgAgeDiabetes = await db.one('SELECT AVG(age) AS average_age FROM patients WHERE condition = $1', ['Diabetes']);
    res.json(avgAgeDiabetes);
});

// Add a column room_number to your table
app.put('/patients/addRoomNumberColumn', async (req, res) => {
    await db.none('ALTER TABLE patients ADD COLUMN room_number VARCHAR(50)');
    res.send('Column "room_number" added to table "patients"');
});

// Update the table so that all patients admitted after 2023-01-01 have their room_number set to "New Wing"
app.put('/patients/updateRoomNumber', async (req, res) => {
    await db.none('UPDATE patients SET room_number = $1 WHERE admission_date > $2', ['New Wing', '2023-01-01']);
    res.send('Room numbers updated for patients admitted after 2023-01-01.');

});

// Show the names and conditions of patients in the "New Wing"
app.get('/patients/newWing', async (req, res) => {
    const newWingPatients = await db.any('SELECT name, condition FROM patients WHERE room_number = $1', ['New Wing']);
    res.json(newWingPatients);
});

app.listen(PORT, () => {
    console.log(`Server is running on port 3000.`);
});


