import React, { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import './SpinningWheel.css';

const PUSHER_KEY = '53f19cf742eb0ff1d28b';
const PUSHER_CLUSTER = 'eu';

const names = [
'JOHN SAMUEL',
'PHILOMOL VARGHESE',
'MRUDHULA',
'SOBIN',
'JISHA POULOSE',
'JIJU',
'JAMES',
'REMYA RENJU',
];

const SEGMENTS = names.length;
const SEGMENT_ANGLE = 360 / SEGMENTS;
const RADIUS = 200;

export default function SpinningWheelD() {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerAngle, setWinnerAngle] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('chittiD-channel');
    channel.bind('chittiD-event', (data) => {
      spinWheel(data.angle);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    setPasswordValid(password === 'cd');
  }, [password]);

  const spinWheel = (angle) => {
    if (!wheelRef.current) return;
    setSpinning(true);
    setWinner(null);

    const totalRotations = 30; // 30 rotations for fast spin
    const totalRotation = 360 * totalRotations + (angle % 360);

    wheelRef.current.style.transition = 'transform 40s ease-out'; // 40 seconds duration
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      setSpinning(false);
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `rotate(${angle % 360}deg)`;

      const normalizedAngle = angle % 360;
      const effectiveAngle = (360 - normalizedAngle + 90) % 360; // arrow fixed at 90deg
      const winnerIndex = Math.floor(effectiveAngle / SEGMENT_ANGLE) % SEGMENTS;

      setWinner(names[winnerIndex]);
      setWinnerAngle(winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    }, 40000); // timeout just over 40s spin
  };



  const triggerSpin = async () => {
    if (!passwordValid) {
      alert('Incorrect password! Please enter the correct password to spin.');
      return;
    }
    
    // Send a request to your backend to initiate the spin
    try {
      await axios.get('https://edmamalayalee.co.uk/api/spin-d.php');
    } catch (err) {
      console.error('Spin request failed:', err);
    }
  };

  const createSegmentPath = (angle) => {
    const rad = (angle * Math.PI) / 180;
    const x = RADIUS * Math.cos(rad);
    const y = RADIUS * Math.sin(rad);
    return `M0 0 L${RADIUS} 0 A${RADIUS} ${RADIUS} 0 0 1 ${x} ${y} Z`;
  };

  return (
    <div
      style={{
        width: RADIUS * 2 ,
        position: 'relative',
        userSelect: 'none',
        textAlign: 'center',
        margin: '0 auto',
        paddingBottom: 100,
        // marginLeft:'-5 %'
        
      }}
    >
      <h2 style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '28px' }}>Chitti-D</h2>

      <svg
        ref={wheelRef}
        className="wheel"
        width={RADIUS * 2 }
        height={RADIUS * 2 + 50}
        viewBox={`${-RADIUS - 25} ${-RADIUS - 25} ${RADIUS * 2 + 50} ${RADIUS * 2 + 50}`}
        style={{ transition: spinning ? 'transform 40s ease-out' : 'none' }}
      >
        {names.map((name, i) => {
          const rotation = i * SEGMENT_ANGLE;
          const isWinner = winner && name === winner; // Check if this segment is the winner
          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d={createSegmentPath(SEGMENT_ANGLE)}
                fill={isWinner ? '#32CD32' : (i % 2 === 0 ? '#FFD700' : '#FFA500')} // Highlight winner in green
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={RADIUS / 2}
                y="10"
                fill="#000"
                fontSize="18"
                fontWeight="bold"
                transform={`rotate(${SEGMENT_ANGLE / 2})`}
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ userSelect: 'none' }}
              >
                {name}
              </text>
            </g>
          );
        })}
        <circle cx="0" cy="0" r={RADIUS / 6} fill="#fff" stroke="#333" strokeWidth="2" />

        {/* Fixed Internal Indicators for Each Segment */}
        {names.map((_, i) => {
          const angle = i * SEGMENT_ANGLE;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={RADIUS / 1.5 * Math.cos((angle * Math.PI) / 180)}
              y2={RADIUS / 1.5 * Math.sin((angle * Math.PI) / 180)}
              stroke="black"
              strokeWidth="2"
              strokeDasharray="5,5" // Dashed line for visibility
            />
          );
        })}
      </svg>

      {/* Fixed Winning Indicator Arrow */}
         <div
          style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)', // Center the arrow above the wheel
          width: '0',
          height: '0',
          borderLeft: '12px solid transparent', // Increased size
          borderRight: '12px solid transparent', // Increased size
          borderBottom: '24px solid red', // Increased size
        }}
      />


      <div style={{ marginTop: 15 }}>
        <input
          type="password"
          placeholder="Enter password to spin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '12px',
            width: '220px',
            textAlign: 'center',
          }}
          disabled={spinning}
        />
      </div>

      {winner && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontWeight: 'bold',
            fontSize: '24',
            color: 'green',
            userSelect: 'none',
            minHeight: '30px',
          }}
        >
          🎉 Winner: {winner} 🎉
        </div>
      )}

      <button
        onClick={triggerSpin}
        disabled={spinning || !passwordValid}
        style={{
          marginTop: 10,
          padding: '12px 24px',
          fontSize: '18px',
          cursor: spinning || !passwordValid ? 'not-allowed' : 'pointer',
          backgroundColor: passwordValid ? '#4CAF50' : '#AAA',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
}
