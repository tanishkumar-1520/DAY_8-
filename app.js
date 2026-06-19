document.addEventListener('DOMContentLoaded', () => {
    fetchPatients();
    const form = document.getElementById('patientForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const disease = document.getElementById('disease').value;

        const res = await fetch('/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, disease })
        });

        if (res.ok) {
            alert('Patient added!');
            form.reset();
            fetchPatients();
        }
    });
});

async function fetchPatients() {
    const res = await fetch('/Book');
    const patients = await res.json();
    const tbody = document.getElementById('patientTableBody');
    tbody.innerHTML = '';

    patients.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.disease}</td>
            <td>${p.date}</td>
            <td><button class="btn-delete" onclick="deletePatient(${p.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function deletePatient(id) {
    if (confirm('Delete this record?')) {
        const res = await fetch(`/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Deleted!');
            fetchPatients();
        }
    }
}
