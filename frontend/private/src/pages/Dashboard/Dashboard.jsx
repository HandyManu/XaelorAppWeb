import React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Datos de ejemplo
const ventasData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas',
      data: [120, 190, 300, 250, 220],
      backgroundColor: '#e6c068',
      borderRadius: 8,
      maxBarThickness: 40,
    },
  ],
};

const productosData = {
  labels: ['Relojes', 'Membresías', 'Accesorios'],
  datasets: [
    {
      label: 'Productos',
      data: [300, 50, 100],
      backgroundColor: [
        '#e6c068',
        '#232323',
        '#ffd98a'
      ],
      borderWidth: 2,
      borderColor: '#13100f',
    },
  ],
};

const clientesData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Clientes nuevos',
      data: [30, 45, 60, 40, 70],
      fill: false,
      borderColor: '#ffd98a',
      backgroundColor: '#e6c068',
      tension: 0.4,
      pointBackgroundColor: '#e6c068',
      pointBorderColor: '#232323',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const inventarioData = {
  labels: ['Sucursal 1', 'Sucursal 2', 'Sucursal 3'],
  datasets: [
    {
      label: 'Inventario',
      data: [120, 80, 150],
      backgroundColor: ['#e6c068', '#ffd98a', '#232323'],
      borderWidth: 2,
      borderColor: '#13100f',
    },
  ],
};

const ventasPorEmpleadoData = {
  labels: ['Ana', 'Luis', 'Carlos', 'María'],
  datasets: [
    {
      label: 'Ventas por Empleado',
      data: [50, 70, 40, 90],
      backgroundColor: ['#e6c068', '#ffd98a', '#232323', '#bfa14a'],
      borderWidth: 2,
      borderColor: '#13100f',
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#ffd98a',
        font: { size: 12 }
      }
    }
  },
  scales: {
    x: {
      grid: { color: '#232323' },
      ticks: { color: '#e6c068', font: { size: 11 } }
    },
    y: {
      grid: { color: '#232323' },
      ticks: { color: '#e6c068', font: { size: 11 } }
    }
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#ffd98a',
        font: { size: 11 },
        padding: 15,
        usePointStyle: true
      }
    }
  }
};

const Dashboard = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#13100f',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header de Bienvenida */}
      <div style={{
        background: 'linear-gradient(90deg, #232323 60%, #e6c06822 100%)',
        borderRadius: '18px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 24px rgba(230, 192, 104, 0.10)',
        textAlign: 'left',
        color: '#ffd98a'
      }}>
        <h1 style={{
          margin: '0 0 0.5rem 0',
          fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
          color: '#e6c068',
          fontWeight: '700'
        }}>
          ¡Bienvenido a Xælör!
        </h1>
        <p style={{
          margin: '0',
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: '#ffd98a'
        }}>
          Administra tu tienda y consulta las métricas clave de un vistazo.
        </p>
      </div>

      {/* Grid de Gráficas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Ventas Mensuales */}
        <div style={{
          background: '#232323',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 4px 24px rgba(230, 192, 104, 0.08)',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: '#ffd98a',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Ventas Mensuales
          </h2>
          <div style={{ height: '250px' }}>
            <Bar data={ventasData} options={chartOptions} />
          </div>
        </div>

        {/* Clientes Nuevos */}
        <div style={{
          background: '#232323',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 4px 24px rgba(230, 192, 104, 0.08)',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: '#ffd98a',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Clientes Nuevos
          </h2>
          <div style={{ height: '250px' }}>
            <Line data={clientesData} options={chartOptions} />
          </div>
        </div>

        {/* Ventas por Empleado */}
        <div style={{
          background: '#232323',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 4px 24px rgba(230, 192, 104, 0.08)',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: '#ffd98a',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Ventas por Empleado
          </h2>
          <div style={{ height: '250px' }}>
            <Bar data={ventasPorEmpleadoData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Grid para gráficas circulares */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Distribución de Productos */}
        <div style={{
          background: '#232323',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 4px 24px rgba(230, 192, 104, 0.08)',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: '#ffd98a',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Distribución de Productos
          </h2>
          <div style={{ height: '250px' }}>
            <Doughnut data={productosData} options={pieChartOptions} />
          </div>
        </div>

        {/* Inventario por Sucursal */}
        <div style={{
          background: '#232323',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 4px 24px rgba(230, 192, 104, 0.08)',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: '#ffd98a',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Inventario por Sucursal
          </h2>
          <div style={{ height: '250px' }}>
            <Pie data={inventarioData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;