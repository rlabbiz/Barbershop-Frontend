import './App.css';
import React, {useEffect, useState, useRef} from 'react';

const API = 'https://barbershop-backend-8b0f.onrender.com/api/bookings/'

function App() {
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [hour, setHour] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch(API)
      const data = await response.json();
      setData(data);
    })();
  }, [])



  return (
    <div className="App">
      <h1>Barber Shop</h1>
      <SelectDate date={date} setDate={setDate} />
      <SelecHour data={data} date={date} setHour={setHour} />
      <Validation date={date} hour={hour} />
    </div>
  );
}

const SelectDate = (props) => {
  // get today date and set it to min value of input
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);

  useEffect(() => {
    const input = document.getElementById('selectDate');

    input.addEventListener('change', (e) => {
      props.setDate(e.target.value);
    })
  } ,[props.date])

  return (
    <div className="select-date">
      <label htmlFor="selectDate">Select Date</label>
      <input type="date" min={today}  name="" id="selectDate" />
    </div>
  )
}

const SelecHour = (props) => {
  const date = props.date;

  // get all data from props.data and filter by date
  const data = props.data.filter(item => {
    return item.date === date;
  });


  useEffect(() => {
    const spans = document.querySelectorAll('.select-time span:not(.disabled)');

    spans.forEach(span => {
      span.addEventListener('click', (e) => {
        if (e.target.classList.contains('disabled')) {
          return;
        }
        spans.forEach(span => {
          span.classList.remove('active');
        })
        e.target.classList.add('active');
        const hour = e.target.textContent;
        props.setHour(hour);
      })
    })
  });

  return (
    <div className="select-time">
      <Hour hour={'09:00'} data={data} />
      <Hour hour={'10:00'} data={data} />
      <Hour hour={'11:00'} data={data} />
      <Hour hour={'12:00'} data={data} />
      <Hour hour={'01:00'} data={data} />
      <Hour hour={'02:00'} data={data} />
      <Hour hour={'03:00'} data={data} />
      <Hour hour={'04:00'} data={data} />
      <Hour hour={'05:00'} data={data} />
      <Hour hour={'06:00'} data={data} />
      <Hour hour={'07:00'} data={data} />
      <Hour hour={'08:00'} data={data} />
    </div>
  )
}

const Hour = (props) => {
  // get all data from props.data and filter by hour
  const data = props.data.filter(item => {
    return item.hour === props.hour;
  });

  if (data.length > 0) {
    return (
      <span className="disabled">{props.hour}</span>
    )
  }

  return (
    <span>{props.hour}</span>
  )
}

const Validation = (props) => {
  const date = props.date;
  const hour = props.hour;

  useEffect(() => {
    const button = document.querySelector('.validation button');

    button.addEventListener('click', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value;
      const phone = document.getElementById('phone').value;

      if (!fullName || !phone) {
        alert('Please fill all fields');
        return;
      }

      if (!hour || hour === '') 
        return;

      // save data to backend
      (async () => {
        const response = await fetch(API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: props.date,
            hour: props.hour,
            name: fullName,
            phone: phone
          })
        }).then(response => response.json())
        if (!response.error) {
          
          alert('Booking confirmed');
          window.location.reload();
        }
      })();
    })

    return () => {
      button.removeEventListener('click', () => {});
    }
  }, [hour])

  return (
    <div className="validation">
      <label htmlFor="fullName">Full Name</label>
      <input type="text" placeholder="Enter your full name" id='fullName' />

      <label htmlFor="phone">Phone</label>
      <input type="phone" placeholder="Enter your phone" id='phone' />

      <button>Confirm Booking</button>
    </div>
  )
}

export default App;
