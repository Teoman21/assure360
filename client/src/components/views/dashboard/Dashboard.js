import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment-timezone';
import './Dashboard.css';

const Dashboard = () => {
    const [claims, setClaims] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [newClients, setNewClients] = useState(0);
    const [totalClaimsAmount, setTotalClaimsAmount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const [claimsResponse, appointmentsResponse, policiesResponse, customersResponse, interactionsResponse] = await Promise.all([
                axios.get('http://localhost:3000/api/claims', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/policies', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/customers', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/interactions', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const claimsData = claimsResponse.data;
            const appointmentsData = appointmentsResponse.data.sort((a, b) => new Date(a.AppointmentDate) - new Date(b.AppointmentDate));

            setClaims(claimsData);
            setAppointments(appointmentsData);
            setPolicies(policiesResponse.data);
            setCustomers(customersResponse.data);
            setInteractions(interactionsResponse.data);
            setNewClients(customersResponse.data.length);
            setTotalClaimsAmount(claimsData.reduce((acc, claim) => acc + parseFloat(claim.ClaimAmount), 0));
            setUpcomingEvents(appointmentsData.filter(app => new Date(app.AppointmentDate) > new Date()));
        } catch (error) {
            console.error("There was an error fetching the dashboard data!", error);
        }
    };

    const claimsData = {
        labels: claims.map(claim => moment.tz(claim.DateFiled, 'UTC').tz('Europe/Istanbul').format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Claims Amount',
                data: claims.map(claim => claim.ClaimAmount),
                fill: false,
                borderColor: '#4caf50'
            }
        ]
    };

    const aggregatedAppointments = appointments.reduce((acc, appointment) => {
        const date = moment.tz(appointment.AppointmentDate, 'UTC').tz('Europe/Istanbul').format('DD-MM-YYYY');
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});

    const sortedAppointmentDates = Object.keys(aggregatedAppointments).sort((a, b) => moment(a, 'DD-MM-YYYY') - moment(b, 'DD-MM-YYYY'));

    const appointmentsData = {
        labels: sortedAppointmentDates,
        datasets: [
            {
                label: 'Appointments',
                data: sortedAppointmentDates.map(date => aggregatedAppointments[date]),
                fill: false,
                borderColor: '#007bff'
            }
        ]
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="summary-cards">
                <div className="card income-card">
                    <h2>Total Claims Amount</h2>
                    <p>{totalClaimsAmount.toFixed(2)}</p>
                    <span>From whole period</span>
                </div>
                <div className="card orders-card">
                    <h2>Total Policies</h2>
                    <p>{policies.length}</p>
                </div>
                <div className="card clients-card">
                    <h2>Total Customers</h2>
                    <p>{newClients}</p>
                </div>
                <div className="card events-card">
                    <h2>Upcoming events</h2>
                    <p>{upcomingEvents.length ? moment.tz(upcomingEvents[0].AppointmentDate, 'UTC').tz('Europe/Istanbul').format('DD-MM-YYYY HH:mm') : 'There are no upcoming events'}</p>
                </div>
            </div>
            <div className="charts">
                <div className="chart-container">
                    <h3>Claims</h3>
                    <Line data={claimsData} />
                </div>
                <div className="chart-container">
                    <h3>Appointments</h3>
                    <Line data={appointmentsData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
