import React from 'react';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import styles from '../styles/Analytics.module.css';

const AnalyticsHeader = ({ onRefresh, loading, lastUpdated }) => {
    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <h1>Analytics Dashboard</h1>
                <p>Overview of inventory performance and stock levels</p>
            </div>
            <button
                className={styles.refreshButton}
                onClick={onRefresh}
                disabled={loading}
                title="Refresh Data"
            >
                <RefreshIcon sx={{ fontSize: 20 }} />
            </button>
        </div>
    );
};

export default AnalyticsHeader;
