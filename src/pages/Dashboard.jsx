
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [readings, setReadings] = useState([]);

  const [summary, setSummary] = useState({
    totalReadings: 0,
    averageGlucose: '--',
    minimumGlucose: '--',
    maximumGlucose: '--',
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const [reading, setReading] = useState({
    readingDate: new Date().toLocaleDateString('en-CA'),
    slot: 'Morning fasting',
    glucoseValue: '',
  });

  // Fetch readings and dashboard summary
  const fetchDashboard = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [readingsResponse, summaryResponse] = await Promise.all([
        fetch('http://localhost:3000/readings', { headers }),
        fetch('http://localhost:3000/reports/summary', { headers }),
      ]);

      if (readingsResponse.status === 401 || summaryResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      if (!readingsResponse.ok || !summaryResponse.ok) {
        throw new Error('Unable to load dashboard data.');
      }

      const readingsData = await readingsResponse.json();
      const summaryData = await summaryResponse.json();

      setReadings(
        Array.isArray(readingsData)
          ? readingsData
          : readingsData.data || []
      );

      setSummary(summaryData);
    } catch (error) {
      setMessage(error.message);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    fetchDashboard();
  }, [token, navigate, fetchDashboard]);

  // Handle adding and updating readings
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `http://localhost:3000/readings/${editingId}`
        : 'http://localhost:3000/readings';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reading,
          glucoseValue: Number(reading.glucoseValue),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Unable to save reading.'
        );
      }

      setMessage(
        isEditing
          ? 'Reading updated successfully! 🩷'
          : 'Reading saved successfully! 🩷'
      );

      cancelEdit();
      await fetchDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Load a reading into the form for editing
  const handleEdit = (item) => {
    setEditingId(item.id);

    setReading({
      readingDate: String(item.readingDate).slice(0, 10),
      slot: item.slot,
      glucoseValue: item.glucoseValue,
    });

    setMessage('Editing reading...');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a reading
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this reading?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/readings/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = 'Unable to delete reading.';

        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // Keep the default error message if there is no JSON response.
        }

        throw new Error(errorMessage);
      }

      if (editingId === id) {
        cancelEdit();
      }

      setMessage('Reading deleted successfully! 🩷');
      await fetchDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Cancel editing and reset the form
  const cancelEdit = () => {
    setEditingId(null);

    setReading({
      readingDate: new Date().toLocaleDateString('en-CA'),
      slot: 'Morning fasting',
      glucoseValue: '',
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Sort readings by date, newest first
  const sortedReadings = [...readings].sort((a, b) => {
    return String(b.readingDate).localeCompare(String(a.readingDate));
  });

  const latestReading = sortedReadings[0];

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>🩷 Sweety</h1>
          <p>Your Personal Blood Glucose Tracker</p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="welcome-section">
        <h2>
          Welcome{user.name ? `, ${user.name}` : ''}!
        </h2>
        <p>Take control of your health, one reading at a time.</p>
      </section>

      {/* Dashboard Summary */}
      <section className="summary-grid">

        <div className="card">
          <h3>Total Readings</h3>
          <h2>{summary.totalReadings ?? 0}</h2>
        </div>

        <div className="card">
          <h3>Average Glucose</h3>
          <h2>
            {summary.averageGlucose ?? '--'} mg/dL
          </h2>
        </div>

        <div className="card">
          <h3>Latest Reading</h3>
          <h2>
            {latestReading
              ? `${latestReading.glucoseValue} mg/dL`
              : '--'}
          </h2>
        </div>

      </section>

      {/* Add or Edit Reading */}
      <section className="card">
        <h2>
          {editingId !== null ? 'Edit Glucose Reading' : 'Add Glucose Reading'}
        </h2>

        <form className="reading-form" onSubmit={handleSubmit}>

          <label>Reading Date</label>
          <input
            type="date"
            value={reading.readingDate}
            onChange={(e) =>
              setReading({ ...reading, readingDate: e.target.value })
            }
            required
          />

          <label>Reading Slot</label>
          <select
            value={reading.slot}
            onChange={(e) =>
              setReading({ ...reading, slot: e.target.value })
            }
            required
          >
            <option value="Morning fasting">Morning fasting</option>
            <option value="After breakfast">After breakfast</option>
            <option value="After lunch">After lunch</option>
            <option value="After dinner">After dinner</option>
          </select>

          <label>Glucose Value (mg/dL)</label>
          <input
            type="number"
            min="40"
            max="600"
            step="1"
            placeholder="Enter glucose value"
            value={reading.glucoseValue}
            onChange={(e) =>
              setReading({ ...reading, glucoseValue: e.target.value })
            }
            required
          />

          <button type="submit">
            {editingId !== null ? 'Update Reading' : 'Add Reading'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ backgroundColor: '#777' }}
            >
              Cancel Edit
            </button>
          )}

        </form>

        {message && <p>{message}</p>}
      </section>

      {/* Reading History */}
      <section className="history-section">
  <h2>Reading History</h2>

  {sortedReadings.length === 0 ? (
    <p>No readings added yet.</p>
  ) : (
    sortedReadings.map((item) => (
      <div
        key={item.id}
        className="card"
        style={{ marginTop: '12px' }}
      >
        <p>
          <strong>{item.glucoseValue} mg/dL</strong>
        </p>

        <p>{item.slot}</p>
        <p>{String(item.readingDate).slice(0, 10)}</p>

        <div className="history-actions">
          <button
            type="button"
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</section>

    </div>
  );
}

export default Dashboard;
