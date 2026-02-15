import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Inventory,
    TrendingUp,
    Warning,
    LocalShipping,
} from '@mui/icons-material';
import {
    fetchConsumptionSummary,
    fetchTopConsumed,
    fetchLowStock,
    fetchPCBProductionSummary,
    fetchStockAlerts,
    fetchProcurementStatus,
    clearError,
} from './analyticsSlice';

import styles from './styles/Analytics.module.css';
import AnalyticsHeader from './components/AnalyticsHeader';
import { KPISection, KPICard } from './components/KPISection';
import AnalyticsTabs from './components/AnalyticsTabs';
import ConsumptionCharts from './components/ConsumptionCharts';
import TopConsumedTable from './components/TopConsumedTable';
import LowStockTable from './components/LowStockTable';
import ProductionCharts from './components/ProductionCharts';
import ProcurementTable from './components/ProcurementTable';

const AnalyticsDashboard = () => {
    const dispatch = useDispatch();
    const {
        consumptionSummary,
        topConsumed,
        lowStock,
        pcbProductionSummary,
        stockAlerts, // Note: This data was fetched but not explicitly used in the original separate tabs, often combined with consumption or low stock.
        procurementStatus,
        loading,
        error,
    } = useSelector((state) => state.analytics);

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // load data for the initially active tab
        fetchTabData(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const loadAllData = () => {
        dispatch(fetchConsumptionSummary());
        dispatch(fetchTopConsumed({ limit: 20 }));
        dispatch(fetchLowStock());
        dispatch(fetchPCBProductionSummary());
        dispatch(fetchStockAlerts());
        dispatch(fetchProcurementStatus());
    };

    const fetchTabData = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                dispatch(fetchConsumptionSummary());
                dispatch(fetchStockAlerts());
                break;
            case 1:
                dispatch(fetchTopConsumed({ limit: 20 }));
                break;
            case 2:
                dispatch(fetchLowStock());
                break;
            case 3:
                dispatch(fetchPCBProductionSummary());
                break;
            case 4:
                dispatch(fetchProcurementStatus());
                break;
            default:
                break;
        }
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
        fetchTabData(index);
    };

    // Calculate key metrics
    const totalComponents = consumptionSummary.length;
    const lowStockCount = lowStock.length;
    const totalConsumed = consumptionSummary.reduce(
        (sum, item) => sum + (item.total_consumed || 0),
        0
    );
    const pendingProcurement = procurementStatus.filter(
        (item) => item.status === 'pending'
    ).length;

    const tabs = [
        "Consumption Analysis",
        "Top Consumed",
        "Low Stock Alerts",
        "PCB Production",
        "Procurement Status"
    ];

    return (
        <div className={styles.container}>
            <AnalyticsHeader
                onRefresh={loadAllData}
                loading={loading}
            />

            {error && (
                <div style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', border: '1px solid #FECACA' }}>
                    {error.message || 'Error loading analytics data'}
                    <button onClick={() => dispatch(clearError())} style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#991B1B' }}>
                        Dismiss
                    </button>
                </div>
            )}

            {loading && (
                <div style={{ height: '4px', width: '100%', backgroundColor: '#E2E8F0', marginBottom: '24px', overflow: 'hidden', borderRadius: '2px' }}>
                    <div style={{ height: '100%', backgroundColor: '#3B82F6', width: '50%', animation: 'loading 1s infinite ease-in-out', transformOrigin: '0% 50%' }} />
                    <style>{`
                        @keyframes loading {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(200%); }
                        }
                    `}</style>
                </div>
            )}

            <KPISection>
                <KPICard
                    label="Total Components"
                    value={totalComponents}
                    icon={<Inventory />}
                    accentColor="Blue"
                />
                <KPICard
                    label="Total Consumed"
                    value={totalConsumed.toLocaleString()}
                    icon={<TrendingUp />}
                    accentColor="Teal"
                />
                <KPICard
                    label="Low Stock Items"
                    value={lowStockCount}
                    icon={<Warning />}
                    accentColor="Red"
                />
                <KPICard
                    label="Pending Procurement"
                    value={pendingProcurement}
                    icon={<LocalShipping />}
                    accentColor="Orange"
                />
            </KPISection>

            <AnalyticsTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs}
            />

            <div className={styles.tabContent}>
                {activeTab === 0 && (
                    <ConsumptionCharts
                        consumptionSummary={consumptionSummary}
                        totalComponents={totalComponents}
                        lowStockCount={lowStockCount}
                    />
                )}
                {activeTab === 1 && (
                    <TopConsumedTable topConsumed={topConsumed} />
                )}
                {activeTab === 2 && (
                    <LowStockTable lowStock={lowStock} />
                )}
                {activeTab === 3 && (
                    <ProductionCharts pcbProductionSummary={pcbProductionSummary} />
                )}
                {activeTab === 4 && (
                    <ProcurementTable procurementStatus={procurementStatus} />
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
