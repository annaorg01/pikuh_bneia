// Set current date in Hebrew
document.getElementById('current-date').textContent = new Date().toLocaleDateString('he-IL');

// Initialize the map
const map = L.map('map').setView([32.0611, 34.8735], 14);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add Hebrew tile layer (optional)
L.tileLayer('https://tile.maps.israelmapped.com/osm_tiles/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://israelmapped.com/">Israel Mapped</a>',
    maxZoom: 18
}).addTo(map);

// Add a legend
const legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
    div.dir = 'rtl';
    div.innerHTML = `
        <h4 style="margin: 0 0 10px 0; text-align: right;">מקרא</h4>
        <div style="display: flex; align-items: center; margin-bottom: 5px; justify-content: flex-end;">
            <span style="display: inline-block; width: 15px; height: 15px; background-color: blue; border-radius: 50%; margin-left: 5px;"></span>
            <span>בבנייה</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px; justify-content: flex-end;">
            <span style="display: inline-block; width: 15px; height: 15px; background-color: orange; border-radius: 50%; margin-left: 5px;"></span>
            <span>מתוכנן</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end;">
            <span style="display: inline-block; width: 15px; height: 15px; background-color: green; border-radius: 50%; margin-left: 5px;"></span>
            <span>הושלם</span>
        </div>
    `;
    return div;
};

legend.addTo(map);

const projectMarkers = {}; // Object to store markers by project ID

// Fetch project data from jsondb.json
fetch('./jsondb.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(constructionProjects => {
        const cardsContainer = document.getElementById('cards-container');
        if (!cardsContainer) {
            console.error('Error: cards-container element not found!');
            return; // Stop processing if essential container is missing
        }

        if (!Array.isArray(constructionProjects) || constructionProjects.length === 0) {
            cardsContainer.innerHTML = '<p class="info-message">אין כרגע פרויקטים פעילים להצגה.</p>';
            if (legend && legend.getContainer()) { // Check if legend is on map
                legend.remove(); // Remove legend if there are no projects
            }
            return; // Stop further processing
        }

        // Create cards for each project
        constructionProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `card-project-${project.id}`; // Assign unique ID to the card
            card.dataset.projectId = project.id; // Set project ID as data attribute

            let statusTextCard = ''; // Renamed for clarity within card loop
            let statusClass = '';

            switch(project.status) {
                case 'planned':
                    statusTextCard = 'מתוכנן';
                    statusClass = 'planned';
                    break;
                case 'in-progress':
                    statusTextCard = 'בבנייה';
                    statusClass = 'in-progress';
                    break;
                case 'completed':
                    statusTextCard = 'הושלם';
                    statusClass = 'completed';
                    break;
                default:
                    statusTextCard = 'לא ידוע';
                    statusClass = 'unknown';
            }

            card.innerHTML = `
                <h2>${project.name}</h2>
                <p><strong>מיקום:</strong> ${project.address}</p>
                <p><strong>תיאור:</strong> ${project.description}</p>
                <p><strong>קבלן:</strong> ${project.contractor}</p>
                <p><strong>תאריך התחלה:</strong> ${new Date(project.startDate).toLocaleDateString('he-IL')}</p>
                <p><strong>תאריך סיום:</strong> ${new Date(project.endDate).toLocaleDateString('he-IL')}</p>
                ${project.floors > 0 ? `<p><strong>קומות:</strong> ${project.floors}</p>` : ''}
                ${project.units > 0 ? `<p><strong>יחידות:</strong> ${project.units}</p>` : ''}
                <span class="status ${statusClass}">${statusTextCard}</span>
            `;

            cardsContainer.appendChild(card);

            // Add click listener to the card
            card.addEventListener('click', function() {
                const projectId = this.dataset.projectId;
                const targetMarker = projectMarkers[projectId];

                if (targetMarker) {
                    map.flyTo(targetMarker.getLatLng(), 16); // Adjust zoom level as needed
                    targetMarker.openPopup();
                }

                // Optional: Highlight clicked card and remove from others
                const highlighted = document.querySelector('.highlighted-card');
                if (highlighted) {
                    highlighted.classList.remove('highlighted-card');
                }
                this.classList.add('highlighted-card');
            });
        });

        // Add markers for each project
        constructionProjects.forEach(project => {
            let iconColor;
            let statusTextMarker = ''; // Ensure this is defined and assigned for markers

            switch(project.status) {
                case 'planned':
                    iconColor = 'orange';
                    statusTextMarker = 'מתוכנן';
                    break;
                case 'in-progress':
                    iconColor = 'blue';
                    statusTextMarker = 'בבנייה';
                    break;
                case 'completed':
                    iconColor = 'green';
                    statusTextMarker = 'הושלם';
                    break;
                default:
                    iconColor = 'gray';
                    statusTextMarker = 'לא ידוע';
            }

            const marker = L.marker([project.lat, project.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">${project.id}</div>`,
                    iconSize: [24, 24]
                })
            }).addTo(map);

            projectMarkers[project.id] = marker; // Store the marker

            // Add click event listener to the marker
            marker.on('click', function() {
                // Remove highlight from any previously selected card
                const highlighted = document.querySelector('.highlighted-card');
                if (highlighted) {
                    highlighted.classList.remove('highlighted-card');
                }

                // Highlight the current card
                const cardElement = document.getElementById(`card-project-${project.id}`);
                if (cardElement) {
                    cardElement.classList.add('highlighted-card');
                    cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });

            marker.bindPopup(`
                <div dir="rtl" style="text-align: right;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">${project.name}</h3>
                    <p><strong>כתובת:</strong> ${project.address}</p>
                    <p><strong>סטטוס:</strong> <span style="color: ${iconColor}">${statusTextMarker}</span></p>
                    <p><strong>קבלן:</strong> ${project.contractor}</p>
                    <p><strong>תאריך סיום מתוכנן:</strong> ${new Date(project.endDate).toLocaleDateString('he-IL')}</p>
                </div>
            `);
        });
    })
    .catch(error => {
        console.error('Error fetching or processing project data:', error);
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = '<p class="error-message">מצטערים, ארעה שגיאה בטעינת נתוני הפרויקטים. אנא נסו לרענן את הדף מאוחר יותר.</p>';
        }
        // If the map or legend was initialized before this point and an error occurs,
        // you might want to hide or clear them as well.
        // For example, if map initialization is outside/before fetch:
        // if (map && typeof map.remove === 'function') map.remove();
        if (legend && legend.getContainer()) { // Check if legend is on map
             legend.remove();
        }
    });