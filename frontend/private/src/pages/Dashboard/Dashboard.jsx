import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { config } from '../../config';

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

// Configuración de la API
const API_BASE = config.api.API_BASE;

// Datos de ejemplo como fallback
const fallbackData = {
  ventasData: {
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
  },
  productosData: {
    labels: ['Relojes', 'Membresías', 'Accesorios'],
    datasets: [
      {
        label: 'Productos',
        data: [300, 50, 100],
        backgroundColor: ['#e6c068', '#232323', '#ffd98a'],
        borderWidth: 2,
        borderColor: '#13100f',
      },
    ],
  },
  clientesData: {
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
  },
  inventarioData: {
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
  },
  ventasPorEmpleadoData: {
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
  }
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
  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para hacer peticiones a la API con cookies
  const fetchWithCredentials = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        credentials: 'include', // Incluir cookies para autenticación
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

  // Función para procesar datos de ventas por mes
  const processVentasData = (salesData) => {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ventasPorMes = {};

    salesData.forEach(sale => {
      const fecha = new Date(sale.createdAt);
      const mes = fecha.getMonth();
      const mesNombre = monthNames[mes];
      if (!ventasPorMes[mesNombre]) ventasPorMes[mesNombre] = 0;
      ventasPorMes[mesNombre] += sale.total || 0;
    });

    return {
      labels: Object.keys(ventasPorMes),
      datasets: [{
        label: 'Ventas',
        data: Object.values(ventasPorMes),
        backgroundColor: '#e6c068',
        borderRadius: 8,
        maxBarThickness: 40,
      }]
    };
  };

  // Función para procesar datos de clientes nuevos por mes
  const processClientesData = (customersData) => {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const clientesPorMes = {};

    customersData.forEach(c => {
      const fecha = new Date(c.createdAt);
      const mes = fecha.getMonth();
      const mesNombre = monthNames[mes];
      if (!clientesPorMes[mesNombre]) clientesPorMes[mesNombre] = 0;
      clientesPorMes[mesNombre]++;
    });

    return {
      labels: Object.keys(clientesPorMes),
      datasets: [{
        label: 'Clientes nuevos',
        data: Object.values(clientesPorMes),
        fill: false,
        borderColor: '#ffd98a',
        backgroundColor: '#e6c068',
        tension: 0.4,
        pointBackgroundColor: '#e6c068',
        pointBorderColor: '#232323',
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    };
  };

  // Función para procesar inventario por sucursal
  const processInventarioData = (inventoryData, branchesData) => {
    const inventarioPorSucursal = {};

    inventoryData.forEach(item => {
      // Si branchId es objeto, usa _id, si es string, úsalo directo
      const branchId = typeof item.branchId === 'object' ? item.branchId._id : item.branchId;
      if (!inventarioPorSucursal[branchId]) inventarioPorSucursal[branchId] = 0;
      inventarioPorSucursal[branchId] += item.stock || 0;
    });

    const labels = Object.keys(inventarioPorSucursal).map(branchId => {
      const branch = branchesData.find(b => b._id === branchId || (b._id && b._id.$oid === branchId));
      return branch ? branch.branch_name : branchId;
    });

    return {
      labels,
      datasets: [{
        label: 'Inventario',
        data: Object.values(inventarioPorSucursal),
        backgroundColor: ['#e6c068', '#ffd98a', '#232323', '#bfa14a'],
        borderWidth: 2,
        borderColor: '#13100f',
      }]
    };
  };

  // Función para procesar ventas por empleado
  const processVentasPorEmpleadoData = (salesData) => {
    const ventasPorEmpleado = {};

    salesData.forEach(sale => {
      if (!sale.employeeId) return;
      const empId = sale.employeeId._id;
      const empName = sale.employeeId.name || 'Empleado';
      if (!ventasPorEmpleado[empId]) ventasPorEmpleado[empId] = { total: 0, name: empName };
      ventasPorEmpleado[empId].total += sale.total || 0;
    });

    const labels = Object.values(ventasPorEmpleado).map(e => e.name);
    const data = Object.values(ventasPorEmpleado).map(e => e.total);

    return {
      labels,
      datasets: [{
        label: 'Ventas por Empleado',
        data,
        backgroundColor: ['#e6c068', '#ffd98a', '#232323', '#bfa14a', '#d4a548'],
        borderWidth: 2,
        borderColor: '#13100f',
      }]
    };
  };

  // Función para procesar distribución de productos
  const processProductosData = (watchesData, customersData) => {
    const relojes = watchesData.length;
    const clientesConMembresia = customersData.filter(
      c => c.membership && c.membership.membershipId
    ).length;

    return {
      labels: ['Relojes', 'Clientes con Membresía'],
      datasets: [{
        label: 'Productos',
        data: [relojes, clientesConMembresia],
        backgroundColor: ['#e6c068', '#232323'],
        borderWidth: 2,
        borderColor: '#13100f',
      }]
    };
  };

  // Función para procesar ventas por categoría de reloj
  const processVentasPorCategoria = (salesData) => {
    const ventasPorCategoria = {};

    salesData.forEach(sale => {
      if (!sale.selectedProducts) return;
      sale.selectedProducts.forEach(product => {
        const categoria = product.watchId && product.watchId.category ? product.watchId.category : 'Sin categoría';
        const cantidad = product.quantity || 0;
        if (!ventasPorCategoria[categoria]) ventasPorCategoria[categoria] = 0;
        ventasPorCategoria[categoria] += cantidad;
      });
    });

    return {
      labels: Object.keys(ventasPorCategoria),
      datasets: [{
        label: 'Unidades Vendidas',
        data: Object.values(ventasPorCategoria),
        backgroundColor: ['#e6c068', '#ffd98a', '#232323', '#bfa14a', '#d4a548', '#a3a3a3'],
        borderWidth: 2,
        borderColor: '#13100f',
      }]
    };
  };

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacer todas las peticiones en paralelo
        const [
          salesResponse,
          customersResponse,
          inventoryResponse,
          branchesResponse,
          employeesResponse,
          watchesResponse,
          membershipsResponse
        ] = await Promise.allSettled([
          fetchWithCredentials('/sales'),
          fetchWithCredentials('/customers'),
          fetchWithCredentials('/inventories'),
          fetchWithCredentials('/branches'),
          fetchWithCredentials('/employees'),
          fetchWithCredentials('/watches'),
          fetchWithCredentials('/memberships')
        ]);

        // Extraer datos exitosos o usar arrays vacíos como fallback
        const salesData = salesResponse.status === 'fulfilled' ? salesResponse.value : [];
        const customersData = customersResponse.status === 'fulfilled' ? customersResponse.value : [];
        const inventoryData = inventoryResponse.status === 'fulfilled' ? inventoryResponse.value : [];
        const branchesData = branchesResponse.status === 'fulfilled' ? branchesResponse.value : [];
        const employeesData = employeesResponse.status === 'fulfilled' ? employeesResponse.value : [];
        const watchesData = watchesResponse.status === 'fulfilled' ? watchesResponse.value : [];
        const membershipsData = membershipsResponse.status === 'fulfilled' ? membershipsResponse.value : [];

        // Procesar datos para las gráficas
        const newDashboardData = {
          ventasData: salesData.length > 0 ? processVentasData(salesData) : fallbackData.ventasData,
          clientesData: customersData.length > 0 ? processClientesData(customersData) : fallbackData.clientesData,
          inventarioData: inventoryData.length > 0 && branchesData.length > 0 ? 
            processInventarioData(inventoryData, branchesData) : fallbackData.inventarioData,
          ventasPorEmpleadoData: salesData.length > 0 && employeesData.length > 0 ? 
            processVentasPorEmpleadoData(salesData, employeesData) : fallbackData.ventasPorEmpleadoData,
          ventasPorCategoriaData: salesData.length > 0 ? processVentasPorCategoria(salesData) : { labels: [], datasets: [] },
        };

        setDashboardData(newDashboardData);
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
        // Usar datos de fallback en caso de error
        setDashboardData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#13100f',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e6c068',
        fontSize: '1.2rem'
      }}>
        Cargando datos del dashboard...
      </div>
    );
  }
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
        {error && (
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.9rem',
            color: '#ff6b6b',
            fontStyle: 'italic'
          }}>
            {error} - Mostrando datos de ejemplo
          </p>
        )}
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
            <Bar data={dashboardData.ventasData} options={chartOptions} />
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
            <Line data={dashboardData.clientesData} options={chartOptions} />
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
            <Bar data={dashboardData.ventasPorEmpleadoData} options={chartOptions} />
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
        {/* Ventas por Categoría de Reloj */}
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
            Ventas por Categoría de Reloj
          </h2>
          <div style={{ height: '250px' }}>
            <Bar data={dashboardData.ventasPorCategoriaData} options={chartOptions} />
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
            <Pie data={dashboardData.inventarioData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;