import React, { useEffect, useState } from 'react';
import './App.css';
import MapComponent from './MapComponent'; // Import the map component

// Define a simple Card component
const Card = ({ title, description, location }) => (
  <div className="card">
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {location && <p><strong>מיקום:</strong> {location}</p>}
  </div>
);

function App() {
  const [currentDate, setCurrentDate] = useState('');
  const [cardsData, setCardsData] = useState([]);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    // Set document title
    document.title = 'אזורי בנייה בגני תקווה';

    // Set current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('he-IL', options));

    // Fetch card data from jsondb.json
    fetch('/jsondb.json') // Path relative to the public folder
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Assuming data is an array of card objects
        // And each object has 'name', 'description', 'address'
        if (Array.isArray(data) && data.every(item => typeof item.name !== 'undefined')) {
          const formattedData = data.map(item => ({
            id: item.id,
            title: item.name, // Map 'name' to 'title'
            description: item.description,
            location: item.address // Map 'address' to 'location'
            // You can add other fields here if needed by the Card component
          }));
          setCardsData(formattedData);
        } else {
          // Data is not in expected format, use placeholders
          console.warn("Data from jsondb.json is not in the expected format or 'name' field is missing. Using placeholder cards.");
          setCardsData(getPlaceholderCards());
        }
      })
      .catch(error => {
        console.error("Could not fetch or parse jsondb.json:", error);
        setLoadingError("שגיאה בטעינת נתוני הפרויקטים.");
        setCardsData(getPlaceholderCards()); // Fallback to placeholders on error
      });
  }, []);

  const getPlaceholderCards = () => [
    { id: 'p1', title: 'פרויקט לדוגמה 1', description: 'תיאור הפרויקט הראשון באזור זה.', location: 'רחוב לדוגמה 123, גני תקווה' },
    { id: 'p2', title: 'פרויקט לדוגמה 2', description: 'תיאור קצר על פרויקט נוסף.', location: 'שדרות התמרים 45, גני תקווה' },
    { id: 'p3', title: 'פרויקט לדוגמה 3', description: 'מידע על בניין חדש.', location: 'סמטת הפרחים 7, גני תקווה' },
  ];

  return (
    <div className="container">
      <header>
        <h1>אזורי בנייה פעילים בגני תקווה</h1>
        <p>מידע על פרויקטים בבנייה בעיר, נכון לתאריך <span id="current-date">{currentDate}</span></p>
      </header>

      <div className="cards-container" id="cards-container">
        {loadingError && <p className="error-message">{loadingError}</p>}
        {!loadingError && cardsData.length === 0 && <p>טוען כרטיסיות פרויקטים...</p>}
        {cardsData.map((card, index) => (
          <Card
            key={card.id || index} // Use a unique id if available, otherwise index
            title={card.title}
            description={card.description}
            location={card.location}
          />
        ))}
      </div>

      <div className="map-container">
        <MapComponent />
      </div>

      <footer>
        <p>© {new Date().getFullYear()} עיריית גני תקווה | נתונים להמחשה בלבד</p>
      </footer>
    </div>
  );
}

export default App;
