// Sample data for construction projects in Ganei Tikva
const constructionProjects = [
    {
        id: 1,
        name: "מתחם מגורים נווה גנים",
        address: "האלה 15, גני תקווה",
        status: "in-progress",
        startDate: "2023-01-15",
        endDate: "2024-06-30",
        description: "בניית מתחם מגורים עם 120 דירות, גינה קהילתית ומתקני ספורט",
        lat: 32.0615,
        lng: 34.8732,
        contractor: "אביב הנדסה",
        floors: 8,
        units: 120
    },
    {
        id: 2,
        name: "מרכז מסחרי גני העיר",
        address: "התמר 8, גני תקווה",
        status: "planned",
        startDate: "2024-03-01",
        endDate: "2025-12-15",
        description: "מרכז מסחרי חדש עם חנויות, מסעדות ומתחם בילוי",
        lat: 32.0631,
        lng: 34.8718,
        contractor: "דנקנר פרויקטים",
        floors: 3,
        units: 25
    },
    {
        id: 3,
        name: "מגדל מגורים גני השקמה",
        address: "השקמה 22, גני תקווה",
        status: "in-progress",
        startDate: "2022-11-10",
        endDate: "2023-12-20",
        description: "מגדל מגורים יוקרתי עם 60 דירות וחניון תת-קרקעי",
        lat: 32.0602,
        lng: 34.8756,
        contractor: "שיכון ובינוי",
        floors: 12,
        units: 60
    },
    {
        id: 4,
        name: "שיפוץ בית ספר גני תקווה",
        address: "הדקל 5, גני תקווה",
        status: "completed",
        startDate: "2021-07-01",
        endDate: "2022-08-30",
        description: "שיפוץ מקיף לבית הספר היסודי כולל הוספת כיתות ומתקנים",
        lat: 32.0587,
        lng: 34.8723,
        contractor: "מנצ'ס בנייה",
        floors: 2,
        units: 0
    },
    {
        id: 5,
        name: "פארק קהילתי גני הטבע",
        address: "הברוש 12, גני תקווה",
        status: "in-progress",
        startDate: "2023-03-15",
        endDate: "2023-11-30",
        description: "פיתוח פארק קהילתי עם מתקני משחקים, מסלולי הליכה ואגם מלאכותי",
        lat: 32.0628,
        lng: 34.8771,
        contractor: "ירוק בעיר",
        floors: 0,
        units: 0
    },
    {
        id: 6,
        name: "הרחבת כביש הגישה",
        address: "שדרות גני תקווה",
        status: "planned",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        description: "הרחבת כביש הגישה הראשי לעיר והוספת מסלולי תחבורה ציבורית",
        lat: 32.0593,
        lng: 34.8698,
        contractor: "סולל בונה",
        floors: 0,
        units: 0
    }
];

// Set current date in Hebrew
document.getElementById('current-date').textContent = new Date().toLocaleDateString('he-IL');

// Create cards for each project
const cardsContainer = document.getElementById('cards-container');

constructionProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'card';
    
    let statusText = '';
    let statusClass = '';
    
    switch(project.status) {
        case 'planned':
            statusText = 'מתוכנן';
            statusClass = 'planned';
            break;
        case 'in-progress':
            statusText = 'בבנייה';
            statusClass = 'in-progress';
            break;
        case 'completed':
            statusText = 'הושלם';
            statusClass = 'completed';
            break;
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
        <span class="status ${statusClass}">${statusText}</span>
    `;
    
    cardsContainer.appendChild(card);
});

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

// Add markers for each project
constructionProjects.forEach(project => {
    let iconColor;
    
    switch(project.status) {
        case 'planned':
            iconColor = 'orange';
            break;
        case 'in-progress':
            iconColor = 'blue';
            break;
        case 'completed':
            iconColor = 'green';
            break;
        default:
            iconColor = 'gray';
    }
    
    const marker = L.marker([project.lat, project.lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">${project.id}</div>`,
            iconSize: [24, 24]
        })
    }).addTo(map);
    
    marker.bindPopup(`
        <div dir="rtl" style="text-align: right;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">${project.name}</h3>
            <p><strong>כתובת:</strong> ${project.address}</p>
            <p><strong>סטטוס:</strong> <span style="color: ${iconColor}">${statusText}</span></p>
            <p><strong>קבלן:</strong> ${project.contractor}</p>
            <p><strong>תאריך סיום מתוכנן:</strong> ${new Date(project.endDate).toLocaleDateString('he-IL')}</p>
        </div>
    `);
});

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