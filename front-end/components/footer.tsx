const Footer: React.FC = () => {
  return (
    <footer
      className="w-full flex flex-col justify-center items-center py-6"
      style={{
        backgroundColor: '#2258ffde',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div className="flex flex-col items-center">
        <img
          src="/images/logo.png"
          alt="Budget Planner Footer Logo"
          style={{
            maxHeight: '80px',
            marginBottom: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        />
        <p style={{ fontSize: '14px', margin: '5px 0' }}>
          © 2024 Budget Planner. All rights reserved.
        </p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <a
          href="#"
          style={{
            margin: '0 10px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default Footer;
