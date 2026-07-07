document.addEventListener('DOMContentLoaded', () => {
    fetchPatients();
    const form = document.getElementById('patientForm');
    
    // Smooth submit handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSubmit = form.querySelector('.btn-submit');
        const originalText = btnSubmit.innerHTML;

        // Change button to Loading state
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        btnSubmit.disabled = true;

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const disease = document.getElementById('disease').value;

        try {
            // UPDATED PATH: from '/books' to '/patients'
            const res = await fetch('/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, disease })
            });

            if (res.ok) {
                form.reset();
                // Fetch again to show the new row with a nice fade-in effect
                await fetchPatients(true); 
            } else {
                alert('Error adding patient record.');
            }
        } catch (error) {
            console.error('Submit Error:', error);
        } finally {
            // Restore button state
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    });
});

// Fetch all patients with optional highlight for the new entry
async function fetchPatients(highlightNew = false) {
    try {
        // UPDATED PATH: from '/Book' to '/patients'
        const res = await fetch('/patients');
        const patients = await res.json();
        
        const tbody = document.getElementById('patientTableBody');
        tbody.innerHTML = '';

        if (patients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#6b7280; padding:30px;">
                <i class="fas fa-folder-open" style="font-size:2rem; margin-bottom:10px; display:block;"></i>
                No patient records found.
            </td></tr>`;
            return;
        }

        patients.forEach((p, index) => {
            const tr = document.createElement('tr');
            
            // Add a temporary highlight class if this is the newly added row
            if (highlightNew && index === patients.length - 1) {
                tr.style.animation = 'fadeInHighlight 2s ease-out';
            }

            // Shorten the ID if it's based on timestamp (for cleaner look)
            const shortId = p.id.toString().slice(-6);

            // Structure TD HTML with appropriate Icons and spacing
            tr.innerHTML = `
                <td>#${shortId}</td>
                <td><i class="fas fa-user" style="color:#cbd5e1; margin-right:8px;"></i>${p.name}</td>
                <td>${p.age}</td>
                <td><span class="disease-tag">${p.disease}</span></td>
                <td>${p.date}</td>
                <td>
                    <button class="btn-delete" onclick="deletePatient(${p.id}, this)">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

// Global function to delete with animation
async function deletePatient(id, buttonEl) {
    if (confirm('Are you sure you want to delete this patient record?')) {
        // Find the parent table row
        const row = buttonEl.closest('tr');
        
        try {
            // UPDATED PATH: from `/books/${id}` to `/patients/${id}`
            const res = await fetch(`/patients/${id}`, { method: 'DELETE' });
            
            if (res.ok) {
                // Add fade-out animation before removing from DOM
                row.style.transition = 'all 0.5s ease-out';
                row.style.opacity = '0';
                row.style.transform = 'translateX(50px)';
                
                setTimeout(() => {
                    fetchPatients();
                }, 500);
            } else {
                alert('Could not delete record.');
            }
        } catch (error) {
            console.error('Delete Error:', error);
        }
    }
}

// Add custom animation for highligthing new rows via JS injection
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInHighlight {
        0% { background-color: #dbeafe; opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        100% { background-color: transparent; }
    }
    .disease-tag {
        background: #f1f5f9;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.85rem;
        color: #475569;
        border: 1px solid #e2e8f0;
    }
`;
document.head.appendChild(style);