import React from 'react';
import styles from '../styles/Analytics.module.css';

export const KPICard = ({ label, value, icon, accentColor }) => {
    // Map accent color names to CSS classes
    const accentClass = styles[`accent${accentColor}`] || '';

    return (
        <div className={`${styles.kpiCard} ${accentClass}`}>
            <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>{label}</span>
                <div className={styles.kpiIcon}>
                    {icon}
                </div>
            </div>
            <div className={styles.kpiValue}>
                {value}
            </div>
        </div>
    );
};

export const KPISection = ({ children }) => {
    return (
        <div className={styles.kpiGrid}>
            {children}
        </div>
    );
};
