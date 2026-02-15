import React from 'react';
import styles from '../styles/Analytics.module.css';

const ChartContainer = ({ title, children, fullWidth }) => {
    return (
        <div className={`${styles.chartCard} ${fullWidth ? styles.fullWidth : ''}`}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div className={styles.chartWrapper}>
                {children}
            </div>
        </div>
    );
};

export default ChartContainer;
